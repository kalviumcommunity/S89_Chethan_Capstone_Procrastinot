import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import confetti from "canvas-confetti";
import { Play, Pause, RotateCcw } from "lucide-react";

const MODES = {
  work: { label: "Work", duration: 25 * 60 },
  short: { label: "Short Break", duration: 5 * 60 },
  long: { label: "Long Break", duration: 15 * 60 },
};

const chime = new Audio("/assets/preview.mp3");

export default function PomodoroTimer() {
  const [mode, setMode] = useState("work");
  const [timeLeft, setTimeLeft] = useState(MODES[mode].duration);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (Notification.permission !== "granted") Notification.requestPermission();
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  useEffect(() => {
    setTimeLeft(MODES[mode].duration);
    setIsRunning(false);
    clearInterval(intervalRef.current);
  }, [mode]);

  const handleSessionCompletion = () => {
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    chime.play();
    if (Notification.permission === "granted") {
      new Notification("Pomodoro Complete! 🎉", {
        body: `You completed a ${MODES[mode].label.toLowerCase()} session.`,
        icon: "/favicon.ico",
      });
    }
    setIsRunning(false);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 0) {
            clearInterval(intervalRef.current);
            handleSessionCompletion();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, handleSessionCompletion]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="card-glass p-8 md:p-12">


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
              onClick={() => setMode(key)}
              className={clsx(
                "px-6 py-3 rounded-2xl font-semibold transition-all duration-300 relative overflow-hidden",
                mode === key
                  ? "glass text-white shadow-glass border-2 border-white/20"
                  : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border-2 border-transparent"
              )}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
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
                strokeDashoffset={(1 - timeLeft / MODES[mode].duration) * 2 * Math.PI * (0.45 * 320)}
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
          {!isRunning ? (
            <motion.button
              onClick={() => {
                setIsRunning(true);
                setStartTime(new Date());
              }}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play size={24} />
              <span>Start Focus</span>
            </motion.button>
          ) : (
            <motion.button
              onClick={() => setIsRunning(false)}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Pause size={24} />
              <span>Pause</span>
            </motion.button>
          )}

          <motion.button
            onClick={() => {
              setIsRunning(false);
              setTimeLeft(MODES[mode].duration);
            }}
            className="flex items-center justify-center gap-3 px-8 py-4 glass text-white rounded-2xl font-semibold hover:bg-white/20 transition-all duration-200"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw size={24} />
            <span>Reset</span>
          </motion.button>
        </motion.div>
      </div>


    </div>
  );
}
