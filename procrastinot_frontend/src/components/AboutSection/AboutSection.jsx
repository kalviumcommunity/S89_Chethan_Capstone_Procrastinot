import { useEffect, useRef, useState } from 'react';
import styles from './AboutSection.module.css';

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={styles.aboutSection}>
      <div className="container">
        <div className={`${styles.content} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.textContent}>
            <h2 className={`heading-xl ${styles.title}`}>
              The Way of the <span className="text-gradient">Productive Warrior</span>
            </h2>
            <div className={styles.philosophy}>
              <p className={`text-lg ${styles.philosophyText}`}>
                In ancient Japan, samurai understood that true strength came not from the sword, 
                but from the discipline of mind and spirit. Procrastinot channels this timeless 
                wisdom into the modern battle against distraction and delay.
              </p>
              <p className={`text-base ${styles.description}`}>
                Our platform combines proven productivity techniques with cutting-edge AI technology, 
                creating a digital dojo where you can forge your focus, sharpen your skills, and 
                master the art of getting things done.
              </p>
            </div>
            
            <div className={styles.principles}>
              <h3 className={`heading-md ${styles.principlesTitle}`}>Core Principles</h3>
              <div className={styles.principlesList}>
                <div className={styles.principle}>
                  <div className={styles.principleIcon}>
                    <div className={styles.iconFocus}></div>
                  </div>
                  <div className={styles.principleContent}>
                    <h4 className={styles.principleTitle}>Mindful Focus</h4>
                    <p className={styles.principleDescription}>
                      Like meditation in motion, every task becomes an opportunity for presence and purpose.
                    </p>
                  </div>
                </div>
                
                <div className={styles.principle}>
                  <div className={styles.principleIcon}>
                    <div className={styles.iconGrowth}></div>
                  </div>
                  <div className={styles.principleContent}>
                    <h4 className={styles.principleTitle}>Continuous Growth</h4>
                    <p className={styles.principleDescription}>
                      Progress through practice, learning from each session to build lasting habits.
                    </p>
                  </div>
                </div>
                
                <div className={styles.principle}>
                  <div className={styles.principleIcon}>
                    <div className={styles.iconBalance}></div>
                  </div>
                  <div className={styles.principleContent}>
                    <h4 className={styles.principleTitle}>Balanced Discipline</h4>
                    <p className={styles.principleDescription}>
                      Honor both work and rest, understanding that true productivity includes recovery.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.visualElement}>
            <div className={styles.samuraiSymbol}>
              <div className={styles.outerRing}></div>
              <div className={styles.innerSymbol}>
                <div className={styles.symbolLine}></div>
                <div className={styles.symbolLine}></div>
                <div className={styles.symbolLine}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;