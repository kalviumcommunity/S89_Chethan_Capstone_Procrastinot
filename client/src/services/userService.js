// src/services/userService.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User Service Functions
export const userService = {
  // Get current user profile
  async getCurrentUser() {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('No user ID found');
      }
      
      const response = await api.get(`/users/profile/${userId}`);
      return response.data.user;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
    }
  },

  // Update user profile
  async updateProfile(userId, profileData) {
    try {
      const response = await api.put(`/users/${userId}`, profileData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  // Get user statistics
  async getUserStats(userId) {
    try {
      const user = await this.getCurrentUser();
      
      // Calculate stats from user data
      const stats = {
        totalTasks: user.tasks?.length || 0,
        completedTasks: 0, // Will be calculated from actual task data
        totalSkills: user.skills?.length || 0,
        pomodoroSessions: user.pomodoroSessions?.length || 0,
        moodLogs: user.moodLogs?.length || 0,
        completedChallenges: user.completedChallenges?.length || 0,
        joinedDate: user.createdAt,
        lastActive: user.updatedAt,
      };

      return stats;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user statistics');
    }
  },

  // Upload profile picture
  async uploadProfilePicture(userId, file) {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      const response = await api.post(`/users/${userId}/profile-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to upload profile picture');
    }
  },

  // Change password
  async changePassword(userId, passwordData) {
    try {
      const response = await api.put(`/users/${userId}/password`, passwordData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to change password');
    }
  },

  // Delete account
  async deleteAccount(userId) {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete account');
    }
  },

  // Get user preferences
  async getUserPreferences(userId) {
    try {
      const response = await api.get(`/users/${userId}/preferences`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user preferences');
    }
  },

  // Update user preferences
  async updateUserPreferences(userId, preferences) {
    try {
      const response = await api.put(`/users/${userId}/preferences`, preferences);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update user preferences');
    }
  },
};

export default userService;
