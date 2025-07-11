import axios from 'axios';
import { getAuthHeader, clearAuthData, ensureValidToken, isTokenExpired } from '../utils/auth';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api`,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth header (no automatic refresh)
api.interceptors.request.use(
  async (config) => {
    // Simply add auth header if available - don't auto-refresh
    const authHeader = getAuthHeader();
    if (authHeader) {
      config.headers = { ...config.headers, ...authHeader };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token once
      const tokenRefreshed = await ensureValidToken();
      if (tokenRefreshed) {
        // Retry the original request with new token
        const originalRequest = error.config;
        const authHeader = getAuthHeader();
        if (authHeader) {
          originalRequest.headers = { ...originalRequest.headers, ...authHeader };
        }
        return api(originalRequest);
      } else {
        // Token refresh failed, redirect to login
        clearAuthData();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
