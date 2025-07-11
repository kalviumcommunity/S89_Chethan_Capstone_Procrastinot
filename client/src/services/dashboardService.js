// src/services/dashboardService.js
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

// Dashboard Service Functions
export const dashboardService = {
  // Get comprehensive dashboard data for a user
  async getDashboardData(userId) {
    try {
      const [tasksResponse, pomodoroResponse, userResponse] = await Promise.all([
        api.get(`/tasks/user/${userId}`),
        api.get(`/pomodoro/user/${userId}`),
        api.get(`/users/profile/${userId}`)
      ]);

      const tasks = tasksResponse.data;
      const pomodoroSessions = pomodoroResponse.data;
      const user = userResponse.data.user;

      // Calculate dashboard statistics
      const stats = this.calculateDashboardStats(tasks, pomodoroSessions);
      
      // Get recent activities
      const recentActivities = this.getRecentActivities(tasks, pomodoroSessions);

      return {
        user,
        stats,
        recentActivities,
        tasks,
        pomodoroSessions
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data');
    }
  },

  // Calculate dashboard statistics
  calculateDashboardStats(tasks, pomodoroSessions) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Task statistics
    const completedTasks = tasks.filter(task => task.status === 'Completed');
    const todayCompletedTasks = completedTasks.filter(task => 
      new Date(task.completedAt || task.updatedAt) >= today
    );
    const weeklyCompletedTasks = completedTasks.filter(task => 
      new Date(task.completedAt || task.updatedAt) >= thisWeek
    );

    // Pomodoro statistics
    const completedSessions = pomodoroSessions.filter(session => session.status === 'Completed');
    const todaySessions = completedSessions.filter(session => 
      new Date(session.createdAt) >= today
    );
    const weeklySessions = completedSessions.filter(session => 
      new Date(session.createdAt) >= thisWeek
    );

    // Calculate total focus time (in hours)
    const totalFocusTime = completedSessions.reduce((total, session) => 
      total + (session.duration || 0), 0
    ) / 3600; // Convert seconds to hours

    const todayFocusTime = todaySessions.reduce((total, session) => 
      total + (session.duration || 0), 0
    ) / 3600;

    // Calculate streak (consecutive days with completed tasks or pomodoro sessions)
    const streak = this.calculateStreak(tasks, pomodoroSessions);

    // Calculate level based on total completed tasks and sessions
    const totalActivities = completedTasks.length + completedSessions.length;
    const level = Math.floor(totalActivities / 10) + 1; // Level up every 10 activities

    // Calculate productivity score (percentage of tasks completed vs created this week)
    const weeklyTasks = tasks.filter(task => 
      new Date(task.createdAt) >= thisWeek
    );
    const productivityScore = weeklyTasks.length > 0 
      ? Math.round((weeklyCompletedTasks.length / weeklyTasks.length) * 100)
      : 100;

    return {
      tasksCompleted: completedTasks.length,
      todayTasksCompleted: todayCompletedTasks.length,
      weeklyTasksCompleted: weeklyCompletedTasks.length,
      totalFocusTime: Math.round(totalFocusTime * 10) / 10, // Round to 1 decimal
      todayFocusTime: Math.round(todayFocusTime * 10) / 10,
      totalSessions: completedSessions.length,
      todaySessions: todaySessions.length,
      weeklySessions: weeklySessions.length,
      streak,
      level,
      productivityScore,
      pendingTasks: tasks.filter(task => task.status === 'Pending').length,
      inProgressTasks: tasks.filter(task => task.status === 'In Progress').length
    };
  },

  // Calculate consecutive days streak
  calculateStreak(tasks, pomodoroSessions) {
    const activities = [
      ...tasks.filter(task => task.status === 'Completed').map(task => ({
        date: new Date(task.completedAt || task.updatedAt),
        type: 'task'
      })),
      ...pomodoroSessions.filter(session => session.status === 'Completed').map(session => ({
        date: new Date(session.createdAt),
        type: 'pomodoro'
      }))
    ];

    // Group activities by date
    const activityDates = {};
    activities.forEach(activity => {
      const dateKey = activity.date.toDateString();
      activityDates[dateKey] = true;
    });

    // Calculate streak from today backwards
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) { // Check up to a year
      const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateKey = checkDate.toDateString();
      
      if (activityDates[dateKey]) {
        streak++;
      } else if (i > 0) { // Don't break on first day (today) if no activity
        break;
      }
    }

    return streak;
  },

  // Get recent activities for dashboard feed
  getRecentActivities(tasks, pomodoroSessions, limit = 10) {
    const activities = [
      ...tasks.filter(task => task.status === 'Completed').map(task => ({
        id: task._id,
        type: 'task_completed',
        title: task.title,
        description: `Completed task: ${task.title}`,
        timestamp: new Date(task.completedAt || task.updatedAt),
        icon: 'check',
        color: 'green'
      })),
      ...pomodoroSessions.filter(session => session.status === 'Completed').map(session => ({
        id: session._id,
        type: 'pomodoro_completed',
        title: 'Focus Session Completed',
        description: `Completed ${Math.round(session.duration / 60)} minute focus session`,
        timestamp: new Date(session.createdAt),
        icon: 'timer',
        color: 'blue'
      })),
      ...tasks.filter(task => task.status === 'Pending' && 
        new Date(task.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      ).map(task => ({
        id: task._id,
        type: 'task_created',
        title: 'New Task Created',
        description: `Created task: ${task.title}`,
        timestamp: new Date(task.createdAt),
        icon: 'plus',
        color: 'purple'
      }))
    ];

    // Sort by timestamp (most recent first) and limit
    return activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  },

  // Get quick stats for widgets
  async getQuickStats(userId) {
    try {
      const data = await this.getDashboardData(userId);
      return {
        tasksCompleted: data.stats.todayTasksCompleted,
        focusTime: `${data.stats.todayFocusTime}h`,
        streak: data.stats.streak,
        level: data.stats.level
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch quick stats');
    }
  }
};

export default dashboardService;
