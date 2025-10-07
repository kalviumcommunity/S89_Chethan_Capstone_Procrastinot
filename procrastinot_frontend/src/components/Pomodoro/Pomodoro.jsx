import { useState, useEffect, useRef } from 'react';
import DashboardNavbar from '../Dashboard/DashboardNavbar';
import ChatBot from '../ChatBot/ChatBot';
import styles from './Pomodoro.module.css';
import taskService from '../../services/taskService';
import pomodoroService from '../../services/pomodoroService';
import authService from '../../services/authService';

const PomodoroTimer = ({ 
  selectedTasks, 
  onSessionComplete, 
  onTaskComplete 
}) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionType, setSessionType] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const [sessionCount, setSessionCount] = useState(0);
  const [moodBefore, setMoodBefore] = useState('Neutral');
  const [moodAfter, setMoodAfter] = useState('Neutral');
  const [notes, setNotes] = useState('');
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showSessionComplete, setShowSessionComplete] = useState(false);
  const intervalRef = useRef(null);

  const sessionDurations = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsActive(false);
    setIsPaused(true);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(sessionDurations[sessionType]);
  };

  const completeSession = async () => {
    setIsActive(false);
    setIsPaused(false);
    
    // Mark selected tasks as completed if this was a work session
    if (sessionType === 'work' && selectedTasks.length > 0) {
      for (const task of selectedTasks) {
        try {
          await taskService.updateTask(task._id, { 
            status: 'Completed', 
            completedAt: new Date().toISOString() 
          });
          onTaskComplete(task._id);
        } catch (error) {
          console.error('Failed to complete task:', error);
        }
      }
    }

    // Show mood modal for work sessions
    if (sessionType === 'work') {
      setShowMoodModal(true);
    } else {
      // For breaks, just show completion and move to next session
      setShowSessionComplete(true);
      setTimeout(() => {
        setShowSessionComplete(false);
        moveToNextSession();
      }, 2000);
    }
  };

  const moveToNextSession = () => {
    if (sessionType === 'work') {
      setSessionCount(prev => prev + 1);
      if (sessionCount % 3 === 0 && sessionCount > 0) {
        setSessionType('longBreak');
      } else {
        setSessionType('shortBreak');
      }
    } else {
      setSessionType('work');
    }
    setTimeLeft(sessionDurations[sessionType === 'work' ? 'shortBreak' : 'work']);
  };

  const handleMoodSubmit = async () => {
    try {
      // Create pomodoro session record
      const sessionData = {
        userId: authService.userId,
        taskId: selectedTasks.length > 0 ? selectedTasks[0]._id : null,
        duration: sessionDurations.work,
        status: 'Completed',
        moodBefore,
        moodAfter,
        startTime: new Date(Date.now() - sessionDurations.work * 1000).toISOString(),
        endTime: new Date().toISOString(),
        notes
      };

      // Save the session to backend
      await pomodoroService.createSession(sessionData);
      
      setShowMoodModal(false);
      setShowSessionComplete(true);
      setTimeout(() => {
        setShowSessionComplete(false);
        moveToNextSession();
      }, 2000);
      
      onSessionComplete(sessionData);
    } catch (error) {
      console.error('Failed to save session:', error);
      // Still show completion even if save fails
      setShowMoodModal(false);
      setShowSessionComplete(true);
      setTimeout(() => {
        setShowSessionComplete(false);
        moveToNextSession();
      }, 2000);
    }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            completeSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft]);

  useEffect(() => {
    setTimeLeft(sessionDurations[sessionType]);
  }, [sessionType]);

  const getProgress = () => {
    const total = sessionDurations[sessionType];
    return ((total - timeLeft) / total) * 100;
  };

  return (
    <div className={styles.timerContainer}>
      <div className={styles.timerHeader}>
        <h2 className={styles.sessionType}>
          {sessionType === 'work' ? 'Focus Session' : 
           sessionType === 'shortBreak' ? 'Short Break' : 'Long Break'}
        </h2>
        <div className={styles.sessionCount}>
          Session {sessionCount + 1}
        </div>
      </div>

      <div className={styles.timerDisplay}>
        <div className={styles.timerTime}>{formatTime(timeLeft)}</div>
        <div className={styles.sessionIndicators}>
          {[1, 2, 3, 4].map((dot, index) => (
            <div 
              key={index} 
              className={`${styles.sessionDot} ${index === sessionCount % 4 ? styles.active : ''}`}
            />
          ))}
        </div>
      </div>

      <div className={styles.timerControls}>
        {!isActive && !isPaused && (
          <button className={styles.controlBtn} onClick={startTimer} title="Start">
            ▶
          </button>
        )}
        {isActive && (
          <button className={styles.controlBtn} onClick={pauseTimer} title="Pause">
            ⏸
          </button>
        )}
        {isPaused && (
          <button className={styles.controlBtn} onClick={startTimer} title="Resume">
            ▶
          </button>
        )}
        <button className={styles.controlBtn} onClick={resetTimer} title="Reset">
          ↻
        </button>
      </div>

      <div className={styles.sessionTypeButtons}>
        <button 
          className={`${styles.sessionTypeBtn} ${sessionType === 'work' ? styles.active : ''}`}
          onClick={() => {
            setSessionType('work');
            setTimeLeft(sessionDurations.work);
          }}
        >
          Focus
        </button>
        <button 
          className={`${styles.sessionTypeBtn} ${sessionType === 'shortBreak' ? styles.active : ''}`}
          onClick={() => {
            setSessionType('shortBreak');
            setTimeLeft(sessionDurations.shortBreak);
          }}
        >
          Short Break
        </button>
        <button 
          className={`${styles.sessionTypeBtn} ${sessionType === 'longBreak' ? styles.active : ''}`}
          onClick={() => {
            setSessionType('longBreak');
            setTimeLeft(sessionDurations.longBreak);
          }}
        >
          Long Break
        </button>
      </div>

      {/* Mood Modal */}
      {showMoodModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.moodModal}>
            <h3>Session Complete! 🎉</h3>
            <p>How are you feeling after this focus session?</p>
            
            <div className={styles.moodSection}>
              <label>Mood Before:</label>
              <select 
                value={moodBefore} 
                onChange={(e) => setMoodBefore(e.target.value)}
                className={styles.moodSelect}
              >
                <option value="Happy">😊 Happy</option>
                <option value="Neutral">😐 Neutral</option>
                <option value="Sad">😢 Sad</option>
                <option value="Anxious">😰 Anxious</option>
                <option value="Excited">🤩 Excited</option>
              </select>
            </div>

            <div className={styles.moodSection}>
              <label>Mood After:</label>
              <select 
                value={moodAfter} 
                onChange={(e) => setMoodAfter(e.target.value)}
                className={styles.moodSelect}
              >
                <option value="Happy">😊 Happy</option>
                <option value="Neutral">😐 Neutral</option>
                <option value="Sad">😢 Sad</option>
                <option value="Anxious">😰 Anxious</option>
                <option value="Excited">🤩 Excited</option>
              </select>
            </div>

            <div className={styles.notesSection}>
              <label>Notes (optional):</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How did the session go? Any insights?"
                className={styles.notesInput}
                rows="3"
              />
            </div>

            <div className={styles.modalActions}>
              <button className="btn btn-primary" onClick={handleMoodSubmit}>
                Complete Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Session Complete Modal */}
      {showSessionComplete && (
        <div className={styles.modalOverlay}>
          <div className={styles.completeModal}>
            <div className={styles.completeIcon}>🎉</div>
            <h3>Session Complete!</h3>
            <p>Great job! {sessionType === 'work' ? 'Time for a break!' : 'Ready to focus again?'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const TaskSelector = ({ tasks, selectedTasks, onTaskToggle, onTaskComplete }) => {
  const isSelected = (taskId) => selectedTasks.some(t => t._id === taskId);

  // Group tasks by date
  const groupedTasks = tasks.reduce((groups, task) => {
    const date = task.dueDate ? new Date(task.dueDate).toDateString() : 'No Date';
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(task);
    return groups;
  }, {});

  const formatDateHeader = (dateString) => {
    if (dateString === 'No Date') return 'No Due Date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className={styles.taskSelector}>
      <div className={styles.taskHeader}>
        <h3>Task List</h3>
        <div className={styles.taskHeaderActions}>
          <button className={styles.headerActionBtn} title="Edit">
            ✏️
          </button>
          <button className={styles.headerActionBtn} title="Delete">
            🗑️
          </button>
        </div>
      </div>

      <div className={styles.taskList}>
        {Object.keys(groupedTasks).length === 0 ? (
          <div className={styles.emptyTasks}>
            No tasks available. Create some tasks in Smart Plan first!
          </div>
        ) : (
          Object.entries(groupedTasks).map(([date, dateTasks]) => (
            <div key={date} className={styles.taskDateGroup}>
              <div className={styles.taskDateHeader}>
                {formatDateHeader(date)}
              </div>
              {dateTasks.map(task => (
                <div 
                  key={task._id} 
                  className={`${styles.taskItem} ${isSelected(task._id) ? styles.selected : ''}`}
                  onClick={() => onTaskToggle(task)}
                >
                  <div className={styles.taskCheckbox}>
                    <input
                      type="checkbox"
                      checked={isSelected(task._id)}
                      onChange={() => onTaskToggle(task)}
                    />
                  </div>
                  <div className={styles.taskContent}>
                    <div className={styles.taskTitle}>{task.title}</div>
                    {task.description && (
                      <div className={styles.taskDescription}>{task.description}</div>
                    )}
                    <div className={styles.taskMeta}>
                      {task.isImportant && <span className={styles.importantTag}>⭐ Important</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {selectedTasks.length > 0 && (
        <div className={styles.selectedInfo}>
          {selectedTasks.length} task{selectedTasks.length > 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  );
};

const DateTimeDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className={styles.dateTimeDisplay}>
      <div className={styles.dateText}>{formatDate(currentTime)}</div>
      <div className={styles.timeText}>{formatTime(currentTime)}</div>
    </div>
  );
};

const Pomodoro = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (!authService.isAuthenticated()) {
        window.location.href = '/';
        return;
      }
      try {
        const [u, t] = await Promise.all([
          authService.getUserProfile(),
          taskService.getUserTasks(),
        ]);
        setUser(u);
        setTasks(t);
      } catch (e) {
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleTaskToggle = (task) => {
    setSelectedTasks(prev => {
      const isSelected = prev.some(t => t._id === task._id);
      if (isSelected) {
        return prev.filter(t => t._id !== task._id);
      } else {
        return [...prev, task];
      }
    });
  };

  const handleTaskComplete = (taskId) => {
    setTasks(prev => prev.map(t => 
      t._id === taskId ? { ...t, status: 'Completed' } : t
    ));
    setSelectedTasks(prev => prev.filter(t => t._id !== taskId));
  };

  const handleSessionComplete = (sessionData) => {
    console.log('Session completed:', sessionData);
    // Here you could update UI or show notifications
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading your focus space...</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <DashboardNavbar 
        user={user} 
        activeRoute={'pomodoro'} 
        onNavigate={(id) => {
          if (id === 'home') {
            window.location.href = '/dashboard';
          } else if (id === 'smart_plan') {
            window.location.href = '/smart-plan';
          }
        }} 
        onLogout={() => { 
          authService.logout(); 
          window.location.href = '/'; 
        }} 
      />

      <DateTimeDisplay />

      <div className={styles.content}>
        <div className={styles.leftPanel}>
          <PomodoroTimer
            selectedTasks={selectedTasks}
            onSessionComplete={handleSessionComplete}
            onTaskComplete={handleTaskComplete}
          />
        </div>

        <div className={styles.rightPanel}>
          <TaskSelector
            tasks={tasks}
            selectedTasks={selectedTasks}
            onTaskToggle={handleTaskToggle}
            onTaskComplete={handleTaskComplete}
          />
        </div>
      </div>
      
      <ChatBot />
    </div>
  );
};

export default Pomodoro;
