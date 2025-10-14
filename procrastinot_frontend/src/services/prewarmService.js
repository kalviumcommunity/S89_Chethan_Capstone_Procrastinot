// Prewarm service to keep Render backend active
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'https://s89-chethan-capstone-procrastinot-1.onrender.com';

class PrewarmService {
  constructor() {
    this.isPrewarming = false;
    this.prewarmInterval = null;
  }

  // Initial prewarm on app load
  async initialPrewarm() {
    if (this.isPrewarming) return;
    
    this.isPrewarming = true;
    console.log('🔥 Prewarming backend...');
    
    try {
      await fetch(`${BACKEND_URL}/`, {
        method: 'GET',
        mode: 'cors'
      }).catch(() => {});
      
      console.log('✅ Backend prewarmed');
    } catch (error) {
      console.log('⚠️ Prewarm attempt completed');
    } finally {
      this.isPrewarming = false;
    }
  }

  // Keep backend warm with periodic pings
  startPeriodicPrewarm() {
    // Ping every 10 minutes to keep server active
    this.prewarmInterval = setInterval(() => {
      fetch(`${BACKEND_URL}/`).catch(() => {});
    }, 10 * 60 * 1000);
  }

  // Stop periodic prewarming
  stopPeriodicPrewarm() {
    if (this.prewarmInterval) {
      clearInterval(this.prewarmInterval);
      this.prewarmInterval = null;
    }
  }

  // Prewarm before critical operations
  async prewarmBeforeOperation() {
    try {
      await fetch(`${BACKEND_URL}/`, {
        method: 'GET',
        timeout: 5000
      }).catch(() => {});
    } catch (error) {
      // Silent fail
    }
  }
}

const prewarmService = new PrewarmService();
export default prewarmService;