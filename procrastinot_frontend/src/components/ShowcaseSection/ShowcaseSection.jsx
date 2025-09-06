import { useEffect, useRef, useState } from 'react';
import styles from './ShowcaseSection.module.css';

const items = [
  { img: '/images/pomodoro-timer.jpg', title: 'Pomodoro Timer', desc: 'Master time with focused 25-minute work sessions. Build deep work habits that defeat procrastination.' },
  { img: '/images/task-flow.jpg', title: 'Smart Task Manager', desc: 'AI-powered task breakdown turns overwhelming projects into manageable steps with CRUD operations.' },
  { img: '/images/mood-tracker.jpg', title: 'Mood Analytics', desc: 'Track emotional patterns to optimize productivity cycles and maintain mental balance.' },
  { img: '/images/skill-growth.jpg', title: 'Skill Builder', desc: 'Gamified learning paths with progress tracking. Master HTML, JavaScript, Python through structured modules.' },
  { img: '/images/challenge.jpg', title: 'Daily Challenges', desc: 'AI-generated productivity challenges keep you motivated with fresh goals every day.' },
  { img: '/images/mindful-focus.jpg', title: 'Voice & Offline', desc: 'text-to-speech output and offline support ensure productivity anywhere, anytime.' },
];

const ShowcaseSection = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [currentSet, setCurrentSet] = useState(0);

  useEffect(() => {
    const ob = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    if (sectionRef.current) ob.observe(sectionRef.current);
    return () => ob.disconnect();
  }, []);

  useEffect(() => {
    if (visible) {
      const timer = setInterval(() => {
        setCurrentSet(prev => prev === 0 ? 1 : 0);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [visible]);

  return (
    <section ref={sectionRef} className={styles.showcase}>
      <div className="container-wide">
        <h2 className={`heading-xl text-center ${styles.title}`}>
          Crafted with <span className="text-gradient">Intent</span>
        </h2>
        <p className={`text-lg text-center ${styles.subtitle}`}>
          A glimpse into the experience—minimal, elegant, and highly functional.
        </p>

        <div className={styles.grid}>
          {items.slice(currentSet * 3, (currentSet + 1) * 3).map((it, idx) => {
            const originalIdx = currentSet * 3 + idx;
            return (
              <article 
                key={originalIdx} 
                className={`${styles.card} glass ${styles.cardIn}`}
                style={{ 
                  animationDelay: `${idx * 0.15}s`,
                  transform: `perspective(1000px) rotateY(${(idx - 1) * 5}deg)`
                }}
              >
                <div className={styles.mediaWrap}>
                  <img 
                    src={it.img} 
                    alt={it.title} 
                    className={styles.image} 
                    loading="lazy" 
                  />
                  <div className={styles.smoke} aria-hidden="true" />
                </div>
                <div className={styles.textWrap}>
                  <h3 className={`heading-md ${styles.cardTitle}`}>{it.title}</h3>
                  <p className={`text-base ${styles.cardDesc}`}>{it.desc}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;
