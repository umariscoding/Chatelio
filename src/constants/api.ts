export const API_CONFIG = {
  BASE_URL: (import.meta.env?.VITE_API_URL as string) || "http://localhost:8000",
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
