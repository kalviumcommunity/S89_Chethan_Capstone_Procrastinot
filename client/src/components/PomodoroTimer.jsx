import { motion } from "framer-motion";
import clsx from "clsx";
import { Play, Pause, RotateCcw, User, Heart } from "lucide-react";
import { usePomodoro } from "../hooks/usePomodoro";
import { useUser } from "../contexts/UserContext";
import { useTasks } from "../hooks/useTasks";

const MODES = {
  work: { label: "Work", duration: 25 * 60 },
  short: { label: "Short Break", duration: 5 * 60 },
  long: { label: "Long Break", duration: 15 * 60 },
};

const MOOD_OPTIONS = [
  { value: 'Happy', emoji: '😊', color: 'text-green-400' },
  { value: 'Neutral', emoji: '😐', color: 'text-gray-400' },
  { value: 'Anxious', emoji: '😰', color: 'text-yellow-400' },
  { value: 'Excited', emoji: '🤩', color: 'text-purple-400' },
  { value: 'Sad', emoji: '😢', color: 'text-blue-400' },
];

export default function PomodoroTimer() {
  const { user } = useUser();
  const { tasks } = useTasks(user?._id);

  const {
    mode,
    timeLeft,
    isRunning,
    currentSession,
    formatTime,
    selectedTask,
    moodBefore,
    moodAfter,
    startTimer,
    pauseTimer,
    resetTimer,
    changeMode,
    setTaskForSession,
    setMoodBeforeSession,
    setMoodAfterSession,
    progress,
    isWorkMode,
    canStart,
    canPause,
    canReset,
    error,
  } = usePomodoro(user?._id);

  // Show error if any
  if (error) {
    console.error('Pomodoro error:', error);
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="card-glass p-8 md:p-12">
        {/* Task Selection for Work Mode */}
        {isWorkMode && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-primary-400" />
              <h3 className="text-lg font-semibold text-white">Focus on a Task (Optional)</h3>
            </div>
            <select
              value={selectedTask?._id || ''}
              onChange={(e) => {
                const task = tasks?.find(t => t._id === e.target.value);
                setTaskForSession(task || null);
              }}
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-primary-400 focus:outline-none"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white'
              }}
              disabled={isRunning}
            >
              <option value="" style={{ backgroundColor: '#1f2937', color: 'white' }}>No specific task</option>
              {tasks?.filter(task => task.status !== 'Completed').map(task => (
                <option key={task._id} value={task._id} style={{ backgroundColor: '#1f2937', color: 'white' }}>
                  {task.title}
                </option>
              ))}
            </select>
          </motion.div>
        )}

        {/* Mood Selection */}
        {isWorkMode && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-5 h-5 text-primary-400" />
              <h3 className="text-lg font-semibold text-white">How are you feeling?</h3>
            </div>
            <div className="flex gap-3 flex-wrap">
              {MOOD_OPTIONS.map(mood => (
                <motion.button
                  key={mood.value}
                  onClick={() => isRunning ? setMoodAfterSession(mood.value) : setMoodBeforeSession(mood.value)}
                  className={clsx(
                    "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200",
                    (isRunning ? moodAfter : moodBefore) === mood.value
                      ? "bg-primary-500/30 border-2 border-primary-400"
                      : "bg-white/10 border-2 border-transparent hover:bg-white/20"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-xl">{mood.emoji}</span>
                  <span className={clsx("text-sm font-medium", mood.color)}>{mood.value}</span>
                </motion.button>
              ))}
            </div>
            <p className="text-white/60 text-sm mt-2">
              {isRunning ? "How do you feel now?" : "Set your mood before starting"}
            </p>
          </motion.div>
        )}

        {/* Mode Selector */}
        <motion.div
          className="flex justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {Object.entries(MODES).map(([key, value]) => (
            <motion.button
              key={key}
              onClick={() => changeMode(key)}
              className={clsx(
                "px-6 py-3 rounded-2xl font-semibold transition-all duration-300 relative overflow-hidden",
                mode === key
                  ? "glass text-white shadow-glass border-2 border-white/20"
                  : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border-2 border-transparent"
              )}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              disabled={isRunning}
            >
              <span className="relative z-10">{value.label}</span>
              {mode === key && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-2xl"
                  layoutId="activeMode"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Timer Circle */}
        <motion.div
          className="relative w-80 h-80 mx-auto mb-12"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Outer Glow Ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 blur-xl" />

          {/* Main Timer Circle */}
          <div className="relative w-full h-full card-glass rounded-full p-8 flex items-center justify-center">
            <svg className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] transform -rotate-90">
              {/* Background Circle */}
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress Circle */}
              <motion.circle
                cx="50%"
                cy="50%"
                r="45%"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeDasharray={2 * Math.PI * (0.45 * 320)}
                strokeDashoffset={(1 - progress) * 2 * Math.PI * (0.45 * 320)}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              {/* Gradient Definition */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>

            {/* Timer Display */}
            <div className="text-center">
              <motion.div
                className="text-6xl md:text-7xl font-display font-bold text-white mb-2"
                key={timeLeft}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {formatTime(timeLeft)}
              </motion.div>
              <div className="text-white/60 text-lg font-medium">
                {MODES[mode].label}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {canStart ? (
            <motion.button
              onClick={startTimer}
              disabled={!user}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play size={24} />
              <span>{isWorkMode ? 'Start Focus' : 'Start Break'}</span>
            </motion.button>
          ) : (
            <motion.button
              onClick={pauseTimer}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Pause size={24} />
              <span>Pause</span>
            </motion.button>
          )}

          <motion.button
            onClick={resetTimer}
            disabled={!canReset}
            className="flex items-center justify-center gap-3 px-8 py-4 glass text-white rounded-2xl font-semibold hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw size={24} />
            <span>Reset</span>
          </motion.button>
        </motion.div>

        {/* Current Session Info */}
        {currentSession && (
          <motion.div
            className="mt-8 p-4 bg-white/10 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="text-center">
              <p className="text-white/70 text-sm mb-2">Current Session</p>
              {selectedTask && (
                <p className="text-white font-medium mb-1">📝 {selectedTask.title}</p>
              )}
              <p className="text-primary-400 text-sm">
                Mood: {MOOD_OPTIONS.find(m => m.value === moodBefore)?.emoji} {moodBefore}
              </p>
            </div>
          </motion.div>
        )}

        {/* Error Display */}
        {error && (
          <motion.div
            className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-red-300 text-sm text-center">{error}</p>
          </motion.div>
        )}
      </div>


    </div>
  );
}
