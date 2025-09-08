import { useState } from 'react';
import DashboardNavbar from './DashboardNavbar';
import SkillsIcon from '../icons/SkillsIcon';
import ChallengeIcon from '../icons/ChallengeIcon';
import TimerIcon from '../icons/TimerIcon';
import PlanIcon from '../icons/PlanIcon';
import styles from './DashboardPage.module.css';

const formatWelcomeMessage = (userName) => {
  const hour = new Date().getHours();
  let greeting = 'Good evening';
  
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 18) greeting = 'Good afternoon';
  
  return `${greeting}, ${userName}`;
};

const DashboardPage = ({ 
  user, 
  stats, 
  activities, 
  challenges, 
  onNavigate, 
  onLogout 
}) => {
  const [activeRoute, setActiveRoute] = useState('home');

  const handleNavigate = (route) => {
    setActiveRoute(route);
    if (onNavigate) {
      onNavigate(route);
    }
  };

  const handleQuickAction = (action) => {
    console.log(`Quick action: ${action}`);
    // Handle quick actions
  };

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.backgroundImage}></div>
      
      <DashboardNavbar 
        user={user}
        activeRoute={activeRoute}
        onNavigate={handleNavigate}
        onLogout={onLogout}
      />
      
      <main className={styles.mainContent}>
        <div className="container-wide">
          <div className={styles.welcomeSection}>
            <h1 className={`heading-hero ${styles.welcomeTitle}`}>
              {formatWelcomeMessage(user.username || user.name || user.email?.split('@')[0] || 'User')}
            </h1>
            <p className={`text-lg ${styles.welcomeSubtitle}`}>
              Your Productivity Dashboard
            </p>
          </div>
          
          <div className={styles.quickActionsSection}>
            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <TimerIcon width={48} height={48} color="#667eea" />
                </div>
                <h3 className={styles.featureTitle}>Pomodoro Timer</h3>
                <p className={styles.featureDescription}>
                  Boost your focus with 25-minute work sessions followed by short breaks. Perfect for deep work and maintaining concentration.
                </p>
                <button 
                  className={`btn btn-primary ${styles.featureButton}`}
                  onClick={() => handleQuickAction('start_pomodoro')}
                >
                  Start Session
                </button>
              </div>
              
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <PlanIcon width={48} height={48} color="#10b981" />
                </div>
                <h3 className={styles.featureTitle}>Task Management</h3>
                <p className={styles.featureDescription}>
                  Organize your daily tasks, set priorities, and track your progress. Stay on top of your goals with smart task planning.
                </p>
                <button 
                  className={`btn btn-secondary ${styles.featureButton}`}
                  onClick={() => handleQuickAction('view_tasks')}
                >
                  Manage Tasks
                </button>
              </div>
              
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <SkillsIcon width={48} height={48} color="#f59e0b" />
                </div>
                <h3 className={styles.featureTitle}>Skill Development</h3>
                <p className={styles.featureDescription}>
                  Learn new skills and track your progress. Build expertise through structured learning paths and consistent practice.
                </p>
                <button 
                  className={`btn btn-secondary ${styles.featureButton}`}
                  onClick={() => handleQuickAction('learn_skill')}
                >
                  Start Learning
                </button>
              </div>
              
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <ChallengeIcon width={48} height={48} color="#ef4444" />
                </div>
                <h3 className={styles.featureTitle}>Daily Challenges</h3>
                <p className={styles.featureDescription}>
                  Take on daily productivity challenges to build better habits and push your limits. Gamify your growth journey.
                </p>
                <button 
                  className={`btn btn-accent ${styles.featureButton}`}
                  onClick={() => handleQuickAction('daily_challenge')}
                >
                  View Challenges
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;