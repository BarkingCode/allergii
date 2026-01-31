# allergii AI Agent Specification

## Overview

Replace the current Firebase Vertex AI (Gemini) implementation with OpenAI Agents SDK to create a specialized allergy/weather assistant.

## Current State

**Location:** `func/useFirebase.tsx`

**Functions:**
- `useFirebaseAI()` — Suggestions based on weather + user symptoms
- `useFirebaseAISummary()` — 1-sentence summary for diary
- `useFirebaseAISuggestion()` — Proactive suggestions based on history

**Issues:**
- Simple prompt → response, no tool use
- No persistent memory
- Limited context awareness
- Generic responses

---

## Proposed Architecture

### Backend: Firebase Cloud Function

```
allergii-app (React Native)
    ↓ POST /api/agent
Firebase Cloud Function (Node.js)
    ↓ OpenAI Agents SDK
Agent with Tools
    ↓ Tool calls
Weather API, Pollen API, etc.
```

### Why Cloud Function?
- OpenAI Agents SDK requires Node.js 22+
- Can't run in React Native directly
- Firebase already in use, easy integration
- Scales automatically, pay-per-use

---

## Agent Definition

### Name
`AllergyAdvisor`

### System Instructions

```
You are AllergyAdvisor, a specialized assistant for people with allergies and weather sensitivities.

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
- Provide medical treatment plans
```

---

## Tools

### 1. `get_current_conditions`
Fetches current weather, air quality, and pollen for user's location.

```typescript
const getCurrentConditions = tool({
  name: 'get_current_conditions',
  description: 'Get current weather, air quality, and pollen levels',
  parameters: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  execute: async ({ latitude, longitude }) => {
    // Calls WeatherAPI, Google Air Quality, Google Pollen
    return {
      weather: { temp_c, humidity, wind_kph, condition },
      airQuality: { aqi, dominant_pollutant, category },
      pollen: { grass, tree, weed, levels },
    };
  },
});
```

### 2. `get_forecast`
Get multi-day forecast for planning.

```typescript
const getForecast = tool({
  name: 'get_forecast',
  description: 'Get weather and pollen forecast for upcoming days',
  parameters: z.object({
    latitude: z.number(),
    longitude: z.number(),
    days: z.number().min(1).max(5),
  }),
  execute: async ({ latitude, longitude, days }) => {
    // Returns forecast array
  },
});
```

### 3. `get_user_history`
Retrieves user's symptom diary entries.

```typescript
const getUserHistory = tool({
  name: 'get_user_history',
  description: 'Get user symptom history for pattern analysis',
  parameters: z.object({
    userId: z.string(),
    days: z.number().min(1).max(30).default(7),
  }),
  execute: async ({ userId, days }) => {
    // Fetches from Firestore
    return {
      entries: [
        { date, symptoms, weather, pollen, severity },
      ],
    };
  },
});
```

### 4. `analyze_patterns`
Identifies correlations between conditions and symptoms.

```typescript
const analyzePatterns = tool({
  name: 'analyze_patterns',
  description: 'Analyze correlations between weather/pollen and user symptoms',
  parameters: z.object({
    userId: z.string(),
  }),
  execute: async ({ userId }) => {
    // Statistical analysis of user data
    return {
      triggers: ['high grass pollen', 'humidity > 70%'],
      patterns: [
        { condition: 'Tree pollen > 3', symptomIncrease: '40%' },
      ],
    };
  },
});
```

---

## Structured Output

Define output schema for consistent responses:

```typescript
const AllergyAdvice = z.object({
  summary: z.string().describe('1-2 sentence overview'),
  riskLevel: z.enum(['low', 'moderate', 'high', 'very_high']),
  recommendations: z.array(z.string()).max(5),
  triggers: z.array(z.string()).optional(),
  forecast: z.string().optional(),
});
```

---

## API Endpoints

### POST `/api/agent/advice`
Get personalized advice based on current conditions.

**Request:**
```json
{
  "userId": "abc123",
  "latitude": 52.3676,
  "longitude": 4.9041,
  "context": "Just woke up, feeling sneezy"
}
```

**Response:**
```json
{
  "summary": "Moderate grass pollen levels today with high humidity may be triggering your symptoms.",
  "riskLevel": "moderate",
  "recommendations": [
    "Take antihistamines before going outside",
    "Keep windows closed until afternoon",
    "Shower after outdoor activities"
  ],
  "triggers": ["grass pollen", "humidity"],
  "forecast": "Pollen levels expected to drop tomorrow after rain."
}
```

### POST `/api/agent/diary-summary`
Generate summary for diary entry.

**Request:**
```json
{
  "userId": "abc123",
  "symptoms": {
    "nasal": 3,
    "sneezing": 4,
    "eyes": 2
  },
  "conditions": { /* weather/pollen data */ }
}
```

**Response:**
```json
{
  "summary": "Moderate symptoms today, likely triggered by elevated tree pollen. Eyes less affected than usual.",
  "aiInsight": "Your sneezing correlates with birch pollen which peaked this morning."
}
```

---

## Implementation Phases

### Phase 1: Backend Setup
- [ ] Create Firebase Cloud Function project
- [ ] Install `@openai/agents` and `zod`
- [ ] Set up OPENAI_API_KEY secret
- [ ] Create basic agent with instructions

### Phase 2: Tools
- [ ] Implement `get_current_conditions` (reuse existing API calls)
- [ ] Implement `get_forecast`
- [ ] Implement `get_user_history` (Firestore query)
- [ ] Test tools individually

### Phase 3: Agent Integration
- [ ] Define structured output schema
- [ ] Create API endpoints
- [ ] Update React Native app to call new endpoints
- [ ] Replace `useFirebaseAI` functions

### Phase 4: Pattern Analysis
- [ ] Implement `analyze_patterns` tool
- [ ] Add historical correlation analysis
- [ ] Enable proactive notifications

---

## Cost Considerations

**OpenAI API Pricing (gpt-4o-mini):**
- Input: $0.15 / 1M tokens
- Output: $0.60 / 1M tokens

**Estimated per-request:**
- ~500 input tokens (user context + tool results)
- ~200 output tokens (advice)
- **~$0.0002 per request**

**Monthly estimate (1000 users, 5 requests/day):**
- 150,000 requests × $0.0002 = **~$30/month**

---

## Security

- API key stored in Firebase Secrets Manager
- User authentication required for all endpoints
- Rate limiting per user
- No PII sent to OpenAI (only anonymized health data)

---

## Dependencies

```json
{
  "@openai/agents": "^0.1.0",
  "zod": "^4.0.0",
  "firebase-functions": "^4.0.0",
  "firebase-admin": "^11.0.0"
}
```

---

## Decisions

1. **Memory: Firestore (free tier)** — Store conversation history by device ID, no auth required
2. **Streaming: Yes** — Better UX for chat responses
3. **Voice: Experiment** — Nice to have, worth trying RealtimeAgent in-app
4. **Chat UI: Yes** — Add conversational interface to the app

---

## Memory Architecture

### Device-based Storage (No Auth)

```typescript
// Firestore structure
conversations/
  {deviceId}/
    messages/
      {messageId}: {
        role: 'user' | 'assistant',
        content: string,
        timestamp: Date,
        context?: { weather, pollen, location }
      }
    metadata: {
      lastActive: Date,
      messageCount: number,
      deviceInfo: { platform, version }
    }
```

### Why Device ID?
- No login friction for basic chat
- Firestore free tier: 1GB storage, 50K reads/day
- Privacy: Can still delete all data by device
- Upgrade path: Link to account later if user signs up

### Implementation
```typescript
import * as Device from 'expo-device';
import { getUniqueIdAsync } from 'expo-application';

const getDeviceId = async () => {
  // Persistent across app reinstalls on same device
  return await getUniqueIdAsync();
};
```

---

## Chat Feature

### New Screen: `app/(tabs)/chat/index.tsx`

**Features:**
- Conversational UI with message bubbles
- Streaming responses (typewriter effect)
- Quick action buttons (e.g., "How's today?", "This week's forecast")
- Context-aware: Knows user's location and recent symptoms

### API Endpoint: `POST /api/agent/chat`

**Request:**
```json
{
  "deviceId": "abc123",
  "message": "Will tomorrow be bad for my allergies?",
  "location": { "lat": 52.37, "lon": 4.90 }
}
```

**Response (streamed):**
```
data: {"type": "chunk", "content": "Based on "}
data: {"type": "chunk", "content": "tomorrow's forecast"}
data: {"type": "chunk", "content": "..."}
data: {"type": "done", "fullResponse": "...", "riskLevel": "moderate"}
```

---

## Voice (Experimental)

### Phase 5: Voice Input

Using OpenAI's RealtimeAgent for voice conversations:

```typescript
import { RealtimeAgent, RealtimeSession } from '@openai/agents-realtime';

// In-app voice button
const startVoiceChat = async () => {
  const { apiKey } = await fetch('/api/agent/ephemeral-key').then(r => r.json());
  const session = new RealtimeSession(allergyAgent);
  await session.connect({ apiKey });
  // Handles mic input/speaker output automatically
};
```

**Considerations:**
- Requires ephemeral API key generation (security)
- Higher cost than text (realtime API pricing)
- Good for hands-free morning briefings

---

## Updated Implementation Phases

### Phase 1: Backend Setup
- [ ] Create Firebase Cloud Function
- [ ] Install `@openai/agents`, `zod`
- [ ] Set up OPENAI_API_KEY secret

### Phase 2: Core Agent + Tools
- [ ] Define AllergyAdvisor agent
- [ ] Implement weather/pollen tools
- [ ] Implement Firestore history tool

### Phase 3: Chat Feature
- [ ] Create `/api/agent/chat` with streaming
- [ ] Add device ID storage in Firestore
- [ ] Build chat UI in React Native
- [ ] Add quick action buttons

### Phase 4: Replace Legacy AI
- [ ] Migrate `useFirebaseAI` functions
- [ ] Update diary to use new agent
- [ ] Test and deprecate Vertex AI

### Phase 5: Voice (Experimental)
- [ ] Add ephemeral key endpoint
- [ ] Integrate RealtimeAgent
- [ ] Add voice button to chat UI

---

*Created: 2026-01-31*
*Updated: 2026-01-31 — Added memory, chat, streaming, voice decisions*
*Status: Ready for Implementation*
