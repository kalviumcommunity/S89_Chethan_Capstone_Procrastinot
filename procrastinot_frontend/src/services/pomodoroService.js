import authService from './authService';

// Duplicate base URL to avoid coupling to authService internals
const API_BASE_URL = 'https://s89-chethan-capstone-procrastinot-1.onrender.com/api';

const withAuthHeaders = () => authService.getAuthHeaders();

const pomodoroService = {
  // Create a new Pomodoro session
  async createSession(sessionData) {
    try {
      const res = await fetch(`${API_BASE_URL}/pomodoro`, {
        method: 'POST',
        headers: withAuthHeaders(),
        body: JSON.stringify(sessionData)
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to create Pomodoro session');
      }
      
      return data;
    } catch (error) {
      console.error('Error creating Pomodoro session:', error);
      throw error;
    }
  },

  // Get all Pomodoro sessions for the authenticated user
  async getUserSessions() {
    const userId = authService.userId;
    if (!userId) return [];
    
    try {
      const res = await fetch(`${API_BASE_URL}/pomodoro/user/${userId}`, {
        headers: withAuthHeaders()
      });
      
      if (!res.ok) return [];
      
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error fetching Pomodoro sessions:', error);
      return [];
    }
  },

  // Get session statistics
  async getSessionStats() {
    try {
      const sessions = await this.getUserSessions();
      
      const stats = {
        totalSessions: sessions.length,
        totalFocusTime: 0,
        averageSessionLength: 0,
        completedSessions: 0,
        moodDistribution: {
          Happy: 0,
          Neutral: 0,
          Sad: 0,
          Anxious: 0,
          Excited: 0
        },
        sessionsThisWeek: 0,
        sessionsThisMonth: 0
      };

      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      sessions.forEach(session => {
        if (session.status === 'Completed') {
          stats.completedSessions++;
          stats.totalFocusTime += session.duration || 0;
          
          // Count mood distribution
          if (session.moodAfter && stats.moodDistribution[session.moodAfter] !== undefined) {
            stats.moodDistribution[session.moodAfter]++;
          }
          
          // Count sessions by time period
          const sessionDate = new Date(session.createdAt);
          if (sessionDate >= weekAgo) {
            stats.sessionsThisWeek++;
          }
          if (sessionDate >= monthAgo) {
            stats.sessionsThisMonth++;
          }
        }
      });

      if (stats.completedSessions > 0) {
        stats.averageSessionLength = Math.round(stats.totalFocusTime / stats.completedSessions);
      }

      return stats;
    } catch (error) {
      console.error('Error calculating session stats:', error);
      return {
        totalSessions: 0,
        totalFocusTime: 0,
        averageSessionLength: 0,
        completedSessions: 0,
        moodDistribution: {
          Happy: 0,
          Neutral: 0,
          Sad: 0,
          Anxious: 0,
          Excited: 0
        },
        sessionsThisWeek: 0,
        sessionsThisMonth: 0
      };
    }
  },

  // Format duration for display
  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  },

  // Get productivity streaks
  async getProductivityStreaks() {
    try {
      const sessions = await this.getUserSessions();
      const completedSessions = sessions.filter(s => s.status === 'Completed');
      
      if (completedSessions.length === 0) {
        return { currentStreak: 0, longestStreak: 0 };
      }

      // Sort sessions by date
      completedSessions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      let lastDate = null;

      completedSessions.forEach(session => {
        const sessionDate = new Date(session.createdAt).toDateString();
        
        if (lastDate === null) {
          // First session
          tempStreak = 1;
          currentStreak = 1;
        } else {
          const daysDiff = Math.floor((new Date(sessionDate) - new Date(lastDate)) / (1000 * 60 * 60 * 24));
          
          if (daysDiff === 1) {
            // Consecutive day
            tempStreak++;
            if (tempStreak > longestStreak) {
              longestStreak = tempStreak;
            }
          } else if (daysDiff === 0) {
            // Same day, don't break streak
            // Do nothing
          } else {
            // Gap in days
            if (tempStreak > longestStreak) {
              longestStreak = tempStreak;
            }
            tempStreak = 1;
          }
        }
        
        lastDate = sessionDate;
      });

      // Check if we need to update current streak
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
      
      if (lastDate === today || lastDate === yesterday) {
        currentStreak = tempStreak;
      } else {
        currentStreak = 0;
      }

      return { currentStreak, longestStreak };
    } catch (error) {
      console.error('Error calculating productivity streaks:', error);
      return { currentStreak: 0, longestStreak: 0 };
    }
  }
};

export default pomodoroService;
