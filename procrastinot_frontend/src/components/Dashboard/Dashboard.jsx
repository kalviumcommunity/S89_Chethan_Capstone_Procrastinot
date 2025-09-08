import { useState, useEffect } from 'react';
import DashboardPage from './DashboardPage';
import authService from '../../services/authService';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    focusTime: 0,
    activeSessions: 0,
    skillProgress: 0,
    completedTasks: 0
  });
  const [activities, setActivities] = useState([]);
  const [challenges, setChallenges] = useState({
    daily: { completed: 0, total: 5 },
    weekly: { completed: 0, total: 25 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        if (!authService.isAuthenticated()) {
          window.location.href = '/';
          return;
        }

        const [userData, statsData] = await Promise.all([
          authService.getUserProfile(),
          authService.getDashboardStats()
        ]);

        console.log('User data received:', userData); // Debug log
        setUser(userData);
        setStats(statsData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        // If auth fails, redirect to home
        authService.logout();
        window.location.href = '/';
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleNavigate = (route) => {
    console.log(`Navigating to: ${route}`);
    // Future: Implement routing to different sections
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #dc2626 50%, #000000 100%)',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardPage
      user={user}
      stats={stats}
      activities={activities}
      challenges={challenges}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    />
  );
};

export default Dashboard;