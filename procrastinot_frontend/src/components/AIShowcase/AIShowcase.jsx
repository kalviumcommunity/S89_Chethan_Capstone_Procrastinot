import styles from './AIShowcase.module.css';

const AIShowcase = () => {
  return (
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
  );
};

export default AIShowcase;