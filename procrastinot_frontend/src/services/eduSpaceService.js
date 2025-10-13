import authService from './authService';

const API_BASE_URL = 'https://s89-chethan-capstone-procrastinot-1.onrender.com/api';

const eduSpaceService = {
  async generateContent(technology) {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error('Authentication failed');
      }
      
      const response = await fetch(`${API_BASE_URL}/eduspace/generate`, {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify({ technology })
      });
      
      if (response.status === 401) {
        throw new Error('Authentication failed');
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate content');
      }
      const content = await response.text();
      return content;
    } catch (error) {
      console.error('Generate content error:', error);
      throw error;
    }
  }
};

export default eduSpaceService;