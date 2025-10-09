import authService from './authService';

// Duplicate base URL to avoid coupling to authService internals
const API_BASE_URL = '/api';

const withAuthHeaders = () => authService.getAuthHeaders();

const taskService = {
  // Fetch tasks for the authenticated user
  async getUserTasks() {
    const userId = authService.userId;
    if (!userId) return [];
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/user/${userId}`, {
        headers: withAuthHeaders()
      });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  // Create a new task
  async createTask(task) {
    try {
      const payload = {
        userId: authService.userId,
        title: task.title,
        description: task.description || '',
        status: task.status || 'Pending',
        priority: task.priority || 'Medium',
        isImportant: !!task.isImportant,
        dueDate: task.dueDate || undefined,
        recurrence: task.recurrence || { type: 'none', interval: 1 },
        category: task.category || 'General',
        tags: task.tags || [],
        estimatedTime: task.estimatedTime || 30,
        relatedSkills: task.relatedSkills || [],
        challenge: task.challenge || undefined,
        moodBefore: task.moodBefore || undefined,
        pomodoroCount: task.pomodoroCount || 0,
        aiBreakdown: task.aiBreakdown || [],
        attachmentUrl: task.attachmentUrl || undefined,
        importantLinks: task.importantLinks || [],
      };

      const res = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: withAuthHeaders(),
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create task');
      return data.task || data;
    } catch (e) {
      throw e;
    }
  },

  // Update a task by id
  async updateTask(id, updates) {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: withAuthHeaders(),
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || 'Failed to update task');
    return data;
  },

  // Delete a task by id
  async deleteTask(id) {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: withAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || 'Failed to delete task');
    return data;
  }
};

export default taskService;
