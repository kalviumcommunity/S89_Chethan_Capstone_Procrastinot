# 🔌 TASK API EXAMPLES & INTEGRATION GUIDE

## 📋 Complete API Examples for Frontend Integration

### 1. CREATE TASK
```javascript
// Frontend API Call
const createTask = async (taskData) => {
  const response = await fetch('http://localhost:8080/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify(taskData)
  });
  return response.json();
};

// Example Request Body
const newTask = {
  userId: "64a7b8c9d1e2f3g4h5i6j7k8",
  title: "Complete React Dashboard",
  description: "Build the main dashboard with task widgets and analytics",
  status: "Pending",
  priority: "High",
  isImportant: true,
  dueDate: "2024-02-15T10:00:00Z",
  category: "Development",
  tags: ["react", "dashboard", "frontend"],
  estimatedTime: 180,
  relatedSkills: ["64a7b8c9d1e2f3g4h5i6j7k9"],
  moodBefore: "Neutral"
};

// Example Response
{
  "message": "Task created successfully",
  "task": {
    "_id": "64a7b8c9d1e2f3g4h5i6j7k0",
    "userId": "64a7b8c9d1e2f3g4h5i6j7k8",
    "title": "Complete React Dashboard",
    "description": "Build the main dashboard with task widgets and analytics",
    "status": "Pending",
    "priority": "High",
    "isImportant": true,
    "dueDate": "2024-02-15T10:00:00.000Z",
    "category": "Development",
    "tags": ["react", "dashboard", "frontend"],
    "estimatedTime": 180,
    "actualTime": 0,
    "pomodoroCount": 0,
    "relatedSkills": ["64a7b8c9d1e2f3g4h5i6j7k9"],
    "moodBefore": "Neutral",
    "createdAt": "2024-01-20T08:30:00.000Z",
    "updatedAt": "2024-01-20T08:30:00.000Z"
  }
}
```

### 2. GET USER TASKS
```javascript
// Frontend API Call
const getUserTasks = async (userId) => {
  const response = await fetch(`http://localhost:8080/api/tasks/user/${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${userToken}`
    }
  });
  return response.json();
};

// Example Response (Array of populated tasks)
[
  {
    "_id": "64a7b8c9d1e2f3g4h5i6j7k0",
    "userId": "64a7b8c9d1e2f3g4h5i6j7k8",
    "title": "Complete React Dashboard",
    "description": "Build the main dashboard with task widgets and analytics",
    "status": "In Progress",
    "priority": "High",
    "isImportant": true,
    "dueDate": "2024-02-15T10:00:00.000Z",
    "category": "Development",
    "tags": ["react", "dashboard", "frontend"],
    "estimatedTime": 180,
    "actualTime": 45,
    "pomodoroCount": 2,
    "moodBefore": "Neutral",
    "relatedSkills": [
      {
        "_id": "64a7b8c9d1e2f3g4h5i6j7k9",
        "name": "React Development",
        "category": "Programming",
        "progress": 75
      }
    ],
    "challenge": null,
    "pomodoroSessions": [
      {
        "_id": "64a7b8c9d1e2f3g4h5i6j7k1",
        "duration": 25,
        "status": "Completed",
        "startTime": "2024-01-20T09:00:00.000Z"
      }
    ],
    "createdAt": "2024-01-20T08:30:00.000Z",
    "updatedAt": "2024-01-20T09:30:00.000Z"
  }
]
```

### 3. UPDATE TASK
```javascript
// Frontend API Call
const updateTask = async (taskId, updateData) => {
  const response = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify(updateData)
  });
  return response.json();
};

// Example Update (Mark as completed)
const updateData = {
  status: "Completed",
  actualTime: 165,
  moodAfter: "Happy",
  completedAt: new Date().toISOString()
};

// Example Response
{
  "_id": "64a7b8c9d1e2f3g4h5i6j7k0",
  "userId": "64a7b8c9d1e2f3g4h5i6j7k8",
  "title": "Complete React Dashboard",
  "status": "Completed",
  "priority": "High",
  "actualTime": 165,
  "moodAfter": "Happy",
  "completedAt": "2024-01-20T12:15:00.000Z",
  "updatedAt": "2024-01-20T12:15:00.000Z"
}
```

### 4. DELETE TASK
```javascript
// Frontend API Call
const deleteTask = async (taskId) => {
  const response = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${userToken}`
    }
  });
  return response.json();
};

// Example Response
{
  "message": "Task deleted successfully",
  "taskId": "64a7b8c9d1e2f3g4h5i6j7k0"
}
```

---

## 🎯 FRONTEND INTEGRATION PATTERNS

### 1. React Hook for Task Management
```javascript
// useTaskManager.js
import { useState, useEffect } from 'react';

const useTaskManager = (userId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await getUserTasks(userId);
      setTasks(response);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      const response = await createTask(taskData);
      setTasks(prev => [...prev, response.task]);
      return response.task;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateTask = async (taskId, updateData) => {
    try {
      const response = await updateTask(taskId, updateData);
      setTasks(prev => prev.map(task => 
        task._id === taskId ? response : task
      ));
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(prev => prev.filter(task => task._id !== taskId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks: fetchTasks
  };
};
```

### 2. Task Filtering & Sorting Utilities
```javascript
// taskUtils.js
export const filterTasks = (tasks, filters) => {
  return tasks.filter(task => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.isImportant !== undefined && task.isImportant !== filters.isImportant) return false;
    if (filters.category && task.category !== filters.category) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesTitle = task.title.toLowerCase().includes(searchLower);
      const matchesDescription = task.description?.toLowerCase().includes(searchLower);
      const matchesTags = task.tags.some(tag => tag.toLowerCase().includes(searchLower));
      if (!matchesTitle && !matchesDescription && !matchesTags) return false;
    }
    if (filters.dateRange) {
      const taskDate = new Date(task.dueDate);
      if (taskDate < filters.dateRange.start || taskDate > filters.dateRange.end) return false;
    }
    return true;
  });
};

export const sortTasks = (tasks, sortBy, sortOrder = 'asc') => {
  return [...tasks].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // Handle special cases
    if (sortBy === 'dueDate') {
      aValue = aValue ? new Date(aValue) : new Date('9999-12-31');
      bValue = bValue ? new Date(bValue) : new Date('9999-12-31');
    }

    if (sortBy === 'priority') {
      const priorityOrder = { 'Low': 1, 'Medium': 2, 'High': 3, 'Urgent': 4 };
      aValue = priorityOrder[aValue];
      bValue = priorityOrder[bValue];
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
};

export const groupTasksByCategory = (tasks) => {
  return tasks.reduce((groups, task) => {
    const category = task.category || 'Uncategorized';
    if (!groups[category]) groups[category] = [];
    groups[category].push(task);
    return groups;
  }, {});
};

export const getTaskStatistics = (tasks) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'Completed').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const pending = tasks.filter(t => t.status === 'Pending').length;
  const overdue = tasks.filter(t => 
    t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed'
  ).length;

  return {
    total,
    completed,
    inProgress,
    pending,
    overdue,
    completionRate: total > 0 ? (completed / total * 100).toFixed(1) : 0
  };
};
```

### 3. Task Component Examples
```javascript
// TaskCard.jsx
import React from 'react';

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const getPriorityColor = (priority) => {
    const colors = {
      'Low': 'green',
      'Medium': 'yellow',
      'High': 'orange',
      'Urgent': 'red'
    };
    return colors[priority] || 'gray';
  };

  const handleStatusChange = (newStatus) => {
    onUpdate(task._id, { status: newStatus });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed';

  return (
    <div className={`task-card ${task.status.toLowerCase().replace(' ', '-')}`}>
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        {task.isImportant && <span className="important-flag">⭐</span>}
        <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
      </div>
      
      <p className="task-description">{task.description}</p>
      
      <div className="task-meta">
        <span className="category">{task.category}</span>
        {task.dueDate && (
          <span className={`due-date ${isOverdue ? 'overdue' : ''}`}>
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
      
      <div className="task-progress">
        <span>Time: {task.actualTime}/{task.estimatedTime} min</span>
        <span>Pomodoros: {task.pomodoroCount}</span>
      </div>
      
      <div className="task-tags">
        {task.tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
      
      <div className="task-actions">
        <select 
          value={task.status} 
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Revise Again">Revise Again</option>
        </select>
        <button onClick={() => onDelete(task._id)}>Delete</button>
      </div>
    </div>
  );
};

export default TaskCard;
```

---

## 🔄 REAL-TIME UPDATES

### 1. WebSocket Integration
```javascript
// websocketService.js
class TaskWebSocketService {
  constructor(userId, token) {
    this.userId = userId;
    this.token = token;
    this.ws = null;
    this.listeners = new Map();
  }

  connect() {
    this.ws = new WebSocket(`ws://localhost:8080/ws?token=${this.token}`);
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'TASK_UPDATE') {
        this.notifyListeners('taskUpdate', data.payload);
      }
    };
  }

  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  notifyListeners(event, data) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => callback(data));
  }

  sendTaskUpdate(taskId, updateData) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'TASK_UPDATE',
        taskId,
        updateData
      }));
    }
  }
}
```

### 2. Optimistic Updates
```javascript
// optimisticTaskUpdates.js
export const useOptimisticTaskUpdates = () => {
  const [tasks, setTasks] = useState([]);
  const [pendingUpdates, setPendingUpdates] = useState(new Map());

  const optimisticUpdate = async (taskId, updateData, apiCall) => {
    // Immediately update UI
    setTasks(prev => prev.map(task => 
      task._id === taskId ? { ...task, ...updateData } : task
    ));

    // Track pending update
    setPendingUpdates(prev => new Map(prev).set(taskId, updateData));

    try {
      // Make API call
      const result = await apiCall();
      
      // Update with server response
      setTasks(prev => prev.map(task => 
        task._id === taskId ? result : task
      ));
      
      // Remove from pending
      setPendingUpdates(prev => {
        const newMap = new Map(prev);
        newMap.delete(taskId);
        return newMap;
      });

      return result;
    } catch (error) {
      // Revert optimistic update on error
      setTasks(prev => prev.map(task => {
        if (task._id === taskId) {
          const pendingUpdate = pendingUpdates.get(taskId);
          const revertedTask = { ...task };
          Object.keys(pendingUpdate).forEach(key => {
            delete revertedTask[key];
          });
          return revertedTask;
        }
        return task;
      }));

      setPendingUpdates(prev => {
        const newMap = new Map(prev);
        newMap.delete(taskId);
        return newMap;
      });

      throw error;
    }
  };

  return { tasks, setTasks, optimisticUpdate, pendingUpdates };
};
```

---

## 📊 ANALYTICS INTEGRATION

### 1. Task Analytics Hook
```javascript
// useTaskAnalytics.js
export const useTaskAnalytics = (tasks) => {
  const analytics = useMemo(() => {
    const completedTasks = tasks.filter(t => t.status === 'Completed');
    const totalEstimatedTime = tasks.reduce((sum, t) => sum + t.estimatedTime, 0);
    const totalActualTime = completedTasks.reduce((sum, t) => sum + t.actualTime, 0);

    return {
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      completionRate: tasks.length > 0 ? (completedTasks.length / tasks.length * 100) : 0,
      timeAccuracy: totalEstimatedTime > 0 ? (totalEstimatedTime / totalActualTime * 100) : 0,
      averageCompletionTime: completedTasks.length > 0 ? (totalActualTime / completedTasks.length) : 0,
      productivityScore: calculateProductivityScore(tasks),
      categoryDistribution: getCategoryDistribution(tasks),
      priorityDistribution: getPriorityDistribution(tasks),
      moodCorrelation: getMoodCorrelation(completedTasks)
    };
  }, [tasks]);

  return analytics;
};

const calculateProductivityScore = (tasks) => {
  const weights = {
    completion: 0.4,
    timeAccuracy: 0.3,
    consistency: 0.3
  };

  const completionScore = tasks.length > 0 ? 
    (tasks.filter(t => t.status === 'Completed').length / tasks.length * 100) : 0;
  
  const timeAccuracyScore = calculateTimeAccuracy(tasks);
  const consistencyScore = calculateConsistency(tasks);

  return (
    completionScore * weights.completion +
    timeAccuracyScore * weights.timeAccuracy +
    consistencyScore * weights.consistency
  );
};
```

---

## 🎨 UI STATE MANAGEMENT

### 1. Redux/Zustand Store Example
```javascript
// taskStore.js (Zustand)
import { create } from 'zustand';

const useTaskStore = create((set, get) => ({
  tasks: [],
  filters: {
    status: null,
    priority: null,
    category: null,
    search: '',
    isImportant: null
  },
  sortBy: 'dueDate',
  sortOrder: 'asc',
  loading: false,
  error: null,

  // Actions
  setTasks: (tasks) => set({ tasks }),
  
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, task]
  })),
  
  updateTask: (taskId, updateData) => set((state) => ({
    tasks: state.tasks.map(task => 
      task._id === taskId ? { ...task, ...updateData } : task
    )
  })),
  
  removeTask: (taskId) => set((state) => ({
    tasks: state.tasks.filter(task => task._id !== taskId)
  })),
  
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),
  
  setSorting: (sortBy, sortOrder) => set({ sortBy, sortOrder }),
  
  getFilteredTasks: () => {
    const { tasks, filters, sortBy, sortOrder } = get();
    let filtered = filterTasks(tasks, filters);
    return sortTasks(filtered, sortBy, sortOrder);
  }
}));
```

---

## 🔧 ERROR HANDLING

### 1. Comprehensive Error Handling
```javascript
// errorHandler.js
export const handleTaskError = (error, context) => {
  console.error(`Task ${context} error:`, error);
  
  const errorMessages = {
    400: 'Invalid task data provided',
    401: 'You need to be logged in to perform this action',
    403: 'You don\'t have permission to modify this task',
    404: 'Task not found',
    500: 'Server error occurred. Please try again later.'
  };

  const message = errorMessages[error.status] || 'An unexpected error occurred';
  
  // Show user-friendly error message
  showNotification({
    type: 'error',
    message,
    duration: 5000
  });

  return {
    success: false,
    message,
    error
  };
};

// Usage in components
const handleCreateTask = async (taskData) => {
  try {
    setLoading(true);
    const result = await createTask(taskData);
    showNotification({
      type: 'success',
      message: 'Task created successfully!'
    });
    return result;
  } catch (error) {
    return handleTaskError(error, 'creation');
  } finally {
    setLoading(false);
  }
};
```

This comprehensive API documentation provides everything needed to build a powerful frontend that leverages all the capabilities of your robust backend task management system.