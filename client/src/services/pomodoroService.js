// src/services/pomodoroService.js
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

// Pomodoro Service Functions
export const pomodoroService = {
  // Create a new pomodoro session
  async createSession(sessionData) {
    try {
      const response = await api.post('/pomodoro', sessionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create pomodoro session');
    }
  },

  // Get all pomodoro sessions for a user
  async getUserSessions(userId) {
    try {
      const response = await api.get(`/pomodoro/user/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch pomodoro sessions');
    }
  },

  // Update a pomodoro session
  async updateSession(sessionId, updateData) {
    try {
      const response = await api.put(`/pomodoro/${sessionId}`, updateData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update pomodoro session');
    }
  },

  // Delete a pomodoro session
  async deleteSession(sessionId) {
    try {
      const response = await api.delete(`/pomodoro/${sessionId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete pomodoro session');
    }
  },

  // Get pomodoro statistics for a user
  async getUserStats(userId, timeframe = 'today') {
    try {
      const sessions = await this.getUserSessions(userId);
      
      // Calculate statistics based on timeframe
      const now = new Date();
      let startDate;
      
      switch (timeframe) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      }

      const filteredSessions = sessions.filter(session => 
        new Date(session.createdAt) >= startDate && session.status === 'Completed'
      );

      const totalSessions = filteredSessions.length;
      const totalFocusTime = filteredSessions.reduce((total, session) => total + session.duration, 0);
      const averageSessionLength = totalSessions > 0 ? totalFocusTime / totalSessions : 0;
      
      // Calculate productivity score based on completed vs started sessions
      const allSessionsInTimeframe = sessions.filter(session => 
        new Date(session.createdAt) >= startDate
      );
      const productivityScore = allSessionsInTimeframe.length > 0 
        ? Math.round((totalSessions / allSessionsInTimeframe.length) * 100) 
        : 0;

      return {
        totalSessions,
        totalFocusTime: Math.round((totalFocusTime / 60) * 10) / 10, // Convert to hours with 1 decimal
        averageSessionLength: Math.round(averageSessionLength),
        productivityScore,
        sessions: filteredSessions,
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch pomodoro statistics');
    }
  },

  // Get today's pomodoro sessions
  async getTodaySessions(userId) {
    try {
      const stats = await this.getUserStats(userId, 'today');
      return stats.sessions;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch today\'s sessions');
    }
  },

  // Start a new pomodoro session
  async startSession(userId, taskId = null, duration = 25 * 60, moodBefore = 'Neutral') {
    try {
      const sessionData = {
        userId,
        taskId,
        duration,
        status: 'In Progress',
        moodBefore,
        startTime: new Date().toISOString(),
      };
      
      return await this.createSession(sessionData);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to start pomodoro session');
    }
  },

  // Complete a pomodoro session
  async completeSession(sessionId, moodAfter = 'Neutral', notes = '') {
    try {
      const updateData = {
        status: 'Completed',
        endTime: new Date().toISOString(),
        moodAfter,
        notes,
      };

      const result = await this.updateSession(sessionId, updateData);

      // If session is linked to a task, update task statistics
      if (result.taskId) {
        await this.updateTaskPomodoroStats(result.taskId, result.duration);
      }

      return result;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to complete pomodoro session');
    }
  },

  // Update task pomodoro statistics
  async updateTaskPomodoroStats(taskId, sessionDuration) {
    try {
      // Get current task data
      const taskResponse = await api.get(`/tasks/${taskId}`);
      const task = taskResponse.data;

      // Update task with new pomodoro count and actual time
      const updateData = {
        pomodoroCount: (task.pomodoroCount || 0) + 1,
        actualTime: (task.actualTime || 0) + Math.round(sessionDuration / 60), // Convert to minutes
      };

      await api.put(`/tasks/${taskId}`, updateData);
    } catch (error) {
      console.error('Failed to update task pomodoro stats:', error);
      // Don't throw error here as session completion is more important
    }
  },

  // Pause a pomodoro session
  async pauseSession(sessionId) {
    try {
      const updateData = {
        status: 'Paused',
      };
      
      return await this.updateSession(sessionId, updateData);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to pause pomodoro session');
    }
  },

  // Resume a paused pomodoro session
  async resumeSession(sessionId) {
    try {
      const updateData = {
        status: 'In Progress',
      };
      
      return await this.updateSession(sessionId, updateData);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to resume pomodoro session');
    }
  },
};

export default pomodoroService;
