// src/pages/Dashboard.jsx
import Navbar from '../components/Navbar1';
import Footer from '../components/Footer';
import FeatureCard from '../components/FeatureCard';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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
  User,
  Activity,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import { dashboardService } from '../services/dashboardService';

export default function Dashboard() {
  const { user, loading: userLoading } = useUser();
  const { isDark } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load dashboard data when user is available
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user?._id) return;

      try {
        setLoading(true);
        setError(null);
        const data = await dashboardService.getDashboardData(user._id);
        setDashboardData(data);
      } catch (err) {
        console.error('Dashboard data error:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user?._id]);

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

  // Dynamic stats based on real data
  const stats = dashboardData ? [
    {
      label: 'Tasks Completed',
      value: dashboardData.stats.todayTasksCompleted.toString(),
      icon: Target,
      color: 'text-green-400',
      total: dashboardData.stats.tasksCompleted
    },
    {
      label: 'Focus Time',
      value: `${dashboardData.stats.todayFocusTime}h`,
      icon: Clock,
      color: 'text-blue-400',
      total: `${dashboardData.stats.totalFocusTime}h total`
    },
    {
      label: 'Streak Days',
      value: dashboardData.stats.streak.toString(),
      icon: TrendingUp,
      color: 'text-orange-400',
      total: 'consecutive days'
    },
    {
      label: 'Level',
      value: dashboardData.stats.level.toString(),
      icon: Award,
      color: 'text-purple-400',
      total: `${dashboardData.stats.productivityScore}% productivity`
    },
  ] : [
    { label: 'Tasks Completed', value: '0', icon: Target, color: 'text-green-400' },
    { label: 'Focus Time', value: '0h', icon: Clock, color: 'text-blue-400' },
    { label: 'Streak Days', value: '0', icon: TrendingUp, color: 'text-orange-400' },
    { label: 'Level', value: '1', icon: Award, color: 'text-purple-400' },
  ];

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Show loading state
  if (userLoading || loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-mesh text-white' : 'bg-gradient-to-br from-slate-50 to-blue-50 text-gray-900'} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900/50 via-primary-900/30 to-secondary-900/50" />
        <div className="relative z-10">
          <Navbar />
          <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className={`${isDark ? 'text-white/70' : 'text-gray-600'}`}>Loading your dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-mesh text-white' : 'bg-gradient-to-br from-slate-50 to-blue-50 text-gray-900'} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900/50 via-primary-900/30 to-secondary-900/50" />
        <div className="relative z-10">
          <Navbar />
          <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex items-center justify-center">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h2 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Unable to load dashboard
              </h2>
              <p className={`${isDark ? 'text-white/70' : 'text-gray-600'} mb-4`}>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-mesh text-white' : 'bg-gradient-to-br from-slate-50 to-blue-50 text-gray-900'} relative overflow-hidden`}>
      {/* Animated Background */}
      <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-dark-900/50 via-primary-900/30 to-secondary-900/50' : 'bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50'}`} />

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
              <span className={`font-medium ${isDark ? 'text-white/90' : 'text-gray-700'}`}>
                {getGreeting()}, {user?.username || user?.name || 'User'}!
              </span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Ready to be
              <span className="text-gradient block mt-2">Productive?</span>
            </h1>

            <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-8 ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
              Choose your productivity tool and start making progress towards your goals.
            </p>

            {/* Current Time */}
            <motion.div
              className={`inline-flex items-center gap-2 text-sm ${isDark ? 'text-white/60' : 'text-gray-500'}`}
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
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${isDark ? 'from-white/10 to-white/5' : 'from-gray-100 to-gray-50'} mb-3 group-hover:scale-110 transition-transform duration-200`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.value}</div>
                <div className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-600'}`}>{stat.label}</div>
                {stat.total && (
                  <div className={`text-xs mt-1 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>{stat.total}</div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Recent Activities */}
          {dashboardData?.recentActivities && dashboardData.recentActivities.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-16"
            >
              <div className="card-glass p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="w-6 h-6 text-primary-400" />
                  <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Recent Activity
                  </h2>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {dashboardData.recentActivities.slice(0, 5).map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      className={`flex items-center gap-3 p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.color === 'green' ? 'bg-green-500/20 text-green-400' :
                        activity.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {activity.icon === 'check' && <CheckCircle size={16} />}
                        {activity.icon === 'timer' && <Clock size={16} />}
                        {activity.icon === 'plus' && <Target size={16} />}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {activity.title}
                        </p>
                        <p className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                          {activity.description}
                        </p>
                      </div>
                      <div className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
                        {activity.timestamp.toLocaleTimeString()}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

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
              <Link to="/pomodoro">
                <motion.button
                  className="btn-primary px-6 py-3 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Zap size={20} />
                  Quick Start Pomodoro
                </motion.button>
              </Link>

              <Link to="/tasks">
                <motion.button
                  className="btn-glass px-6 py-3 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Target size={20} />
                  Add New Task
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
