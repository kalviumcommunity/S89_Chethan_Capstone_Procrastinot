// src/components/TaskCalendar.jsx
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus } from 'lucide-react';
import clsx from 'clsx';

export default function TaskCalendar({ 
  tasks = [], 
  onDateSelect, 
  onTaskClick,
  selectedDate = new Date(),
  className = '' 
}) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get calendar data
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();
  
  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Get previous month's last days to fill the grid
  const prevMonth = new Date(year, month - 1, 0);
  const daysFromPrevMonth = startingDayOfWeek;

  // Generate calendar days
  const calendarDays = [];

  // Previous month days
  for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
    const day = prevMonth.getDate() - i;
    calendarDays.push({
      day,
      date: new Date(year, month - 1, day),
      isCurrentMonth: false,
      isPrevMonth: true,
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      date: new Date(year, month, day),
      isCurrentMonth: true,
      isPrevMonth: false,
    });
  }

  // Next month days to complete the grid (42 days total - 6 weeks)
  const remainingDays = 42 - calendarDays.length;
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push({
      day,
      date: new Date(year, month + 1, day),
      isCurrentMonth: false,
      isPrevMonth: false,
    });
  }

  // Get tasks for a specific date
  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  // Navigation functions
  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={clsx('card-glass p-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Calendar size={24} />
            {monthNames[month]} {year}
          </h2>
          <motion.button
            onClick={goToToday}
            className="btn-glass px-3 py-1 text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Today
          </motion.button>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            onClick={goToPrevMonth}
            className="p-2 text-white/60 hover:text-white/80 hover:bg-white/10 rounded-lg transition-all duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={20} />
          </motion.button>
          <motion.button
            onClick={goToNextMonth}
            className="p-2 text-white/60 hover:text-white/80 hover:bg-white/10 rounded-lg transition-all duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight size={20} />
          </motion.button>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="p-2 text-center text-white/60 text-sm font-medium">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((calendarDay, index) => {
          const dayTasks = getTasksForDate(calendarDay.date);
          const isToday = calendarDay.date.toDateString() === today.toDateString();
          const isSelected = calendarDay.date.toDateString() === selectedDate.toDateString();
          const hasOverdue = dayTasks.some(task => 
            new Date(task.dueDate) < today && task.status !== 'Completed'
          );
          const hasImportant = dayTasks.some(task => task.isImportant);

          return (
            <motion.div
              key={index}
              className={clsx(
                'relative p-2 min-h-[60px] cursor-pointer rounded-lg transition-all duration-200 group',
                calendarDay.isCurrentMonth
                  ? 'text-white hover:bg-white/10'
                  : 'text-white/40 hover:bg-white/5',
                isToday && 'bg-primary-500/20 border border-primary-500/50',
                isSelected && 'bg-secondary-500/20 border border-secondary-500/50',
                hasOverdue && 'border-l-2 border-red-500'
              )}
              onClick={() => onDateSelect(calendarDay.date)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Day Number */}
              <div className={clsx(
                'text-sm font-medium mb-1',
                isToday && 'text-primary-300',
                isSelected && 'text-secondary-300'
              )}>
                {calendarDay.day}
              </div>

              {/* Task Indicators */}
              {dayTasks.length > 0 && (
                <div className="space-y-1">
                  {dayTasks.slice(0, 2).map((task, taskIndex) => (
                    <motion.div
                      key={task._id}
                      className={clsx(
                        'text-xs px-1 py-0.5 rounded truncate cursor-pointer',
                        task.status === 'Completed' 
                          ? 'bg-green-500/20 text-green-300'
                          : task.isImportant
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : task.priority === 'Urgent'
                          ? 'bg-red-500/20 text-red-300'
                          : task.priority === 'High'
                          ? 'bg-orange-500/20 text-orange-300'
                          : 'bg-blue-500/20 text-blue-300'
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTaskClick(task);
                      }}
                      whileHover={{ scale: 1.05 }}
                      title={task.title}
                    >
                      {task.title}
                    </motion.div>
                  ))}
                  
                  {dayTasks.length > 2 && (
                    <div className="text-xs text-white/60 px-1">
                      +{dayTasks.length - 2} more
                    </div>
                  )}
                </div>
              )}

              {/* Add Task Button (on hover) */}
              {calendarDay.isCurrentMonth && (
                <motion.button
                  className="absolute top-1 right-1 p-1 text-white/40 hover:text-white/80 hover:bg-white/10 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDateSelect(calendarDay.date, true); // true indicates "add task"
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus size={12} />
                </motion.button>
              )}

              {/* Important/Overdue Indicators */}
              <div className="absolute bottom-1 right-1 flex gap-1">
                {hasImportant && (
                  <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                )}
                {hasOverdue && (
                  <div className="w-2 h-2 bg-red-400 rounded-full" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex flex-wrap gap-4 text-xs text-white/60">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary-500/20 border border-primary-500/50 rounded" />
            <span>Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full" />
            <span>Important</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-400 rounded-full" />
            <span>Overdue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500/20 rounded" />
            <span>Completed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
