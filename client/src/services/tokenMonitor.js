// Token monitoring service to keep users logged in
import { ensureValidToken, isTokenExpired, clearAuthData } from '../utils/auth';

class TokenMonitor {
  constructor() {
    this.intervalId = null;
    this.isMonitoring = false;
    this.checkInterval = 30 * 60 * 1000; // Check every 30 minutes (less aggressive)
  }

  /**
   * Start monitoring token expiration
   */
  startMonitoring() {
    if (this.isMonitoring) {
      return;
    }

    this.isMonitoring = true;
    
    // Initial check
    this.checkToken();
    
    // Set up periodic checks
    this.intervalId = setInterval(() => {
      this.checkToken();
    }, this.checkInterval);

    console.log('🔐 Token monitoring started');
  }

  /**
   * Stop monitoring token expiration
   */
  stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isMonitoring = false;
    console.log('🔐 Token monitoring stopped');
  }

  /**
   * Check token and refresh if needed
   */
  async checkToken() {
    try {
      // Only check if we're on a protected page
      const protectedPaths = ['/dashboard', '/tasks', '/pomodoro', '/profile'];
      const currentPath = window.location.pathname;
      
      if (!protectedPaths.some(path => currentPath.startsWith(path))) {
        return;
      }

      // Check if token is expired or will expire soon (only refresh when really needed)
      if (isTokenExpired(60)) { // 1 hour buffer - only refresh when close to expiring
        console.log('🔄 Token expiring within 1 hour, attempting refresh...');

        const refreshed = await ensureValidToken();
        if (refreshed) {
          console.log('✅ Token refreshed successfully');
        } else {
          console.log('❌ Token refresh failed, redirecting to login');
          this.handleAuthFailure();
        }
      }
    } catch (error) {
      console.error('Token check error:', error);
      this.handleAuthFailure();
    }
  }

  /**
   * Handle authentication failure
   */
  handleAuthFailure() {
    clearAuthData();
    this.stopMonitoring();
    
    // Only redirect if not already on login page
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  /**
   * Force token refresh
   */
  async forceRefresh() {
    try {
      const refreshed = await ensureValidToken();
      if (!refreshed) {
        this.handleAuthFailure();
      }
      return refreshed;
    } catch (error) {
      console.error('Force refresh error:', error);
      this.handleAuthFailure();
      return false;
    }
  }
}

// Create singleton instance
const tokenMonitor = new TokenMonitor();

export default tokenMonitor;
