// Simple test script to verify task functionality
// This can be run in the browser console to test the task service

import { taskService } from './services/taskService.js';

// Test data
const testTask = {
  userId: '507f1f77bcf86cd799439011',
  title: 'Test Task',
  description: 'This is a test task to verify functionality',
  priority: 'High',
  category: 'Testing',
  dueDate: new Date().toISOString(),
  estimatedTime: 60,
  isImportant: true,
  tags: ['test', 'demo'],
  recurrence: {
    type: 'none',
    interval: 1,
  },
};

// Test functions
export const testTaskService = async () => {
  console.log('🧪 Testing Task Service...');
  
  try {
    // Test creating a task
    console.log('📝 Creating test task...');
    const createdTask = await taskService.createTask(testTask);
    console.log('✅ Task created:', createdTask);
    
    // Test fetching tasks
    console.log('📋 Fetching user tasks...');
    const tasks = await taskService.getUserTasks(testTask.userId);
    console.log('✅ Tasks fetched:', tasks);
    
    // Test updating task
    if (createdTask.task && createdTask.task._id) {
      console.log('✏️ Updating task...');
      const updatedTask = await taskService.updateTask(createdTask.task._id, {
        title: 'Updated Test Task',
        status: 'In Progress'
      });
      console.log('✅ Task updated:', updatedTask);
      
      // Test completing task
      console.log('✔️ Completing task...');
      const completedTask = await taskService.completeTask(createdTask.task._id);
      console.log('✅ Task completed:', completedTask);
      
      // Test deleting task
      console.log('🗑️ Deleting task...');
      await taskService.deleteTask(createdTask.task._id);
      console.log('✅ Task deleted');
    }
    
    console.log('🎉 All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Export for use in console
window.testTaskService = testTaskService;

console.log('🔧 Task service test loaded. Run testTaskService() in console to test.');
