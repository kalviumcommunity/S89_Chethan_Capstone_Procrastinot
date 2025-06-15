// src/components/Navbar1.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Moon,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  CheckSquare,
  Timer,
  BookOpen,
  Trophy
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifications] = useState(3); // Mock notification count

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const navLinks = [
    { to: "/dashboard", label: "Home", icon: Home },
    { to: "/tasks", label: "Tasks", icon: CheckSquare },
    { to: "/pomodoro", label: "Pomodoro", icon: Timer },
    { to: "/skills", label: "Skills", icon: BookOpen },
    { to: "/challenges", label: "Challenges", icon: Trophy },
  ];

  return (
    <motion.nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'glass border-b border-white/10 shadow-glass'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Left: Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/dashboard"
            className="flex items-center space-x-2 text-xl font-display font-bold"
          >
            <motion.span
              className="text-2xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
            >
              🧠
            </motion.span>
            <span className="text-gradient">Procrastinot</span>
          </Link>
        </motion.div>

        {/* Center: Navigation Links - Desktop */}
        <div className="hidden lg:flex items-center space-x-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <motion.div key={to} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={to}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium"
              >
                <Icon size={18} />
                <span className="hidden xl:block">{label}</span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <motion.div
            className="relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <button className="p-2 rounded-xl glass hover:bg-white/20 text-white/80 hover:text-white transition-all duration-200">
              <Bell size={20} />
              {notifications > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {notifications}
                </motion.span>
              )}
            </button>
          </motion.div>

          {/* Theme Toggle */}
          <motion.button
            className="p-2 rounded-xl glass hover:bg-white/20 text-white/80 hover:text-white transition-all duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Moon size={20} />
          </motion.button>

          {/* Profile Dropdown */}
          <div className="relative">
            <motion.button
              onClick={handleProfileClick}
              className="flex items-center gap-2 p-2 rounded-xl glass hover:bg-white/20 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-semibold text-sm">
                C
              </div>
              <span className="hidden md:block text-white/80 font-medium">Chethan</span>
            </motion.button>
          </div>

          {/* Mobile Menu Toggle */}
          <motion.button
            className="lg:hidden p-2 rounded-xl glass hover:bg-white/20 text-white/80 hover:text-white transition-all duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isMenuOpen ? 1 : 0,
          height: isMenuOpen ? 'auto' : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="glass border-t border-white/10 px-6 py-4">
          <div className="space-y-2">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <motion.div key={to} whileTap={{ scale: 0.95 }}>
                <Link
                  to={to}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </Link>
              </motion.div>
            ))}

            {/* Mobile Profile Actions */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <motion.button
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 w-full"
                whileTap={{ scale: 0.95 }}
                onClick={handleProfileClick}
              >
                <Settings size={20} />
                <span>Settings</span>
              </motion.button>

              <motion.button
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 w-full"
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
              >
                <LogOut size={20} />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
}
