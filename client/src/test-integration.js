// Test script to verify frontend-backend integration
// Run this in the browser console after logging in

import { taskService } from './services/taskService.js';
import { userService } from './services/userService.js';

// Test user authentication and profile
export const testUserProfile = async () => {
  console.log('🧪 Testing User Profile...');
  
  try {
    const user = await userService.getCurrentUser();
    console.log('✅ User profile fetched:', user);
    
    const stats = await userService.getUserStats(user._id);
    console.log('✅ User stats fetched:', stats);
    
    return { user, stats };
  } catch (error) {
    console.error('❌ User profile test failed:', error);
    throw error;
  }
};

// Test task CRUD operations
export const testTaskOperations = async () => {
  console.log('🧪 Testing Task Operations...');
  
  try {
    // Get current user
    const user = await userService.getCurrentUser();
    console.log('✅ User authenticated:', user.username);
    
    // Test 1: Create a task
    console.log('📝 Creating test task...');
    const testTask = {
      userId: user._id,
      title: 'Integration Test Task',
      description: 'This is a test task to verify frontend-backend integration',
      priority: 'High',
      category: 'Testing',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      estimatedTime: 60,
      isImportant: true,
      tags: ['test', 'integration'],
    };
    
    const createdTask = await taskService.createTask(testTask);
    console.log('✅ Task created:', createdTask);
    
    // Test 2: Get user tasks
    console.log('📋 Fetching user tasks...');
    const userTasks = await taskService.getUserTasks(user._id);
    console.log('✅ User tasks fetched:', userTasks.length, 'tasks');
    
    // Test 3: Update the task
    console.log('✏️ Updating test task...');
    const updatedTask = await taskService.updateTask(createdTask.task._id, {
      title: 'Updated Integration Test Task',
      status: 'In Progress',
    });
    console.log('✅ Task updated:', updatedTask);
    
    // Test 4: Complete the task
    console.log('✅ Completing test task...');
    const completedTask = await taskService.completeTask(createdTask.task._id);
    console.log('✅ Task completed:', completedTask);
    
    // Test 5: Toggle importance
    console.log('⭐ Toggling task importance...');
    const toggledTask = await taskService.toggleImportance(createdTask.task._id, true);
    console.log('✅ Task importance toggled:', toggledTask);
    
    // Test 6: Delete the task
    console.log('🗑️ Deleting test task...');
    const deleteResult = await taskService.deleteTask(createdTask.task._id);
    console.log('✅ Task deleted:', deleteResult);
    
    console.log('🎉 All task operations completed successfully!');
    
    return {
      created: createdTask,
      updated: updatedTask,
      completed: completedTask,
      toggled: toggledTask,
      deleted: deleteResult,
    };
    
  } catch (error) {
    console.error('❌ Task operations test failed:', error);
    throw error;
  }
};

// Test authentication flow
export const testAuthentication = async () => {
  console.log('🧪 Testing Authentication...');
  
  try {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) {
      throw new Error('No authentication data found. Please log in first.');
    }
    
    console.log('✅ Token found:', token.substring(0, 20) + '...');
    console.log('✅ User ID found:', userId);
    
    // Test API call with authentication
    const user = await userService.getCurrentUser();
    console.log('✅ Authenticated API call successful:', user.username);
    
    return { token, userId, user };
    
  } catch (error) {
    console.error('❌ Authentication test failed:', error);
    throw error;
  }
};

// Run all tests
export const runAllTests = async () => {
  console.log('🚀 Starting Integration Tests...');
  console.log('=====================================');
  
  try {
    // Test 1: Authentication
    const authResult = await testAuthentication();
    console.log('✅ Authentication test passed');
    
    // Test 2: User Profile
    const profileResult = await testUserProfile();
    console.log('✅ User profile test passed');
    
    // Test 3: Task Operations
    const taskResult = await testTaskOperations();
    console.log('✅ Task operations test passed');
    
    console.log('=====================================');
    console.log('🎉 All integration tests passed!');
    
    return {
      auth: authResult,
      profile: profileResult,
      tasks: taskResult,
    };
    
  } catch (error) {
    console.error('=====================================');
    console.error('❌ Integration tests failed:', error);
    console.error('=====================================');
    throw error;
  }
};

// Instructions for running tests
console.log(`
🧪 Integration Test Suite Ready!

To run tests:
1. Make sure you're logged in to the application
2. Open browser console
3. Run one of these commands:

// Test everything
runAllTests()

// Test individual components
testAuthentication()
testUserProfile()
testTaskOperations()

// Import functions if needed
import { runAllTests, testTaskOperations, testUserProfile, testAuthentication } from './test-integration.js'
`);

// Quick diagnostic function
export const quickDiagnostic = () => {
  console.log('🔍 Quick Diagnostic Check');
  console.log('========================');

  // Check authentication
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  console.log('🔐 Authentication Status:');
  console.log('  Token exists:', !!token);
  console.log('  User ID exists:', !!userId);

  if (token) {
    console.log('  Token preview:', token.substring(0, 20) + '...');
  }

  // Check API endpoints
  console.log('🌐 API Configuration:');
  console.log('  Backend URL: http://localhost:8080');
  console.log('  Frontend URL: http://localhost:5173');

  // Check current page
  console.log('📍 Current Location:');
  console.log('  URL:', window.location.href);
  console.log('  Path:', window.location.pathname);

  console.log('========================');
  console.log('✅ Diagnostic complete. Run runAllTests() to test functionality.');
};

// Make functions available globally for console testing
if (typeof window !== 'undefined') {
  window.testIntegration = {
    runAllTests,
    testTaskOperations,
    testUserProfile,
    testAuthentication,
    quickDiagnostic,
  };

  // Auto-run diagnostic
  console.log('🧪 Integration Test Suite Loaded!');
  console.log('Run: window.testIntegration.quickDiagnostic()');
}
