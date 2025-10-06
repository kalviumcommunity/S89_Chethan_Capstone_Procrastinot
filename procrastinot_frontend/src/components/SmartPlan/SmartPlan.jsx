import { useEffect, useMemo, useState } from 'react';
import DashboardNavbar from '../Dashboard/DashboardNavbar';
import styles from './SmartPlan.module.css';
import taskService from '../../services/taskService';
import authService from '../../services/authService';

const SubNav = ({ active, onChange }) => {
  const items = [
    { id: 'my_day', label: 'My Day' },
    { id: 'important', label: 'Important' },
    { id: 'tasks', label: 'All Tasks' },
  ];
  return (
    <div className={styles.subnav}>
      {items.map((i) => (
        <button
          key={i.id}
          className={`${styles.subnavItem} ${active === i.id ? styles.active : ''}`}
          onClick={() => onChange(i.id)}
        >
          {i.label}
        </button>
      ))}
    </div>
  );
};

const TaskForm = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isImportant, setIsImportant] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const payload = { title: title.trim(), description, isImportant };
    if (dueDate) payload.dueDate = new Date(dueDate).toISOString();
    const created = await onAdd(payload);
    if (created) {
      setTitle('');
      setDescription('');
      setDueDate('');
      setIsImportant(false);
    }
  };

  return (
    <form className={`${styles.card} ${styles.form}`} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className={styles.input}
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className={styles.row}>
        <label className={styles.label}>Due</label>
        <input
          className={styles.input}
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={isImportant}
            onChange={(e) => setIsImportant(e.target.checked)}
          />
          Mark important
        </label>
        <button type="submit" className={`btn btn-primary ${styles.addBtn}`}>Add</button>
      </div>
    </form>
  );
};

const TaskItem = ({ task, onToggleImportant, onToggleComplete, onDelete }) => {
  const completed = task.status === 'Completed';
  return (
    <div className={`${styles.taskItem} ${styles.card}`}>
      <div className={styles.taskLeft}>
        <input
          type="checkbox"
          checked={completed}
          onChange={() => onToggleComplete(task)}
        />
        <div>
          <div className={`${styles.taskTitle} ${completed ? styles.completed : ''}`}>{task.title}</div>
          {task.dueDate && (
            <div className={styles.taskMeta}>Due {new Date(task.dueDate).toLocaleDateString()}</div>
          )}
        </div>
      </div>
      <div className={styles.taskActions}>
        <button
          className={`${styles.iconBtn} ${task.isImportant ? styles.important : ''}`}
          title="Toggle important"
          onClick={() => onToggleImportant(task)}
        >
          ★
        </button>
        <button className={styles.iconBtn} title="Delete" onClick={() => onDelete(task)}>🗑</button>
      </div>
    </div>
  );
};

const CalendarGrid = ({ tasks, currentMonth, onSelectDate }) => {
  // currentMonth is a Date pointing to any day within the month to show
  const start = useMemo(() => new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1), [currentMonth]);
  const end = useMemo(() => new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0), [currentMonth]);

  const days = [];
  const firstWeekday = start.getDay(); // 0 Sun - 6 Sat
  const totalDays = end.getDate();

  for (let i = 0; i < firstWeekday; i++) days.push(null);
  for (let d = 1; d <= totalDays; d++) days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d));

  const tasksByDate = tasks.reduce((acc, t) => {
    if (!t.dueDate) return acc;
    const key = new Date(t.dueDate).toDateString();
    acc[key] = acc[key] || [];
    acc[key].push(t);
    return acc;
  }, {});

  return (
    <div className={styles.calendarGrid}>
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
        <div key={d} className={`${styles.calendarCell} ${styles.calendarHead}`}>{d}</div>
      ))}
      {days.map((day, idx) => {
        const key = day ? day.toDateString() : '';
        const dayTasks = key ? (tasksByDate[key] || []) : [];
        return (
          <div
            key={idx}
            className={styles.calendarCell}
            onClick={() => {
              if (day && dayTasks.length && onSelectDate) onSelectDate(day, dayTasks);
            }}
            role="button"
            style={{ cursor: day && dayTasks.length ? 'pointer' : 'default' }}
          >
            {day && (
              <div className={styles.calendarDay}>
                <div className={styles.calendarDate}>{day.getDate()}</div>
                <div className={styles.calendarTasks}>
                  {dayTasks.slice(0, 3).map((t) => (
                    <div key={t._id} className={styles.calendarTask}>
                      <span className={styles.bullet}>•</span> {t.title}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const SmartPlan = () => {
  const [activeTab, setActiveTab] = useState('my_day');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [month, setMonth] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [modalDate, setModalDate] = useState(null);
  const [modalTasks, setModalTasks] = useState([]);

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
        // fall back
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleSelectDate = (date, dayTasks) => {
    setModalDate(date);
    setModalTasks(dayTasks);
    setShowModal(true);
  };

  const handleAddTask = async (payload) => {
    try {
      const created = await taskService.createTask(payload);
      setTasks((prev) => [created, ...prev]);
      return created;
    } catch (e) {
      alert(e.message || 'Failed to add task');
      return null;
    }
  };

  const handleToggleImportant = async (task) => {
    try {
      const updated = await taskService.updateTask(task._id, { isImportant: !task.isImportant });
      setTasks((prev) => prev.map((t) => (t._id === task._id ? updated : t)));
    } catch (e) {
      alert(e.message || 'Failed to update task');
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
      const updated = await taskService.updateTask(task._id, { status: nextStatus, completedAt: nextStatus === 'Completed' ? new Date().toISOString() : null });
      setTasks((prev) => prev.map((t) => (t._id === task._id ? updated : t)));
    } catch (e) {
      alert(e.message || 'Failed to update task');
    }
  };

  const handleDelete = async (task) => {
    try {
      await taskService.deleteTask(task._id);
      setTasks((prev) => prev.filter((t) => t._id !== task._id));
    } catch (e) {
      alert(e.message || 'Failed to delete task');
    }
  };

  const todayKey = new Date().toDateString();

  const filteredTasks = useMemo(() => {
    if (activeTab === 'important') return tasks.filter((t) => t.isImportant);
        if (activeTab === 'my_day') return tasks.filter((t) => t.dueDate && new Date(t.dueDate).toDateString() === todayKey);
    return tasks;
  }, [activeTab, tasks, todayKey]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>Loading...</div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <DashboardNavbar user={user} activeRoute={'smart_plan'} onNavigate={(id) => {
        if (id === 'home') {
          window.location.href = '/dashboard';
        }
      }} onLogout={() => { authService.logout(); window.location.href = '/'; }} />

      <div className={styles.header}>Smart Plan</div>
      <SubNav active={activeTab} onChange={setActiveTab} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: 'var(--spacing-md)',
        alignItems: 'start',
        width: 'min(100%, 1200px)',
        margin: '0 auto var(--spacing-2xl)'
      }}>
        <div>
          <TaskForm onAdd={handleAddTask} />

          <div className={styles.list}>
            {filteredTasks.length === 0 ? (
              <div className={styles.empty}>No tasks yet.</div>
            ) : (
              filteredTasks.map((t) => (
                <TaskItem
                  key={t._id}
                  task={t}
                  onToggleImportant={handleToggleImportant}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </div>

        <aside className={styles.calendarSection} style={{ position: 'sticky', top: 'calc(var(--dashboard-navbar-height) + var(--spacing-lg))' }}>
          <div className={styles.calendarControls}>
            <button className="btn btn-ghost" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>Prev</button>
            <div className={styles.monthTitle}>
              {month.toLocaleString(undefined, { month: 'long', year: 'numeric' })}
            </div>
            <button className="btn btn-ghost" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>Next</button>
          </div>
          <CalendarGrid tasks={tasks} currentMonth={month} onSelectDate={handleSelectDate} />
        </aside>
      </div>

      {showModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowModal(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
          }}
        >
          <div
            className={`${styles.card}`}
            style={{ width: 'min(90%, 700px)', maxHeight: '80vh', overflow: 'auto', position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-sm)' }}>
              <div className="heading-md">{modalDate?.toLocaleDateString()}</div>
              <button className={styles.iconBtn} onClick={() => setShowModal(false)}>✕</button>
            </div>
            {modalTasks.map((t) => (
              <TaskItem
                key={t._id}
                task={t}
                onToggleImportant={handleToggleImportant}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartPlan;
