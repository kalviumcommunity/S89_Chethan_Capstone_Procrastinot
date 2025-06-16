// src/components/TaskCard.jsx
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Star, 
  CheckCircle2, 
  Circle, 
  MoreVertical,
  Edit3,
  Trash2,
  Flag,
  Tag,
  Timer
} from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

export default function TaskCard({ 
  task, 
  onComplete, 
  onToggleImportance, 
  onEdit, 
  onDelete,
  className = '' 
}) {
  const [showMenu, setShowMenu] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return 'text-red-400 bg-red-500/20';
      case 'High': return 'text-orange-400 bg-orange-500/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'Low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-green-400 bg-green-500/20';
      case 'In Progress': return 'text-blue-400 bg-blue-500/20';
      case 'Revise Again': return 'text-purple-400 bg-purple-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed';
  const isToday = task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString();

  const formatDate = (date) => {
    if (!date) return null;
    const taskDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (taskDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (taskDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return taskDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: taskDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      className={clsx(
        'card-glass p-4 group relative',
        task.status === 'Completed' && 'opacity-75',
        isOverdue && 'border-l-4 border-red-500',
        isToday && 'border-l-4 border-blue-500',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          {/* Complete Button */}
          <motion.button
            onClick={() => onComplete(task._id)}
            className={clsx(
              'flex-shrink-0 transition-colors duration-200',
              task.status === 'Completed' 
                ? 'text-green-400 hover:text-green-300' 
                : 'text-white/40 hover:text-green-400'
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {task.status === 'Completed' ? (
              <CheckCircle2 size={20} />
            ) : (
              <Circle size={20} />
            )}
          </motion.button>

          {/* Title */}
          <h3 className={clsx(
            'font-semibold text-white flex-1',
            task.status === 'Completed' && 'line-through text-white/60'
          )}>
            {task.title}
          </h3>

          {/* Important Star */}
          <motion.button
            onClick={() => onToggleImportance(task._id, task.isImportant)}
            className={clsx(
              'flex-shrink-0 transition-colors duration-200',
              task.isImportant 
                ? 'text-yellow-400 hover:text-yellow-300' 
                : 'text-white/30 hover:text-yellow-400'
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Star size={16} fill={task.isImportant ? 'currentColor' : 'none'} />
          </motion.button>
        </div>

        {/* Menu */}
        <div className="relative">
          <motion.button
            onClick={() => setShowMenu(!showMenu)}
            className="text-white/40 hover:text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            whileHover={{ scale: 1.1 }}
          >
            <MoreVertical size={16} />
          </motion.button>

          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-0 top-8 glass rounded-lg py-2 min-w-[120px] z-10"
            >
              <button
                onClick={() => {
                  onEdit(task);
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-white/80 hover:text-white hover:bg-white/10 flex items-center gap-2 text-sm"
              >
                <Edit3 size={14} />
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete(task._id);
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-2 text-sm"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-white/70 text-sm mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-white/10 text-white/80 text-xs rounded-full"
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="text-white/60 text-xs">+{task.tags.length - 3} more</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          {/* Priority */}
          <span className={clsx(
            'inline-flex items-center gap-1 px-2 py-1 rounded-full',
            getPriorityColor(task.priority)
          )}>
            <Flag size={10} />
            {task.priority}
          </span>

          {/* Status */}
          <span className={clsx(
            'inline-flex items-center gap-1 px-2 py-1 rounded-full',
            getStatusColor(task.status)
          )}>
            {task.status}
          </span>

          {/* Category */}
          {task.category && task.category !== 'General' && (
            <span className="text-white/60">
              {task.category}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-white/60">
          {/* Estimated Time */}
          {task.estimatedTime && (
            <div className="flex items-center gap-1">
              <Timer size={12} />
              <span>{task.estimatedTime}m</span>
            </div>
          )}

          {/* Due Date */}
          {task.dueDate && (
            <div className={clsx(
              'flex items-center gap-1',
              isOverdue && 'text-red-400',
              isToday && 'text-blue-400'
            )}>
              <Calendar size={12} />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}

          {/* Pomodoro Count */}
          {task.pomodoroCount > 0 && (
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{task.pomodoroCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowMenu(false)}
        />
      )}
    </motion.div>
  );
}
