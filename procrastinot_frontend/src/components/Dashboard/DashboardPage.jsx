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
            <div className={`${styles.featureCard} ${styles.modernCard}`} onClick={() => { window.location.href = '/smart-plan'; }}>
              <div className={styles.cardBackground}></div>
              <div className={styles.featureIcon}>
                <PlanIcon width={32} height={32} color="#DC2626" />
              </div>
              <h3 className={styles.featureTitle}>Smart Plan</h3>
              <p className={styles.featureDesc}>Organize tasks with intelligent planning</p>
              <div className={styles.cardParticles}>
                <div className={styles.particle}></div>
                <div className={styles.particle}></div>
                <div className={styles.particle}></div>
              </div>
            </div>
            
            <div className={`${styles.featureCard} ${styles.modernCard}`} onClick={() => { window.location.href = '/pomodoro'; }}>
              <div className={styles.cardBackground}></div>
              <div className={styles.featureIcon}>
                <TimerIcon width={32} height={32} color="#DC2626" />
              </div>
              <h3 className={styles.featureTitle}>Pomodoro</h3>
              <p className={styles.featureDesc}>Focus sessions with mood tracking</p>
              <div className={styles.cardParticles}>
                <div className={styles.particle}></div>
                <div className={styles.particle}></div>
                <div className={styles.particle}></div>
              </div>
            </div>
            
            <div className={`${styles.featureCard} ${styles.modernCard}`} onClick={() => { window.location.href = '/eduspace'; }}>
              <div className={styles.cardBackground}></div>
              <div className={styles.featureIcon}>
                <ChallengeIcon width={32} height={32} color="#DC2626" />
              </div>
              <h3 className={styles.featureTitle}>EduSpace</h3>
              <p className={styles.featureDesc}>AI-powered learning experiences</p>
              <div className={styles.cardParticles}>
                <div className={styles.particle}></div>
                <div className={styles.particle}></div>
                <div className={styles.particle}></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className={styles.aiSection}>
        <div className="container">
          <div className={styles.aiHeader}>
            <h2 className={styles.aiTitle}>🤖 AI-Powered Productivity</h2>
            <p className={styles.aiSubtitle}>Experience the future of productivity with intelligent assistance</p>
          </div>
          
          <div className={styles.aiGrid}>
            <div className={styles.aiCard}>
              <div className={styles.aiIcon}>💬</div>
              <h3>Smart ChatBot</h3>
              <p>Get instant answers, productivity tips, and personalized guidance powered by advanced AI</p>
              <div className={styles.aiFeatures}>
                <span>• Real-time assistance</span>
                <span>• Context-aware responses</span>
                <span>• Learning recommendations</span>
              </div>
            </div>
            
            <div className={styles.aiCard}>
              <div className={styles.aiIcon}>📚</div>
              <h3>EduSpace AI</h3>
              <p>Comprehensive learning content generated dynamically for 140+ technologies and concepts</p>
              <div className={styles.aiFeatures}>
                <span>• Personalized content</span>
                <span>• Interactive learning</span>
                <span>• Up-to-date information</span>
              </div>
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