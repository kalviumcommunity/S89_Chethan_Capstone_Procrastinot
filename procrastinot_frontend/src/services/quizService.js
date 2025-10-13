import authService from './authService';

const API_BASE_URL = '/api';

const quizService = {

  async generateQuiz(topic) {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error('Authentication failed');
      }
      
      const response = await fetch(`${API_BASE_URL}/quiz/generate`, {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify({ topic })
      });
      
      if (response.status === 401) {
        throw new Error('Authentication failed');
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate quiz');
      }
      return response.json();
    } catch (error) {
      console.error('Generate quiz error:', error);
      throw error;
    }
  },

  async submitQuiz(quizId, answers) {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error('Authentication failed');
      }
      
      const response = await fetch(`${API_BASE_URL}/quiz/${quizId}/submit`, {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify({ answers })
      });
      
      if (response.status === 401) {
        throw new Error('Authentication failed');
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to submit quiz');
      }
      return response.json();
    } catch (error) {
      console.error('Submit quiz error:', error);
      throw error;
    }
  },

  async getQuizHistory() {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error('Authentication failed');
      }
      
      const headers = { ...authService.getAuthHeaders() };
      delete headers['Content-Type']; // Not needed for GET request
      
      const response = await fetch(`${API_BASE_URL}/quiz`, {
        headers
      });
      
      if (response.status === 401) {
        throw new Error('Authentication failed');
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get quiz history');
      }
      return response.json();
    } catch (error) {
      console.error('Get quiz history error:', error);
      throw error;
    }
  }
};

export default quizService;