import { useEffect, useState } from 'react';
import authService from '../../services/authService';
import styles from './SuccessPage.module.css';

const SuccessPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userData = await authService.getUserProfile();
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.successCard}>
        <div className={styles.icon}>
          <span className={styles.checkmark}>✓</span>
        </div>
        
        <h1 className={styles.title}>
          Welcome to <span className={styles.brand}>Procrastinot</span>!
        </h1>
        
        <p className={styles.message}>
          🎉 Authentication successful! You're now ready to boost your productivity.
        </p>

        {user && (
          <div className={styles.userInfo}>
            <p className={styles.greeting}>
              Hello, <strong>{user.username || user.email}</strong>!
            </p>
            <p className={styles.subtext}>
              Your journey to defeat procrastination starts now.
            </p>
          </div>
        )}

        <div className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🍅</span>
            <span>Pomodoro Timer</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>📝</span>
            <span>Task Management</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>📊</span>
            <span>Progress Tracking</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🎯</span>
            <span>Daily Challenges</span>
          </div>
        </div>

        <div className={styles.actions}>
          <button 
            className={`btn btn-primary ${styles.continueBtn}`}
            onClick={() => window.location.href = '/dashboard'}
          >
            Continue to Dashboard
          </button>
          <button 
            className={`btn btn-ghost ${styles.logoutBtn}`}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;