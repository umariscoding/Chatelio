export const getApiUrl = (endpoint: string): string => {
  const baseUrl =
    (import.meta.env?.VITE_API_URL as string) || "http://localhost:8000";
  return `${baseUrl}${endpoint}`;
};
