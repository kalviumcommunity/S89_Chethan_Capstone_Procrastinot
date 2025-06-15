// src/pages/Dashboard.jsx
import Navbar from '../components/Navbar1';
import Footer from '../components/Footer';
import FeatureCard from '../components/FeatureCard';
import { motion } from 'framer-motion';
import {
  TimerIcon,
  SmileIcon,
  BrainIcon,
  CalendarIcon,
  RocketIcon,
  GraduationCapIcon,
  TrendingUp,
  Clock,
  Target,
  Zap,
  Award,
  User
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName] = useState('Chethan'); // This would come from auth context

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      title: 'Pomodoro Timer',
      description: 'Boost focus with scientifically-proven time management techniques.',
      icon: <TimerIcon className="w-8 h-8" />,
      to: '/pomodoro',
      gradient: 'from-red-500 to-orange-500'
    },
    {
      title: 'Mood Tracker',
      description: 'Monitor your emotional journey and productivity patterns.',
      icon: <SmileIcon className="w-8 h-8" />,
      to: '/mood',
      gradient: 'from-yellow-500 to-pink-500'
    },
    {
      title: 'AI Task Assistant',
      description: 'Get intelligent task breakdowns and smart recommendations.',
      icon: <BrainIcon className="w-8 h-8" />,
      to: '/ai-tasks',
      gradient: 'from-purple-500 to-indigo-500'
    },
    {
      title: 'Task Management',
      description: 'Organize and prioritize your tasks with advanced tools.',
      icon: <CalendarIcon className="w-8 h-8" />,
      to: '/tasks',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Daily Challenges',
      description: 'Stay motivated with gamified productivity missions.',
      icon: <RocketIcon className="w-8 h-8" />,
      to: '/challenges',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Skill Building',
      description: 'Accelerate learning with curated content and tracking.',
      icon: <GraduationCapIcon className="w-8 h-8" />,
      to: '/skills',
      gradient: 'from-violet-500 to-purple-500'
    },
  ];

  const stats = [
    { label: 'Tasks Completed', value: '24', icon: Target, color: 'text-green-400' },
    { label: 'Focus Time', value: '4.2h', icon: Clock, color: 'text-blue-400' },
    { label: 'Streak Days', value: '12', icon: TrendingUp, color: 'text-orange-400' },
    { label: 'Level', value: '7', icon: Award, color: 'text-purple-400' },
  ];

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="min-h-screen bg-mesh text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900/50 via-primary-900/30 to-secondary-900/50" />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />

        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              className="inline-flex items-center gap-3 glass px-6 py-3 rounded-full mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <User size={20} className="text-primary-400" />
              <span className="text-white/90 font-medium">
                {getGreeting()}, {userName}!
              </span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Ready to be
              <span className="text-gradient block mt-2">Productive?</span>
            </h1>

            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-8">
              Choose your productivity tool and start making progress towards your goals.
            </p>

            {/* Current Time */}
            <motion.div
              className="inline-flex items-center gap-2 text-white/60 text-sm"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Clock size={16} />
              <span>{currentTime.toLocaleTimeString()}</span>
            </motion.div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="card-glass p-6 text-center group hover:scale-105 transition-transform duration-200"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 mb-3 group-hover:scale-110 transition-transform duration-200`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Feature Cards Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: 0.1 * index,
                  ease: "easeOut"
                }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center gap-4">
              <motion.button
                className="btn-primary px-6 py-3 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Zap size={20} />
                Quick Start Pomodoro
              </motion.button>

              <motion.button
                className="btn-glass px-6 py-3 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Target size={20} />
                Add New Task
              </motion.button>
            </div>
          </motion.div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
