// src/hooks/useTasks.js
import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';

export const useTasks = (userId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    isImportant: false,
    search: '',
    dateRange: null,
  });

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getUserTasks(userId);
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Create task
  const createTask = async (taskData) => {
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks(prev => [newTask.task, ...prev]);
      return newTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Update task
  const updateTask = async (taskId, taskData) => {
    try {
      const updatedTask = await taskService.updateTask(taskId, taskData);
      setTasks(prev => 
        prev.map(task => 
          task._id === taskId ? { ...task, ...updatedTask } : task
        )
      );
      return updatedTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task._id !== taskId));
      console.log('🗑️ Task deleted successfully');
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Complete task
  const completeTask = async (taskId) => {
    try {
      const updatedTask = await taskService.completeTask(taskId);
      setTasks(prev =>
        prev.map(task =>
          task._id === taskId
            ? { ...task, status: 'Completed', completedAt: new Date() }
            : task
        )
      );
      console.log('✅ Task completed successfully');
      return updatedTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Toggle importance
  const toggleImportance = async (taskId, currentImportance) => {
    try {
      const updatedTask = await taskService.toggleImportance(taskId, currentImportance);
      setTasks(prev => 
        prev.map(task => 
          task._id === taskId 
            ? { ...task, isImportant: !currentImportance }
            : task
        )
      );
      return updatedTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    // Hide completed tasks unless specifically filtering for them
    if (task.status === 'Completed' && filters.status !== 'Completed') {
      return false;
    }

    // Hide deleted tasks (if they have a deleted flag)
    if (task.isDeleted) {
      return false;
    }

    // Status filter
    if (filters.status !== 'all' && task.status !== filters.status) {
      return false;
    }

    // Priority filter
    if (filters.priority !== 'all' && task.priority !== filters.priority) {
      return false;
    }

    // Category filter
    if (filters.category !== 'all' && task.category !== filters.category) {
      return false;
    }

    // Important filter
    if (filters.isImportant && !task.isImportant) {
      return false;
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const titleMatch = task.title.toLowerCase().includes(searchLower);
      const descMatch = task.description?.toLowerCase().includes(searchLower);
      const tagMatch = task.tags?.some(tag =>
        tag.toLowerCase().includes(searchLower)
      );

      if (!titleMatch && !descMatch && !tagMatch) {
        return false;
      }
    }

    // Date range filter
    if (filters.dateRange) {
      const taskDate = new Date(task.dueDate);
      const { start, end } = filters.dateRange;
      if (taskDate < start || taskDate > end) {
        return false;
      }
    }

    return true;
  });

  // Group tasks
  const groupedTasks = {
    today: filteredTasks.filter(task => {
      if (!task.dueDate) return false;
      const today = new Date();
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === today.toDateString();
    }),
    upcoming: filteredTasks.filter(task => {
      if (!task.dueDate) return false;
      const today = new Date();
      const taskDate = new Date(task.dueDate);
      return taskDate > today;
    }),
    overdue: filteredTasks.filter(task => {
      if (!task.dueDate || task.status === 'Completed') return false;
      const today = new Date();
      const taskDate = new Date(task.dueDate);
      return taskDate < today;
    }),
    completed: filteredTasks.filter(task => task.status === 'Completed'),
    noDueDate: filteredTasks.filter(task => !task.dueDate),
  };

  // Get task statistics
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    pending: tasks.filter(t => t.status === 'Pending').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    important: tasks.filter(t => t.isImportant).length,
    overdue: groupedTasks.overdue.length,
  };

  // Load tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks: filteredTasks,
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
    refetch: fetchTasks,
  };
};
