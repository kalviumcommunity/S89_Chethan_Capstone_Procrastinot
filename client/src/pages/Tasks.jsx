// src/pages/Tasks.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Calendar, 
  List, 
  Grid3X3, 
  BarChart3,
  CheckCircle,
  Clock,
  Star,
  AlertTriangle
} from 'lucide-react';
import Navbar from '../components/Navbar1';
import Footer from '../components/Footer';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import TaskFilters from '../components/TaskFilters';
import TaskCalendar from '../components/TaskCalendar';
import { useTasks } from '../hooks/useTasks';
import clsx from 'clsx';

export default function Tasks() {
  const [currentUser] = useState({ _id: '507f1f77bcf86cd799439011' }); // Mock user ID
  const [view, setView] = useState('list'); // 'list', 'calendar', 'grid'
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formLoading, setFormLoading] = useState(false);

  const {
    tasks,
    groupedTasks,
    stats,
    loading,
    error,
    filters,
    setFilters,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    toggleImportance,
    refetch
  } = useTasks(currentUser._id);

  // Handle task form submission
  const handleTaskSubmit = async (taskData) => {
    try {
      setFormLoading(true);
      if (editingTask) {
        await updateTask(editingTask._id, taskData);
      } else {
        await createTask(taskData);
      }
      setShowTaskForm(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  // Handle task completion
  const handleCompleteTask = async (taskId) => {
    try {
      await completeTask(taskId);
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  // Handle importance toggle
  const handleToggleImportance = async (taskId, currentImportance) => {
    try {
      await toggleImportance(taskId, currentImportance);
    } catch (error) {
      console.error('Error toggling importance:', error);
    }
  };

  // Handle calendar date selection
  const handleDateSelect = (date, addTask = false) => {
    setSelectedDate(date);
    if (addTask) {
      setEditingTask(null);
      setShowTaskForm(true);
    }
  };

  // Handle task editing
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  // View toggle buttons
  const viewButtons = [
    { key: 'list', icon: List, label: 'List' },
    { key: 'grid', icon: Grid3X3, label: 'Grid' },
    { key: 'calendar', icon: Calendar, label: 'Calendar' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-mesh text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900/50 via-primary-900/30 to-secondary-900/50" />
        <div className="relative z-10">
          <Navbar />
          <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                <p className="text-white/60">Loading tasks...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900/50 via-primary-900/30 to-secondary-900/50" />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />

        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Task
              <span className="text-gradient block mt-2">Management</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Organize, prioritize, and track your tasks with our intuitive management system
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {[
              { label: 'Total Tasks', value: stats.total, icon: BarChart3, color: 'text-blue-400' },
              { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-green-400' },
              { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'text-orange-400' },
              { label: 'Important', value: stats.important, icon: Star, color: 'text-yellow-400' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="card-glass p-4 text-center group hover:scale-105 transition-transform duration-200"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 mb-2 group-hover:scale-110 transition-transform duration-200`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-8"
          >
            {/* View Toggle */}
            <div className="flex items-center gap-2">
              {viewButtons.map((button) => (
                <motion.button
                  key={button.key}
                  onClick={() => setView(button.key)}
                  className={clsx(
                    'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200',
                    view === button.key
                      ? 'bg-primary-500/20 text-primary-300 border border-primary-500/50'
                      : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button.icon size={16} />
                  {button.label}
                </motion.button>
              ))}
            </div>

            {/* Add Task Button */}
            <motion.button
              onClick={() => {
                setEditingTask(null);
                setShowTaskForm(true);
              }}
              className="btn-primary flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={20} />
              Add New Task
            </motion.button>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-8"
          >
            <TaskFilters
              filters={filters}
              onFiltersChange={setFilters}
              stats={stats}
            />
          </motion.div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {view === 'calendar' ? (
              <TaskCalendar
                tasks={tasks}
                onDateSelect={handleDateSelect}
                onTaskClick={handleEditTask}
                selectedDate={selectedDate}
              />
            ) : (
              <div className={clsx(
                'grid gap-4',
                view === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              )}>
                <AnimatePresence mode="popLayout">
                  {tasks.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="col-span-full text-center py-12"
                    >
                      <div className="card-glass p-8">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle size={32} className="text-white/40" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No tasks found</h3>
                        <p className="text-white/60 mb-6">
                          {filters.search || filters.status !== 'all' || filters.priority !== 'all'
                            ? 'Try adjusting your filters or search terms'
                            : 'Create your first task to get started'
                          }
                        </p>
                        <motion.button
                          onClick={() => {
                            setEditingTask(null);
                            setShowTaskForm(true);
                          }}
                          className="btn-primary"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Plus size={16} className="mr-2" />
                          Add Your First Task
                        </motion.button>
                      </div>
                    </motion.div>
                  ) : (
                    tasks.map((task, index) => (
                      <motion.div
                        key={task._id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <TaskCard
                          task={task}
                          onComplete={handleCompleteTask}
                          onToggleImportance={handleToggleImportance}
                          onEdit={handleEditTask}
                          onDelete={handleDeleteTask}
                        />
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>

        <Footer />
      </div>

      {/* Task Form Modal */}
      <TaskForm
        isOpen={showTaskForm}
        onClose={() => {
          setShowTaskForm(false);
          setEditingTask(null);
        }}
        onSubmit={handleTaskSubmit}
        task={editingTask}
        loading={formLoading}
      />
    </div>
  );
}
