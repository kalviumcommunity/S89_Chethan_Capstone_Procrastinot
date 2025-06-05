import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import clsx from "clsx";
import confetti from "canvas-confetti";
import { Play, Pause, RotateCcw } from "lucide-react";

const MODES = {
  work: { label: "Work", duration: 25 * 60 },
  short: { label: "Short Break", duration: 5 * 60 },
  long: { label: "Long Break", duration: 15 * 60 },
};

const MOODS = [
  { label: "Happy", emoji: "😊" },
  { label: "Neutral", emoji: "😐" },
  { label: "Sad", emoji: "😢" },
  { label: "Anxious", emoji: "😰" },
  { label: "Excited", emoji: "😄" },
];

const chime = new Audio("/assets/preview.mp3");

export default function PomodoroTimer() {
  const [mode, setMode] = useState("work");
  const [timeLeft, setTimeLeft] = useState(MODES[mode].duration);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [moodBefore, setMoodBefore] = useState("Neutral");
  const [showMoodAfter, setShowMoodAfter] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || "http://localhost:8080/api"}/tasks`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTasks(response.data.filter((task) => task.status !== "Completed"));
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    fetchTasks();
  }, []);

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

  const handleSessionCompletion = useCallback(
    async (moodAfter = "Neutral") => {
      const endTime = new Date();
      const token = localStorage.getItem("token");
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      chime.play();
      if (Notification.permission === "granted") {
        new Notification("Pomodoro Complete! 🎉", {
          body: `You completed a ${MODES[mode].label.toLowerCase()} session.`,
          icon: "/favicon.ico",
        });
      }
      try {
        const userId = JSON.parse(localStorage.getItem("user"))._id;
        await axios.post(
          `${import.meta.env.VITE_API_URL || "http://localhost:8080/api"}/pomodoro`,
          {
            userId,
            taskId: selectedTaskId || null,
            duration: MODES[mode].duration,
            status: "Completed",
            startTime,
            endTime,
            moodBefore,
            moodAfter,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Error saving Pomodoro:", err);
      }
    },
    [mode, startTime, selectedTaskId, moodBefore]
  );

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 0) {
            clearInterval(intervalRef.current);
            setShowMoodAfter(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-800 to-purple-700 text-white p-6 flex flex-col items-center">
      <div className="max-w-xl w-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-lg p-8">
        {/* Task Selection */}
        <div className="mb-6">
          <label className="block text-sm mb-2">Select Task</label>
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="w-full p-2 rounded-lg text-black"
          >
            <option value="">No Task Selected</option>
            {tasks.map((task) => (
              <option key={task._id} value={task._id}>
                {task.title}
              </option>
            ))}
          </select>
        </div>

        {/* Mood Before */}
        <div className="mb-6">
          <label className="block text-sm mb-2">How do you feel?</label>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <button
                key={m.label}
                onClick={() => setMoodBefore(m.label)}
                className={clsx(
                  "px-3 py-1 rounded-full text-sm transition flex items-center gap-1",
                  moodBefore === m.label
                    ? "bg-purple-600 text-white"
                    : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                )}
              >
                <span>{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex justify-center gap-4 mb-6">
          {Object.entries(MODES).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={clsx(
                "px-4 py-2 rounded-full font-semibold",
                mode === key
                  ? "bg-white text-purple-700"
                  : "bg-purple-200 text-purple-900 hover:bg-purple-300"
              )}
            >
              {value.label}
            </button>
          ))}
        </div>

        {/* Timer Circle */}
        <div className="relative w-64 h-64 mx-auto mb-6">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="128" cy="128" r="115" stroke="#4c1d95" strokeWidth="16" fill="none" />
            <circle
              cx="128"
              cy="128"
              r="115"
              stroke="#c084fc"
              strokeWidth="16"
              fill="none"
              strokeDasharray={2 * Math.PI * 115}
              strokeDashoffset={(1 - timeLeft / MODES[mode].duration) * 2 * Math.PI * 115}
              strokeLinecap="round"
              className="transition-all duration-200 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-5xl font-bold">
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {!isRunning ? (
            <button
              onClick={() => {
                setIsRunning(true);
                setStartTime(new Date());
              }}
              className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 shadow"
            >
              <Play size={20} /> Start
            </button>
          ) : (
            <button
              onClick={() => setIsRunning(false)}
              className="flex items-center gap-2 px-6 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 shadow"
            >
              <Pause size={20} /> Pause
            </button>
          )}
          <button
            onClick={() => {
              setIsRunning(false);
              setTimeLeft(MODES[mode].duration);
            }}
            className="flex items-center gap-2 px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 shadow"
          >
            <RotateCcw size={20} /> Reset
          </button>
        </div>
      </div>

      {/* Mood After Modal */}
      {showMoodAfter && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white text-purple-900 p-6 rounded-2xl shadow-xl w-[90%] max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-center">How do you feel now?</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {MOODS.map((m) => (
                <button
                  key={m.label}
                  onClick={() => {
                    handleSessionCompletion(m.label);
                    setShowMoodAfter(false);
                  }}
                  className="px-4 py-2 rounded-full bg-purple-100 text-purple-800 hover:bg-purple-200"
                >
                  {m.emoji} {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
