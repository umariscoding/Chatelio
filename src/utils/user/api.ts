import axios, { AxiosError } from "axios";
import { API_CONFIG } from "@/constants/api";

// User-specific API client
export const userApi = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for user auth
userApi.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const userToken = localStorage.getItem("user_access_token");

      if (userToken) {
        config.headers.Authorization = `Bearer ${userToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for token refresh
userApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh user token
      const userRefreshToken = localStorage.getItem("user_refresh_token");
      if (userRefreshToken) {
        try {
          const response = await axios.post(
            `${API_CONFIG.BASE_URL}/auth/refresh`,
            {
              refresh_token: userRefreshToken,
            },
          );

          const { access_token } = response.data;
          localStorage.setItem("user_access_token", access_token);

          // Retry the original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }

          return userApi(originalRequest);
        } catch (refreshError) {
          // User refresh failed, clear user tokens but don't redirect
          // User auth is optional on public chat pages
          localStorage.removeItem("user_access_token");
          localStorage.removeItem("user_refresh_token");
          localStorage.removeItem("user_data");
        }
      }
    }

    return Promise.reject(error);
  },
);
