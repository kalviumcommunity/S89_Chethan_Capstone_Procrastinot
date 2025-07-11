// src/services/taskService.js
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

// Task Service Functions
export const taskService = {
  // Get all tasks for a user
  async getUserTasks(userId) {
    try {
      const response = await api.get(`/tasks/user/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch tasks');
    }
  },

  // Get single task by ID
  async getTask(taskId) {
    try {
      const response = await api.get(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch task');
    }
  },

  // Create new task
  async createTask(taskData) {
    try {
      const response = await api.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create task');
    }
  },

  // Update task
  async updateTask(taskId, taskData) {
    try {
      const response = await api.put(`/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update task');
    }
  },

  // Delete task
  async deleteTask(taskId) {
    try {
      const response = await api.delete(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete task');
    }
  },

  // Mark task as complete
  async completeTask(taskId) {
    try {
      const response = await api.put(`/tasks/${taskId}`, {
        status: 'Completed',
        completedAt: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to complete task');
    }
  },

  // Toggle task importance
  async toggleImportance(taskId, isImportant) {
    try {
      const response = await api.put(`/tasks/${taskId}`, {
        isImportant: !isImportant,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update task importance');
    }
  },

  // Get tasks by date range
  async getTasksByDateRange(userId, startDate, endDate) {
    try {
      const response = await api.get(`/tasks/user/${userId}`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch tasks by date');
    }
  },

  // Filter tasks
  async filterTasks(userId, filters) {
    try {
      const response = await api.get(`/tasks/user/${userId}`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to filter tasks');
    }
  },
};

export default taskService;
