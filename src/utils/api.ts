import axios, { AxiosError } from 'axios';

import { API_CONFIG, STORAGE_KEYS } from '@/constants/api';

export const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth - simplified for independent auth system
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      // Try company token first, then user token
      const companyToken = localStorage.getItem('company_access_token');
      const userToken = localStorage.getItem('user_access_token');
      
      // Use company token for company operations, user token for user operations
      // For knowledge base operations, prioritize company token
      const token = companyToken || userToken;
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh - simplified for independent auth system
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      
      if (typeof window !== 'undefined') {
        // Try to refresh company token first
        const companyRefreshToken = localStorage.getItem('company_refresh_token');
        if (companyRefreshToken) {
          try {
            const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/refresh`, {
              refresh_token: companyRefreshToken,
            });
            
            const { access_token } = response.data;
            localStorage.setItem('company_access_token', access_token);
            
            // Retry the original request with new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${access_token}`;
            }
            
            return api(originalRequest);
          } catch (refreshError) {
            // Company refresh failed, clear company tokens
            localStorage.removeItem('company_access_token');
            localStorage.removeItem('company_refresh_token');
          }
        }
        
        // Try to refresh user token
        const userRefreshToken = localStorage.getItem('user_refresh_token');
        if (userRefreshToken) {
          try {
            const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/refresh`, {
              refresh_token: userRefreshToken,
            });
            
            const { access_token } = response.data;
            localStorage.setItem('user_access_token', access_token);
            
            // Retry the original request with new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${access_token}`;
            }
            
            return api(originalRequest);
          } catch (refreshError) {
            // User refresh failed, clear user tokens
            localStorage.removeItem('user_access_token');
            localStorage.removeItem('user_refresh_token');
          }
        }
        
        // Both refresh attempts failed, redirect to company login
        if (typeof window !== 'undefined') {
          window.location.href = '/company/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
