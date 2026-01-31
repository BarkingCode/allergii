import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Agent, run, tool } from "@openai/agents";
import { z } from "zod";

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// =============================================================================
// TOOLS
// =============================================================================

const getCurrentConditions = tool({
  name: "get_current_conditions",
  description: "Get current weather, air quality, and pollen levels for a location",
  parameters: z.object({
    latitude: z.number().describe("Latitude of the location"),
    longitude: z.number().describe("Longitude of the location"),
  }),
  execute: async ({ latitude, longitude }) => {
    const weatherApiKey = process.env.WEATHER_API_KEY;
    const googleKey = process.env.GOOGLE_API_KEY;

    // Fetch weather data
    const weatherUrl = `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${latitude},${longitude}&aqi=yes`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    // Fetch pollen data
    const pollenUrl = `https://pollen.googleapis.com/v1/forecast:lookup?key=${googleKey}&location.latitude=${latitude}&location.longitude=${longitude}&days=1`;
    const pollenRes = await fetch(pollenUrl);
    const pollenData = await pollenRes.json();

    // Fetch air quality
    const aqUrl = `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${googleKey}`;
    const aqRes = await fetch(aqUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: { latitude, longitude },
        universalAqi: true,
      }),
    });
    const aqData = await aqRes.json();

    return {
      weather: {
        temp_c: weatherData.current?.temp_c,
        humidity: weatherData.current?.humidity,
        condition: weatherData.current?.condition?.text,
        wind_kph: weatherData.current?.wind_kph,
      },
      airQuality: {
        aqi: aqData.indexes?.[0]?.aqi,
        category: aqData.indexes?.[0]?.category,
        dominantPollutant: aqData.indexes?.[0]?.dominantPollutant,
      },
      pollen: pollenData.dailyInfo?.[0]?.pollenTypeInfo?.map((p: any) => ({
        type: p.displayName,
        level: p.indexInfo?.category,
        inSeason: p.inSeason,
      })),
    };
  },
});

const getForecast = tool({
  name: "get_forecast",
  description: "Get weather and pollen forecast for upcoming days",
  parameters: z.object({
    latitude: z.number(),
    longitude: z.number(),
    days: z.number().min(1).max(5).default(3),
  }),
  execute: async ({ latitude, longitude, days }) => {
    const weatherApiKey = process.env.WEATHER_API_KEY;
    const googleKey = process.env.GOOGLE_API_KEY;

    const weatherUrl = `https://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${latitude},${longitude}&days=${days}&aqi=yes`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    const pollenUrl = `https://pollen.googleapis.com/v1/forecast:lookup?key=${googleKey}&location.latitude=${latitude}&location.longitude=${longitude}&days=${days}`;
    const pollenRes = await fetch(pollenUrl);
    const pollenData = await pollenRes.json();

    return {
      forecast: weatherData.forecast?.forecastday?.map((day: any) => ({
        date: day.date,
        maxTemp: day.day.maxtemp_c,
        minTemp: day.day.mintemp_c,
        condition: day.day.condition?.text,
        chanceOfRain: day.day.daily_chance_of_rain,
        humidity: day.day.avghumidity,
      })),
      pollen: pollenData.dailyInfo?.map((day: any) => ({
        date: `${day.date.year}-${day.date.month}-${day.date.day}`,
        types: day.pollenTypeInfo?.map((p: any) => ({
          type: p.displayName,
          level: p.indexInfo?.category,
        })),
      })),
    };
  },
});

const getConversationHistory = tool({
  name: "get_conversation_history",
  description: "Get recent conversation history for context",
  parameters: z.object({
    deviceId: z.string(),
    limit: z.number().min(1).max(20).default(10),
  }),
  execute: async ({ deviceId, limit }) => {
    const messagesRef = db
      .collection("conversations")
      .doc(deviceId)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .limit(limit);

    const snapshot = await messagesRef.get();
    const messages = snapshot.docs.map((doc) => doc.data()).reverse();

    return { messages };
  },
});

// =============================================================================
// AGENT DEFINITION
// =============================================================================

const allergyAdvisor = new Agent({
  name: "AllergyAdvisor",
  model: "gpt-4o-mini",
  instructions: `You are AllergyAdvisor, a specialized assistant for people with allergies and weather sensitivities.

Your expertise:
- Seasonal allergies (pollen, grass, trees, weeds)
- Air quality impacts (PM2.5, PM10, ozone, pollution)
- Weather-related symptoms (humidity, temperature changes, wind)
- Mold and dust sensitivities
- Cross-reactivity between allergens and foods

Your role:
- Analyze current conditions and predict how they may affect the user
- Provide actionable, personalized recommendations
- Track patterns in user symptoms over time
- Suggest preventive measures before high-risk days

Communication style:
- Warm but concise
- Focus on actionable advice
- Use simple language, avoid medical jargon
- Always note that you're not a replacement for medical advice

Never:
- Diagnose conditions
- Recommend specific medications by name
- Provide medical treatment plans`,
  tools: [getCurrentConditions, getForecast, getConversationHistory],
});

// =============================================================================
// API ENDPOINTS
// =============================================================================

// Health check
export const health = functions.https.onRequest((req, res) => {
  res.json({ status: "ok", agent: "AllergyAdvisor", version: "1.0.0" });
});

// Chat endpoint
export const chat = functions.https.onRequest(async (req, res) => {
  // CORS
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { deviceId, message, location } = req.body;

    if (!deviceId || !message) {
      res.status(400).json({ error: "deviceId and message are required" });
      return;
    }

    // Store user message
    const userMessageRef = db
      .collection("conversations")
      .doc(deviceId)
      .collection("messages")
      .doc();

    await userMessageRef.set({
      role: "user",
      content: message,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      location: location || null,
    });

    // Build context
    let contextMessage = message;
    if (location) {
      contextMessage = `[User location: ${location.latitude}, ${location.longitude}]\n\n${message}`;
    }

    // Run agent
    const result = await run(allergyAdvisor, contextMessage);
    const response = result.finalOutput as string;

    // Store assistant response
    const assistantMessageRef = db
      .collection("conversations")
      .doc(deviceId)
      .collection("messages")
      .doc();

    await assistantMessageRef.set({
      role: "assistant",
      content: response,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Update metadata
    await db.collection("conversations").doc(deviceId).set(
      {
        lastActive: admin.firestore.FieldValue.serverTimestamp(),
        messageCount: admin.firestore.FieldValue.increment(2),
      },
      { merge: true }
    );

    res.json({
      response,
      deviceId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get advice endpoint (structured output)
export const advice = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { deviceId, latitude, longitude, context } = req.body;

    if (!latitude || !longitude) {
      res.status(400).json({ error: "latitude and longitude are required" });
      return;
    }

    const prompt = `Based on the current conditions at location (${latitude}, ${longitude}), provide allergy advice.
${context ? `Additional context: ${context}` : ""}

Please respond with:
1. A brief summary of conditions
2. Risk level (low/moderate/high/very_high)
3. Up to 5 actionable recommendations
4. Any relevant triggers to be aware of`;

    const result = await run(allergyAdvisor, prompt);
    const response = result.finalOutput as string;

    res.json({
      advice: response,
      deviceId: deviceId || "anonymous",
      location: { latitude, longitude },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Advice error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
