import axios from 'axios';
import { storeAuthData, clearAuthData, handleAuthError } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.username - Username
   * @param {string} userData.email - Email address
   * @param {string} userData.password - Password
   * @returns {Promise<Object>} User data and token
   */
  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/api/users/register`, userData);
      
      if (response.data.token && response.data.userId) {
        storeAuthData(response.data.token, response.data.userId);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(handleAuthError(error));
    }
  }

  /**
   * Login user with email and password
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - Email address
   * @param {string} credentials.password - Password
   * @returns {Promise<Object>} User data and token
   */
  async login(credentials) {
    try {
      const response = await axios.post(`${API_URL}/api/users/login`, credentials);
      
      if (response.data.token && response.data.userId) {
        storeAuthData(response.data.token, response.data.userId);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(handleAuthError(error));
    }
  }

  /**
   * Login user with Google OAuth
   * @param {Object} googleData - Google OAuth data
   * @param {string} googleData.username - Display name from Google
   * @param {string} googleData.email - Email from Google
   * @param {string} googleData.googleId - Google user ID
   * @returns {Promise<Object>} User data and token
   */
  async googleLogin(googleData) {
    try {
      const response = await axios.post(`${API_URL}/api/users/google-login`, googleData);
      
      if (response.data.token && response.data.userId) {
        storeAuthData(response.data.token, response.data.userId);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(handleAuthError(error));
    }
  }

  /**
   * Logout user
   * Clears local storage and redirects to login
   */
  logout() {
    clearAuthData();
    window.location.href = '/login';
  }

  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile data
   */
  async getCurrentUser() {
    try {
      const response = await axios.get(`${API_URL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        this.logout();
      }
      throw new Error(handleAuthError(error));
    }
  }

  /**
   * Update user profile
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Updated user data
   */
  async updateProfile(userData) {
    try {
      const response = await axios.put(`${API_URL}/api/users/profile`, userData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      return response.data;
    } catch (error) {
      throw new Error(handleAuthError(error));
    }
  }

  /**
   * Change user password
   * @param {Object} passwordData - Password change data
   * @param {string} passwordData.currentPassword - Current password
   * @param {string} passwordData.newPassword - New password
   * @returns {Promise<Object>} Success message
   */
  async changePassword(passwordData) {
    try {
      const response = await axios.put(`${API_URL}/api/users/change-password`, passwordData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      return response.data;
    } catch (error) {
      throw new Error(handleAuthError(error));
    }
  }

  /**
   * Request password reset
   * @param {string} email - Email address
   * @returns {Promise<Object>} Success message
   */
  async requestPasswordReset(email) {
    try {
      const response = await axios.post(`${API_URL}/api/users/forgot-password`, { email });
      return response.data;
    } catch (error) {
      throw new Error(handleAuthError(error));
    }
  }

  /**
   * Reset password with token
   * @param {Object} resetData - Password reset data
   * @param {string} resetData.token - Reset token
   * @param {string} resetData.password - New password
   * @returns {Promise<Object>} Success message
   */
  async resetPassword(resetData) {
    try {
      const response = await axios.post(`${API_URL}/api/users/reset-password`, resetData);
      return response.data;
    } catch (error) {
      throw new Error(handleAuthError(error));
    }
  }
}

// Export singleton instance
export default new AuthService();
