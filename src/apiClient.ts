/**
 * Chunkr API Client
 * Authenticated Axios instance for Chunkr API calls
 */
import axios, { AxiosInstance } from "axios";
import dotenv from "dotenv";

// Initialize environment variables
dotenv.config();

// Validate required environment variables
const CHUNKR_API_KEY = process.env.CHUNKR_API_KEY;

// Set API URL internally - not reading from environment variables
const DEFAULT_CHUNKR_API_URL = "https://api.chunkr.ai/api/v1";

if (!CHUNKR_API_KEY) {
  console.warn(
    "CHUNKR_API_KEY environment variable is not set. Chunkr API calls will fail."
  );
}

/**
 * Creates and returns an Axios instance configured for Chunkr API
 * Uses bearer authentication with the CHUNKR_API_KEY
 * 
 * @param apiUrl Optional custom API URL, otherwise defaults to https://api.chunkr.ai/api/v1
 */
export const createChunkrApiClient = (apiUrl?: string): AxiosInstance => {
  const instance = axios.create({
    baseURL: apiUrl || DEFAULT_CHUNKR_API_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CHUNKR_API_KEY}`,
    },
    timeout: 30000, // 30 seconds
  });

  // Add response interceptor for error handling
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        // Structured error details from the API
        console.error("Chunkr API error:", {
          status: error.response.status,
          data: error.response.data,
          endpoint: error.config?.url,
          method: error.config?.method,
        });
      } else if (error.request) {
        // Request was made but no response received
        console.error("Chunkr API no response:", {
          request: error.request,
          endpoint: error.config?.url,
          method: error.config?.method,
        });
      } else {
        // Something else happened while setting up the request
        console.error("Chunkr API request error:", error.message);
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Export a singleton instance for reuse
export const chunkrApiClient = createChunkrApiClient();
