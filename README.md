# W-Allergy (allergii)

A React Native/Expo app for tracking allergies and weather conditions. Get personalized insights based on air quality, pollen levels, and your symptom diary.

## Features

- 🌤️ **Real-time Weather** — Current conditions, hourly and 10-day forecasts
- 🌿 **Pollen Tracking** — Grass, tree, and weed pollen levels
- 💨 **Air Quality** — AQI with health recommendations
- 📓 **Symptom Diary** — Log daily symptoms and get AI-powered suggestions
- 🔔 **Smart Alerts** — Weather warnings for your area
- 📊 **Charts** — Visual temperature, UV, rain, and wind trends

## Tech Stack

- **Framework:** React Native with Expo SDK 51
- **Navigation:** Expo Router
- **Styling:** Styled Components
- **State:** React Context + useReducer
- **Auth:** Firebase Authentication
- **Database:** Cloud Firestore
- **AI:** Firebase Vertex AI (Gemini)
- **Subscriptions:** RevenueCat
- **APIs:**
  - WeatherAPI — Weather data
  - Google Air Quality API — AQI and pollutants
  - Google Pollen API — Pollen forecasts

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator or Android Emulator (or physical device with Expo Go)

### Installation

```bash
# Clone the repository
git clone https://github.com/BarkingCode/allergii.git
cd allergii

# Install dependencies
npm install

# Start the development server
npm start
```

### Environment Variables

Create environment variables in EAS or your local `.env` file:

```bash
# Weather API
EXPO_PUBLIC_WEATHER_API_URL=your_weatherapi_key

# Google APIs
EXPO_PUBLIC_GOOGLE_KEY=your_google_api_key

# Firebase
EXPO_PUBLIC_APIKEY=your_firebase_api_key
EXPO_PUBLIC_AUTHDOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_PROJECTID=your_project_id
EXPO_PUBLIC_STORAGEBUCKET=your_project.appspot.com
EXPO_PUBLIC_MESSAGINGSENDERID=your_sender_id
EXPO_PUBLIC_APPID=your_app_id
EXPO_PUBLIC_MEASUREMENTID=your_measurement_id

# Google Auth (OAuth)
EXPO_PUBLIC_GOOGLEAUTH_IOS=your_ios_client_id
EXPO_PUBLIC_GOOGLEAUTH_ANDROID=your_android_client_id

# RevenueCat
EXPO_PUBLIC_REVENUECATIOS=your_revenuecat_ios_key
EXPO_PUBLIC_REVENUECATANDROID=your_revenuecat_android_key
```

## Project Structure

```
allergii/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation
│   │   ├── now/           # Current conditions
│   │   ├── forecast/      # Daily forecast
│   │   ├── diary/         # Symptom diary
│   │   └── profile/       # User settings
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── ui/               # UI primitives
│   ├── screens/          # Screen components
│   └── charts/           # Chart components
├── context/              # React Context providers
├── func/                 # Custom hooks & utilities
├── lib/                  # App configuration
├── assets/               # Icons, animations, images
├── constants/            # Theme & constants
└── types/                # TypeScript types
```

## Building

### Development Build

```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android
```

### EAS Build

```bash
# Development build
eas build -e dev

# Preview build (internal testing)
eas build -e prev

# Production build with auto-submit
npm run buildprod
```

## API Configuration

### WeatherAPI
Get a free API key at [weatherapi.com](https://www.weatherapi.com/)

### Google APIs
Enable these APIs in Google Cloud Console:
- Air Quality API
- Pollen API
- Maps SDK (for location services)

### Firebase
1. Create a project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password + Google)
3. Create a Firestore database
4. Enable Vertex AI for AI suggestions

### RevenueCat
1. Create an account at [RevenueCat](https://www.revenuecat.com/)
2. Set up your app and products
3. Create a "pro" entitlement for diary access

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a PR for review

## License

Proprietary — © 2026 Barking Code

## Support

For issues or questions, contact: support@barkingcode.com
