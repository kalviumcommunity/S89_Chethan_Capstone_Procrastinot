// src/pages/Pomodoro.jsx
import PomodoroTimer from "../components/PomodoroTimer";
import Navbar from "../components/Navbar1";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { Timer, Target, TrendingUp, Clock, Calendar } from "lucide-react";
import { useUser } from "../contexts/UserContext";
import { usePomodoro } from "../hooks/usePomodoro";
import { useTheme } from "../contexts/ThemeContext";
import { useState } from "react";

export default function Pomodoro() {
  const { user } = useUser();
  const { isDark } = useTheme();
  const { stats, sessions, loading } = usePomodoro(user?._id);
  const [selectedTimeframe, setSelectedTimeframe] = useState('today');
  return (
    <div className={`min-h-screen ${isDark ? 'bg-mesh text-white' : 'bg-gradient-to-br from-slate-50 to-blue-50 text-gray-900'} relative overflow-hidden`}>
      {/* Animated Background */}
      <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-dark-900/50 via-primary-900/30 to-secondary-900/50' : 'bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50'}`} />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />

        <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
          {/* Header Section */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-white/90 text-sm font-medium mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Timer size={16} className="text-primary-400" />
              <span>Focus Session</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              <span className="text-gradient">Pomodoro</span>
              <span className="block text-white mt-2">Focus Timer</span>
            </h1>

            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
              Boost your productivity with the scientifically-proven Pomodoro technique.
              Focus for 25 minutes, then take a well-deserved break.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {[
              {
                label: "Today's Sessions",
                value: loading ? "..." : stats?.totalSessions || "0",
                icon: Target
              },
              {
                label: "Total Focus Time",
                value: loading ? "..." : `${(stats?.totalFocusTime || 0).toFixed(1)}h`,
                icon: Timer
              },
              {
                label: "Productivity Score",
                value: loading ? "..." : `${stats?.productivityScore || 0}%`,
                icon: TrendingUp
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="card-glass p-6 text-center"
                whileHover={{ scale: 1.02, y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 mb-3">
                  <stat.icon className="w-6 h-6 text-primary-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Timer Component */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <PomodoroTimer />
          </motion.div>

          {/* Recent Sessions */}
          {sessions && sessions.length > 0 && (
            <motion.div
              className="mt-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="card-glass p-8 max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-6 h-6 text-primary-400" />
                  <h3 className="text-xl font-semibold text-white">Today's Sessions</h3>
                </div>

                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {sessions.slice(0, 5).map((session, index) => (
                    <motion.div
                      key={session._id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <div>
                          <p className="text-white font-medium">
                            {session.taskId ? `📝 Task Session` : '🎯 Focus Session'}
                          </p>
                          <p className="text-white/60 text-sm">
                            {new Date(session.startTime).toLocaleTimeString()} - {Math.round(session.duration / 60)} min
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">
                          {session.moodBefore === 'Happy' && '😊'}
                          {session.moodBefore === 'Neutral' && '😐'}
                          {session.moodBefore === 'Anxious' && '😰'}
                          {session.moodBefore === 'Excited' && '🤩'}
                          {session.moodBefore === 'Sad' && '😢'}
                        </span>
                        {session.moodAfter && (
                          <>
                            <span className="text-white/40">→</span>
                            <span className="text-2xl">
                              {session.moodAfter === 'Happy' && '😊'}
                              {session.moodAfter === 'Neutral' && '😐'}
                              {session.moodAfter === 'Anxious' && '😰'}
                              {session.moodAfter === 'Excited' && '🤩'}
                              {session.moodAfter === 'Sad' && '😢'}
                            </span>
                          </>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {sessions.length === 0 && (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-white/30 mx-auto mb-4" />
                    <p className="text-white/60">No sessions completed today yet.</p>
                    <p className="text-white/40 text-sm">Start your first focus session above!</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Tips Section */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="card-glass p-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-white mb-4">💡 Pro Tips</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-white/70">
                <div className="text-left">
                  <p className="mb-2">• Eliminate distractions before starting</p>
                  <p className="mb-2">• Focus on one task at a time</p>
                  <p className="mb-2">• Set your mood before each session</p>
                </div>
                <div className="text-left">
                  <p className="mb-2">• Take breaks seriously - they're important!</p>
                  <p className="mb-2">• Track your mood before and after</p>
                  <p className="mb-2">• Associate sessions with specific tasks</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
