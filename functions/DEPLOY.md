# Deploying allergii Cloud Functions

## Prerequisites

1. Firebase CLI installed: `npm install -g firebase-tools`
2. Logged in: `firebase login`
3. OpenAI API key ready

## First-time Setup

### 1. Set up secrets

```bash
cd /path/to/allergii

# Set OpenAI API key (required)
firebase functions:secrets:set OPENAI_API_KEY
# Paste your OpenAI API key when prompted

# Set Weather API key (reuse from app)
firebase functions:secrets:set WEATHER_API_KEY
# Value: 8525ae2e888e42d3900195557242703

# Set Google API key (reuse from app)
firebase functions:secrets:set GOOGLE_API_KEY
# Value: AIzaSyCrdz4AhbbXLqN5RtbVFTiQqC8TBN_w7_o
```

### 2. Deploy functions

```bash
cd /path/to/allergii
firebase deploy --only functions
```

### 3. Deploy Firestore rules & indexes

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

## Endpoints

After deployment, your endpoints will be:

- `https://us-central1-w-allergy.cloudfunctions.net/health`
- `https://us-central1-w-allergy.cloudfunctions.net/chat`
- `https://us-central1-w-allergy.cloudfunctions.net/advice`

## Testing

```bash
# Health check
curl https://us-central1-w-allergy.cloudfunctions.net/health

# Chat test
curl -X POST https://us-central1-w-allergy.cloudfunctions.net/chat \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "test-device-123",
    "message": "How is the pollen today?",
    "location": { "latitude": 52.3676, "longitude": 4.9041 }
  }'

# Advice test
curl -X POST https://us-central1-w-allergy.cloudfunctions.net/advice \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 52.3676,
    "longitude": 4.9041,
    "context": "I have grass allergies"
  }'
```

## Local Testing (Emulator)

```bash
cd functions
npm run serve
# Functions will run at http://localhost:5001/w-allergy/us-central1/
```

## Updating the Functions

After code changes:

```bash
cd /path/to/allergii
npm run build --prefix functions
firebase deploy --only functions
```

## Troubleshooting

View logs:
```bash
firebase functions:log
```

Check secrets:
```bash
firebase functions:secrets:access OPENAI_API_KEY
```
