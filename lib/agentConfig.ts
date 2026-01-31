/**
 * Agent API Configuration
 * 
 * Update API_BASE_URL after deploying Firebase Cloud Functions.
 * The URL format is: https://{region}-{project-id}.cloudfunctions.net
 */

// Production URL (update after deployment)
export const API_BASE_URL = "https://us-central1-w-allergy.cloudfunctions.net";

// Endpoints
export const ENDPOINTS = {
  health: `${API_BASE_URL}/health`,
  chat: `${API_BASE_URL}/chat`,
  advice: `${API_BASE_URL}/advice`,
};

// Request timeout (ms)
export const REQUEST_TIMEOUT = 30000;
