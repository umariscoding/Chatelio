import axios, { AxiosError } from 'axios';

import { API_CONFIG, STORAGE_KEYS } from '@/constants/api';

export const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth - now handles both company and user tokens
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const activeSession = localStorage.getItem('active_session');
      let token = null;
      
      if (activeSession === 'company') {
        token = localStorage.getItem('company_access_token');
      } else if (activeSession === 'user') {
        token = localStorage.getItem('user_access_token');
      } else {
        // Fallback: try to get any available token
        token = localStorage.getItem('company_access_token') || localStorage.getItem('user_access_token');
      }
      
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

// Response interceptor for token refresh - now handles both company and user tokens
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      
      if (typeof window !== 'undefined') {
        const activeSession = localStorage.getItem('active_session');
        let refreshToken = null;
        let accessTokenKey = '';
        let refreshTokenKey = '';
        
        if (activeSession === 'company') {
          refreshToken = localStorage.getItem('company_refresh_token');
          accessTokenKey = 'company_access_token';
          refreshTokenKey = 'company_refresh_token';
        } else if (activeSession === 'user') {
          refreshToken = localStorage.getItem('user_refresh_token');
          accessTokenKey = 'user_access_token';
          refreshTokenKey = 'user_refresh_token';
        }
        
        if (refreshToken) {
          try {
            const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/refresh`, {
              refresh_token: refreshToken,
            });
            
            const { access_token } = response.data;
            localStorage.setItem(accessTokenKey, access_token);
            
            // Retry the original request with new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${access_token}`;
            }
            
            return api(originalRequest);
          } catch (refreshError) {
            // Refresh failed, clear tokens and redirect to appropriate login
            localStorage.removeItem(accessTokenKey);
            localStorage.removeItem(refreshTokenKey);
            
            if (activeSession === 'company') {
              localStorage.removeItem('active_session');
              if (typeof window !== 'undefined') {
                window.location.href = '/company/login';
              }
            } else if (activeSession === 'user') {
              localStorage.removeItem('active_session');
              if (typeof window !== 'undefined') {
                window.location.href = '/user/login';
              }
            }
            
            return Promise.reject(refreshError);
          }
        } else {
          // No refresh token, redirect to appropriate login
          if (activeSession === 'company') {
            if (typeof window !== 'undefined') {
              window.location.href = '/company/login';
            }
          } else if (activeSession === 'user') {
            if (typeof window !== 'undefined') {
              window.location.href = '/user/login';
            }
          }
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
