import { useState, useEffect } from 'react';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className={styles.hero}>
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
  );
};

export default HeroSection;