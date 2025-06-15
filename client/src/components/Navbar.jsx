import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 w-full px-6 py-4 flex items-center justify-between z-50 transition-all duration-300 ${
        scrolled
          ? 'glass border-b border-white/10 shadow-glass'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          to="/"
          className="flex items-center space-x-2 text-2xl font-display font-bold text-white hover:text-primary-300 transition-colors duration-200"
        >
          <motion.span
            className="text-3xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            🧠
          </motion.span>
          <span className="text-gradient-accent">Procrastinot</span>
        </Link>
      </motion.div>

      {/* Navigation Links - Hidden on mobile, shown on desktop */}
      <div className="hidden md:flex items-center space-x-8">
        <Link
          to="#features"
          className="text-white/80 hover:text-white font-medium transition-colors duration-200 hover:scale-105 transform"
        >
          Features
        </Link>
        <Link
          to="#about"
          className="text-white/80 hover:text-white font-medium transition-colors duration-200 hover:scale-105 transform"
        >
          About
        </Link>
        <Link
          to="#contact"
          className="text-white/80 hover:text-white font-medium transition-colors duration-200 hover:scale-105 transform"
        >
          Contact
        </Link>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/login"
            className="btn-glass text-sm md:text-base px-4 md:px-6 py-2 md:py-3"
          >
            Login
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/register"
            className="btn-primary text-sm md:text-base px-4 md:px-6 py-2 md:py-3 relative overflow-hidden group"
          >
            <span className="relative z-10">Get Started</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-accent-500 to-secondary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              layoutId="button-bg"
            />
          </Link>
        </motion.div>
      </div>
    </motion.nav>
  );
}
