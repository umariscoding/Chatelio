// API client configuration - will be implemented in Day 1
import axios from 'axios';

import { API_CONFIG, STORAGE_KEYS } from '@/constants/api';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
});

// Request interceptor for auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or redirect to login
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (refreshToken) {
        try {
          // Token refresh logic will be implemented in Day 1
          console.log('Token refresh needed');
        } catch {
          // Refresh failed, redirect to login
          console.log('Redirect to login');
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
