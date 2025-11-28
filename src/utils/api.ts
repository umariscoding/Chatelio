import axios, { AxiosError } from "axios";
import { API_CONFIG } from "@/constants/api";

export const userApi = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

userApi.interceptors.request.use(
  (config) => {
    const userToken = localStorage.getItem("user_access_token");

    if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

userApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

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

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }

          return userApi(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("user_access_token");
          localStorage.removeItem("user_refresh_token");
          localStorage.removeItem("user_data");
        }
      }
    }

    return Promise.reject(error);
  },
);
