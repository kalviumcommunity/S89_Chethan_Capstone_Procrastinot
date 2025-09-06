import { useState, useEffect, useRef } from 'react';
import styles from './FeatureCards.module.css';

const features = [
  {
    id: 1,
    title: "Pomodoro Mastery",
    description: "Channel your focus like a samurai in meditation. Break your tasks into focused intervals, building discipline one session at a time.",
    image: "https://images.unsplash.com/photo-1506766584506-6ecfd12c73d8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw4fHxzYW11cmFpJTIwbWVkaXRhdGlvbiUyMGZvY3VzfGVufDB8MHx8cmVkfDE3NTcwOTE1MzB8MA&ixlib=rb-4.1.0&q=85",
    attribution: "René DeAnda on Unsplash",
    icon: "timer"
  },
  {
    id: 2,
    title: "AI Task Sensei",
    description: "Let artificial intelligence guide your path to productivity. Break down complex goals into achievable steps with smart recommendations.",
    image: "https://images.unsplash.com/photo-1599769920961-0e8a823cb3a6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHx6ZW4lMjBnYXJkZW4lMjBtaW5kZnVsbmVzc3xlbnwwfDB8fGJsYWNrX2FuZF93aGl0ZXwxNTcwOTE1MzB8MA&ixlib=rb-4.1.0&q=85",
    attribution: "Syed Ali on Unsplash",
    icon: "brain"
  },
  {
    id: 3,
    title: "Mood Dojo",
    description: "Track your emotional state like a warrior tracks the battlefield. Understand patterns and optimize your mental performance.",
    image: "https://images.unsplash.com/photo-1558908926-c49ce35441bd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw5fHx6ZW4lMjBnYXJkZW4lMjBtaW5kZnVsbmVzc3xlbnwwfDB8fGJsYWNrX2FuZF93aGl0ZXwxNzU3MDkxNTMwfDA&ixlib=rb-4.1.0&q=85",
    attribution: "Ryoji Hayasaka on Unsplash",
    icon: "mood"
  },
  {
    id: 4,
    title: "Skill Forge",
    description: "Master new abilities through structured learning paths. Build your expertise with the patience and dedication of ancient craftsmen.",
    image: "https://images.unsplash.com/photo-1503681355143-d5485eea7f14?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw0fHxjYWxsaWdyYXBoeSUyMGJydXNoJTIwbGVhcm5pbmd8ZW58MHwwfHxibGFja3wxNzU3MDkxNTMwfDA&ixlib=rb-4.1.0&q=85",
    attribution: "Kira auf der Heide on Unsplash",
    icon: "skill"
  }
];

const FeatureCards = () => {
  const [activeCard, setActiveCard] = useState(0);
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

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isVisible]);

  const getCardClass = (index) => {
    if (index === activeCard) return styles.active;
    if (index === (activeCard + 1) % features.length) return styles.next;
    if (index === (activeCard - 1 + features.length) % features.length) return styles.prev;
    return styles.hidden;
  };

  return (
    <section ref={sectionRef} className={styles.featuresSection}>
      <div className="container-wide">
        <div className={styles.sectionHeader}>
          <h2 className={`heading-xl text-center ${styles.title}`}>
            Ancient Wisdom, <span className="text-gradient">Modern Tools</span>
          </h2>
          <p className={`text-lg text-center ${styles.subtitle}`}>
            Discover the features that will transform your productivity journey
          </p>
        </div>

        <div className={styles.cardsContainer}>
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`${styles.card} ${getCardClass(index)} glass`}
              onClick={() => setActiveCard(index)}
            >
              <div className={styles.cardContent}>
                <div className={styles.imageSection}>
                  <img
                    src={feature.image}
                    alt={`${feature.title} - ${feature.attribution}`}
                    className={styles.featureImage}
                    style={{ width: '100%', height: '300px' }}
                  />
                  <div className={styles.imageOverlay}></div>
                </div>
                <div className={styles.textSection}>
                  <div className={styles.iconContainer}>
                    <div className={`${styles.icon} ${styles[feature.icon]}`}></div>
                  </div>
                  <h3 className={`heading-md ${styles.cardTitle}`}>
                    {feature.title}
                  </h3>
                  <p className={`text-base ${styles.cardDescription}`}>
                    {feature.description}
                  </p>
                  <button className={`btn btn-ghost ${styles.learnMore}`}>
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.cardIndicators}>
          {features.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${index === activeCard ? styles.indicatorActive : ''}`}
              onClick={() => setActiveCard(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;