// Authentication utilities for secure token handling
import { jwtDecode } from 'jwt-decode';

/**
 * Token storage keys
 */
const TOKEN_KEY = 'token';
const USER_ID_KEY = 'userId';

/**
 * Securely store authentication token and user ID
 * @param {string} token - JWT token
 * @param {string} userId - User ID
 */
export const storeAuthData = (token, userId) => {
  try {
    if (!token || !userId) {
      throw new Error('Token and userId are required');
    }

    // Store in localStorage for persistence across browser sessions
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_ID_KEY, userId);

    // Also store in sessionStorage as backup
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(USER_ID_KEY, userId);

    console.log('🔐 Auth data stored successfully');
  } catch (error) {
    console.error('Error storing auth data:', error);
    throw new Error('Failed to store authentication data');
  }
};

/**
 * Get stored authentication token
 * @returns {string|null} JWT token or null if not found
 */
export const getToken = () => {
  try {
    // Try localStorage first, then sessionStorage as fallback
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

/**
 * Get stored user ID
 * @returns {string|null} User ID or null if not found
 */
export const getUserId = () => {
  try {
    // Try localStorage first, then sessionStorage as fallback
    return localStorage.getItem(USER_ID_KEY) || sessionStorage.getItem(USER_ID_KEY);
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has valid token
 */
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) {
    console.log('🔐 No token found');
    return false;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    const timeUntilExpiry = decoded.exp - currentTime;

    console.log(`🔐 Token expires in ${Math.round(timeUntilExpiry / 3600)} hours`);

    // Check if token is expired
    if (decoded.exp < currentTime) {
      console.log('🔐 Token expired, clearing auth data');
      clearAuthData();
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error validating token:', error);
    clearAuthData();
    return false;
  }
};

/**
 * Check if token is expired or will expire soon
 * @param {number} bufferMinutes - Minutes before expiration to consider token as expired
 * @returns {boolean} True if token is expired or will expire soon
 */
export const isTokenExpired = (bufferMinutes = 0) => {
  const token = getToken();
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    const bufferTime = bufferMinutes * 60; // Convert minutes to seconds

    return decoded.exp < (currentTime + bufferTime);
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

/**
 * Get user data from token
 * @returns {object|null} User data or null if invalid
 */
export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      clearAuthData();
      return null;
    }

    return {
      id: decoded.id,
      exp: decoded.exp,
      iat: decoded.iat
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    clearAuthData();
    return null;
  }
};

/**
 * Clear all authentication data
 */
export const clearAuthData = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_ID_KEY);
    console.log('🔐 Auth data cleared');
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

/**
 * Refresh authentication token
 * @returns {Promise<string|null>} New token or null if refresh failed
 */
export const refreshToken = async () => {
  const currentToken = getToken();
  const userId = getUserId();

  if (!currentToken || !userId) {
    return null;
  }

  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const response = await fetch(`${API_URL}/api/users/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`
      },
      body: JSON.stringify({ userId })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.token) {
        storeAuthData(data.token, userId);
        return data.token;
      }
    }

    // If refresh fails, clear auth data
    clearAuthData();
    return null;
  } catch (error) {
    console.error('Error refreshing token:', error);
    clearAuthData();
    return null;
  }
};

/**
 * Check and refresh token if needed
 * @returns {Promise<boolean>} True if token is valid or successfully refreshed
 */
export const ensureValidToken = async () => {
  // Only refresh if token is actually expired (not just close to expiring)
  if (!isTokenExpired(0)) {
    return true; // Token is still valid
  }

  console.log('🔄 Token expired, attempting refresh...');
  const newToken = await refreshToken();
  return newToken !== null;
};

/**
 * Get authorization header for API requests
 * @returns {object|null} Authorization header or null if no token
 */
export const getAuthHeader = () => {
  const token = getToken();
  if (!token) return null;
  
  return {
    Authorization: `Bearer ${token}`
  };
};

/**
 * Handle authentication errors
 * @param {Error} error - Error object
 * @returns {string} User-friendly error message
 */
export const handleAuthError = (error) => {
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || error.response.data?.error;
    
    switch (status) {
      case 400:
        return message || 'Invalid request. Please check your input.';
      case 401:
        clearAuthData();
        return 'Session expired. Please login again.';
      case 403:
        return 'Access denied. You don\'t have permission to perform this action.';
      case 404:
        return 'Service not found. Please try again later.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return message || 'An unexpected error occurred. Please try again.';
    }
  } else if (error.request) {
    return 'Network error. Please check your connection and try again.';
  } else {
    return error.message || 'An unexpected error occurred. Please try again.';
  }
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result with isValid and message
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  
  if (password.length > 128) {
    return { isValid: false, message: 'Password must be less than 128 characters' };
  }
  
  // Check for at least one letter and one number
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  if (!hasLetter || !hasNumber) {
    return { 
      isValid: false, 
      message: 'Password must contain at least one letter and one number' 
    };
  }
  
  return { isValid: true, message: 'Password is valid' };
};
