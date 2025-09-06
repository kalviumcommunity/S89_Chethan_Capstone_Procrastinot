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

      return data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch profile');
    }
  }
}

export default new AuthService();