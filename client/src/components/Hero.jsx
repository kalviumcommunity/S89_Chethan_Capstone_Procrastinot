import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Sparkles, Zap, Target, Brain } from 'lucide-react';

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const floatingIcons = [
    { Icon: Sparkles, delay: 0, x: '10%', y: '20%' },
    { Icon: Zap, delay: 1, x: '85%', y: '15%' },
    { Icon: Target, delay: 2, x: '15%', y: '70%' },
    { Icon: Brain, delay: 1.5, x: '80%', y: '75%' },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-primary-400/30 to-secondary-400/30 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 0.02,
            y: mousePosition.y * 0.02,
          }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-80 h-80 bg-gradient-to-r from-accent-400/20 to-primary-400/20 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * -0.01,
            y: mousePosition.y * -0.01,
          }}
          style={{ bottom: '10%', right: '10%' }}
        />

        {/* Floating Icons */}
        {floatingIcons.map(({ Icon, delay, x, y }, index) => (
          <motion.div
            key={index}
            className="absolute text-white/20"
            style={{ left: x, top: y }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Icon size={32} />
          </motion.div>
        ))}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-6xl mx-auto"
      >
        {/* Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-white/90 text-sm font-medium mb-8"
        >
          <Sparkles size={16} className="text-accent-400" />
          <span>AI-Powered Productivity Suite</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white leading-tight mb-6"
        >
          <span className="block">Beat</span>
          <span className="text-gradient block">Procrastination</span>
          <span className="block text-4xl md:text-5xl lg:text-6xl mt-2 text-white/80">
            Build Your Future
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl lg:text-2xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          Transform your productivity with AI-powered task management,
          <span className="text-primary-300"> Pomodoro techniques</span>,
          mood tracking, and
          <span className="text-secondary-300"> personalized skill building</span>
          — all in one beautiful platform.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/register"
              className="btn-primary text-lg px-8 py-4 relative overflow-hidden group min-w-[200px]"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Zap size={20} />
                Start Your Journey
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-accent-500 to-secondary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                layoutId="cta-bg"
              />
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/login"
              className="btn-glass text-lg px-8 py-4 min-w-[200px] flex items-center gap-2 justify-center"
            >
              <Target size={20} />
              Sign In
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={itemVariants}
          className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto"
        >
          {[
            { number: '10K+', label: 'Active Users' },
            { number: '50K+', label: 'Tasks Completed' },
            { number: '95%', label: 'Success Rate' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                {stat.number}
              </div>
              <div className="text-sm text-white/60">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
