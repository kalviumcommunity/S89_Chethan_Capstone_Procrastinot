const API_BASE_URL = 'https://s89-chethan-capstone-procrastinot-1.onrender.com/api';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('token');
    this.userId = localStorage.getItem('userId');
  }

  // Set authentication data
  setAuth(token, userId) {
    this.token = token;
    this.userId = userId;
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
  }

  // Clear authentication data
  clearAuth() {
    this.token = null;
    this.userId = null;
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token;
  }

  // Get auth headers
  getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` })
    };
  }

  // Register user
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.fullName.replace(/\s+/g, '').toLowerCase(),
          email: userData.email,
          password: userData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      this.setAuth(data.token, data.userId);
      return data;
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  // Login user
  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      this.setAuth(data.token, data.userId);
      return data;
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  }

  // Google OAuth login
  async googleLogin(googleData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/google-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(googleData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Google login failed');
      }

      this.setAuth(data.token, data.userId);
      return data;
    } catch (error) {
      throw new Error(error.message || 'Google login failed');
    }
  }

  // Logout user
  logout() {
    this.clearAuth();
  }

  // Get user profile
  async getUserProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile/${this.userId}`, {
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch profile');
      }

      // Return the user object from the response
      return data.user || data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch profile');
    }
  }

  // Get dashboard stats
  async getDashboardStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/users/dashboard-stats`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        // Return mock data if endpoint doesn't exist yet
        return {
          focusTime: 0,
          activeSessions: 0,
          skillProgress: 0,
          completedTasks: 0
        };
      }

      return await response.json();
    } catch (error) {
      // Return mock data on error
      return {
        focusTime: 0,
        activeSessions: 0,
        skillProgress: 0,
        completedTasks: 0
      };
    }
  }

  // Get user tasks
  async getTasks() {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return [];
      }

      return await response.json();
    } catch (error) {
      return [];
    }
  }
}

export default new AuthService();