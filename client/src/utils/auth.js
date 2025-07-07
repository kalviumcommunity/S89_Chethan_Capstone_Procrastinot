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
    
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_ID_KEY, userId);
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
    return localStorage.getItem(TOKEN_KEY);
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
    return localStorage.getItem(USER_ID_KEY);
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
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    if (decoded.exp < currentTime) {
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
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
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
