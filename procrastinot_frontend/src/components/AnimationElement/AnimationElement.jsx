import { useEffect, useRef, useState } from 'react';
import styles from './AnimationElement.module.css';

const AnimationElement = () => {
  const canvasRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (canvasRef.current) {
      observer.observe(canvasRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = Math.min(50, Math.floor(canvas.width / 20));
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.3,
          hue: Math.random() * 60 + 340, // Red to pink range
        });
      }
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(15, 15, 15, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x <= 0 || particle.x >= canvas.width) particle.vx *= -1;
        if (particle.y <= 0 || particle.y >= canvas.height) particle.vy *= -1;

        // Keep particles in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`;
        ctx.fill();

        // Draw connections
        particlesRef.current.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = `hsla(${particle.hue}, 70%, 60%, ${0.3 * (1 - distance / 100)})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        });
      });

      // Draw central samurai-inspired geometric shape
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const time = Date.now() * 0.001;
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(time * 0.5);
      
      // Draw rotating hexagon
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = Math.cos(angle) * 60;
        const y = Math.sin(angle) * 60;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = `hsla(0, 70%, 60%, 0.8)`;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Inner triangle
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const angle = (i * Math.PI * 2) / 3 + time;
        const x = Math.cos(angle) * 30;
        const y = Math.sin(angle) * 30;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = `hsla(0, 70%, 60%, 0.3)`;
      ctx.fill();
      
      ctx.restore();

      animationRef.current = requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible]);

  return (
    <section className={styles.animationSection}>
      <div className={styles.content}>
        <h2 className={`heading-lg text-center ${styles.title}`}>
          The Path of <span className="text-gradient">Digital Discipline</span>
        </h2>
        <p className={`text-base text-center ${styles.description}`}>
          Like particles in motion finding their perfect harmony, 
          your productivity journey connects every small action into a greater purpose.
        </p>
      </div>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        aria-label="Interactive particle animation representing the harmony of productivity"
      />
    </section>
  );
};

export default AnimationElement;