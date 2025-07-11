// src/hooks/usePomodoro.js
import { useState, useEffect, useRef, useCallback } from 'react';
import { pomodoroService } from '../services/pomodoroService';
import confetti from 'canvas-confetti';

const MODES = {
  work: { label: "Work", duration: 25 * 60 },
  short: { label: "Short Break", duration: 5 * 60 },
  long: { label: "Long Break", duration: 15 * 60 },
};

const chime = new Audio("/assets/preview.mp3");

export const usePomodoro = (userId) => {
  // Timer state
  const [mode, setMode] = useState("work");
  const [timeLeft, setTimeLeft] = useState(MODES[mode].duration);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  
  // Statistics state
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalFocusTime: 0,
    productivityScore: 0,
  });
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Task integration
  const [selectedTask, setSelectedTask] = useState(null);
  const [moodBefore, setMoodBefore] = useState('Neutral');
  const [moodAfter, setMoodAfter] = useState('Neutral');
  
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  // Request notification permission on mount
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // Format time helper
  const formatTime = useCallback((seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, []);

  // Load user statistics
  const loadStats = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const userStats = await pomodoroService.getUserStats(userId, 'today');
      setStats(userStats);
      setSessions(userStats.sessions || []);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load pomodoro stats:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Load stats on mount and when userId changes
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Reset timer when mode changes
  useEffect(() => {
    setTimeLeft(MODES[mode].duration);
    setIsRunning(false);
    clearInterval(intervalRef.current);
    
    // End current session if switching modes
    if (currentSession && mode !== 'work') {
      handleSessionEnd(false); // Don't mark as completed if switching modes
    }
  }, [mode]);

  // Handle session completion
  const handleSessionCompletion = useCallback(async () => {
    // Visual and audio feedback
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    chime.play();
    
    // Browser notification
    if (Notification.permission === "granted") {
      new Notification("Pomodoro Complete! 🎉", {
        body: `You completed a ${MODES[mode].label.toLowerCase()} session.`,
        icon: "/favicon.ico",
      });
    }

    // Complete the session in backend
    if (currentSession) {
      try {
        await pomodoroService.completeSession(
          currentSession.session._id, 
          moodAfter, 
          ''
        );
        
        // Reload stats to reflect the completed session
        await loadStats();
      } catch (err) {
        console.error('Failed to complete session:', err);
        setError('Failed to save session completion');
      }
    }

    setIsRunning(false);
    setCurrentSession(null);
  }, [currentSession, moodAfter, loadStats, mode]);

  // Handle session end (pause or cancel)
  const handleSessionEnd = useCallback(async (completed = false) => {
    if (!currentSession) return;

    try {
      if (completed) {
        await pomodoroService.completeSession(
          currentSession.session._id, 
          moodAfter, 
          ''
        );
      } else {
        await pomodoroService.pauseSession(currentSession.session._id);
      }
      
      await loadStats();
    } catch (err) {
      console.error('Failed to end session:', err);
      setError('Failed to save session state');
    }
  }, [currentSession, moodAfter, loadStats]);

  // Timer effect
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

  // Start timer
  const startTimer = useCallback(async () => {
    if (!userId) {
      setError('User not authenticated');
      return;
    }

    try {
      setError(null);
      
      // Only create a new session for work mode
      if (mode === 'work') {
        const sessionData = await pomodoroService.startSession(
          userId,
          selectedTask?._id || null,
          MODES[mode].duration,
          moodBefore
        );
        setCurrentSession(sessionData);
      }
      
      setIsRunning(true);
      startTimeRef.current = new Date();
    } catch (err) {
      setError(err.message);
      console.error('Failed to start session:', err);
    }
  }, [userId, mode, selectedTask, moodBefore]);

  // Pause timer
  const pauseTimer = useCallback(async () => {
    setIsRunning(false);
    
    if (currentSession && mode === 'work') {
      await handleSessionEnd(false);
    }
  }, [currentSession, mode, handleSessionEnd]);

  // Reset timer
  const resetTimer = useCallback(async () => {
    setIsRunning(false);
    setTimeLeft(MODES[mode].duration);
    
    if (currentSession && mode === 'work') {
      await handleSessionEnd(false);
      setCurrentSession(null);
    }
  }, [mode, currentSession, handleSessionEnd]);

  // Change mode
  const changeMode = useCallback((newMode) => {
    setMode(newMode);
  }, []);

  // Set task for session
  const setTaskForSession = useCallback((task) => {
    setSelectedTask(task);
  }, []);

  // Set mood before session
  const setMoodBeforeSession = useCallback((mood) => {
    setMoodBefore(mood);
  }, []);

  // Set mood after session
  const setMoodAfterSession = useCallback((mood) => {
    setMoodAfter(mood);
  }, []);

  return {
    // Timer state
    mode,
    timeLeft,
    isRunning,
    currentSession,
    formatTime,
    
    // Statistics
    stats,
    sessions,
    loading,
    error,
    
    // Task integration
    selectedTask,
    moodBefore,
    moodAfter,
    
    // Actions
    startTimer,
    pauseTimer,
    resetTimer,
    changeMode,
    setTaskForSession,
    setMoodBeforeSession,
    setMoodAfterSession,
    loadStats,
    
    // Computed values
    progress: 1 - (timeLeft / MODES[mode].duration),
    isWorkMode: mode === 'work',
    canStart: !isRunning,
    canPause: isRunning,
    canReset: timeLeft !== MODES[mode].duration || currentSession,
  };
};

export default usePomodoro;
