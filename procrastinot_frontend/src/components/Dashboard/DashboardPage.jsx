import { useState, useEffect } from 'react';
import DashboardNavbar from './DashboardNavbar';
import FeatureCards from '../FeatureCards/FeatureCards';
import ShowcaseSection from '../ShowcaseSection/ShowcaseSection';
import AnimationElement from '../AnimationElement/AnimationElement';
import AboutSection from '../AboutSection/AboutSection';
import Footer from '../Footer/Footer';
import PlanIcon from '../icons/PlanIcon';
import TimerIcon from '../icons/TimerIcon';
import SkillsIcon from '../icons/SkillsIcon';
import ChallengeIcon from '../icons/ChallengeIcon';
import ChatBot from '../ChatBot/ChatBot';
import styles from './DashboardPage.module.css';

const DashboardPage = ({ 
  user, 
  onNavigate, 
  onLogout 
}) => {
  const [activeRoute, setActiveRoute] = useState('home');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleNavigate = (route) => {
    setActiveRoute(route);
    if (onNavigate) {
      onNavigate(route);
    }
  };

  return (
    <div className={styles.dashboardPage}>
      <DashboardNavbar 
        user={user}
        activeRoute={activeRoute}
        onNavigate={handleNavigate}
        onLogout={onLogout}
      />
      
      <section className={styles.heroSection}>
        <div className={styles.videoContainer}>
          <video
            className={styles.backgroundVideo}
            autoPlay
            muted
            loop
            playsInline
            onError={() => console.error('Video failed to load')}
            onLoadStart={() => console.log('Video loading started')}
          >
            <source src="/images/hero-video.mp4" type="video/mp4" />
          </video>
          <div className={styles.overlay}></div>
        </div>
        
        <div className={`${styles.content} ${isLoaded ? styles.loaded : ''}`}>
          <div className="container">
            <div className={styles.heroText}>
              <h1 className={`heading-hero ${styles.title}`}>
                <span className="text-gradient">Procrastinot</span>
              </h1>
              <p className={`text-lg ${styles.subtitle}`}>
                Master your mind like a samurai masters the blade. 
                Defeat procrastination with ancient wisdom and modern technology.
              </p>
            </div>
          </div>
        </div>
        
        <div className={styles.scrollIndicator}>
          <div className={styles.scrollArrow}></div>
        </div>
      </section>
      
      <section className={styles.dashboardFeatures}>
        <div className="container">
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard} onClick={() => { window.location.href = '/smart-plan'; }}>
              <div className={styles.featureIcon}>
                <PlanIcon width={32} height={32} color="#DC2626" />
              </div>
              <h3 className={styles.featureTitle}>Smart Plan</h3>
            </div>
            
            <div className={styles.featureCard} onClick={() => { window.location.href = '/pomodoro'; }}>
              <div className={styles.featureIcon}>
                <TimerIcon width={32} height={32} color="#DC2626" />
              </div>
              <h3 className={styles.featureTitle}>Pomodoro</h3>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <SkillsIcon width={32} height={32} color="#DC2626" />
              </div>
              <h3 className={styles.featureTitle}>Skills</h3>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <ChallengeIcon width={32} height={32} color="#DC2626" />
              </div>
              <h3 className={styles.featureTitle}>Daily Challenges</h3>
            </div>
          </div>
        </div>
      </section>
      
      <FeatureCards />
      <ShowcaseSection />
      <AnimationElement />
      <AboutSection />
      <Footer />
      
      <ChatBot />
    </div>
  );
};

export default DashboardPage;