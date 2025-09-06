// comprehensive-test.js
// Comprehensive testing suite for Procrastinot Backend
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const BASE_URL = process.env.SERVER_URL || 'http://localhost:8080';
const API_URL = `${BASE_URL}/api`;

// Test data
const testUser = {
  username: 'testuser123',
  email: 'testuser@example.com',
  password: 'testpass123'
};

const testUser2 = {
  username: 'testuser456',
  email: 'testuser2@example.com', 
  password: 'testpass456'
};

let authToken = '';
let userId = '';
let taskId = '';
let skillId = '';
let challengeId = '';
let pomodoroId = '';
let moodLogId = '';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

// Test helper function
async function makeRequest(method, url, data = null, headers = {}) {
  try {
    const config = {
      method,
      url: `${API_URL}${url}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message, 
      status: error.response?.status 
    };
  }
}

// 1. Server Health Check
async function testServerHealth() {
  logInfo('🏥 Testing Server Health...');

  // Test the root health endpoint (not under /api)
  try {
    const response = await axios.get(BASE_URL);
    logSuccess('Server is running and responding');
    logInfo(`Response: ${JSON.stringify(response.data)}`);
    return true;
  } catch (error) {
    logError('Server health check failed');
    logError(`Error: ${error.response?.data || error.message}`);
    return false;
  }
}

// 2. Authentication Tests
async function testAuthentication() {
  logInfo('🔐 Testing Authentication System...');
  
  // Test user registration
  logInfo('Testing user registration...');
  let result = await makeRequest('POST', '/users/register', testUser);
  
  if (result.success) {
    logSuccess('User registration successful');
    authToken = result.data.token;
    userId = result.data.userId;
    logInfo(`Token: ${authToken ? 'Received' : 'Missing'}`);
    logInfo(`User ID: ${userId}`);
  } else if (result.error.message?.includes('already exists')) {
    logWarning('User already exists, trying login...');
    
    // Try login instead
    result = await makeRequest('POST', '/users/login', {
      email: testUser.email,
      password: testUser.password
    });
    
    if (result.success) {
      logSuccess('User login successful');
      authToken = result.data.token;
      userId = result.data.userId;
    } else {
      logError('Both registration and login failed');
      return false;
    }
  } else {
    logError(`Registration failed: ${JSON.stringify(result.error)}`);
    return false;
  }
  
  // Test protected route access
  logInfo('Testing protected route access...');
  result = await makeRequest('GET', '/users', null, {
    'Authorization': `Bearer ${authToken}`
  });
  
  if (result.success) {
    logSuccess('Protected route accessible with valid token');
  } else {
    logError(`Protected route access failed: ${JSON.stringify(result.error)}`);
    return false;
  }
  
  // Test invalid token
  logInfo('Testing invalid token handling...');
  result = await makeRequest('GET', '/users', null, {
    'Authorization': 'Bearer invalid-token'
  });
  
  if (!result.success && result.status === 401) {
    logSuccess('Invalid token properly rejected');
  } else {
    logError('Invalid token was not properly rejected');
    return false;
  }
  
  return true;
}

// 3. User Profile Tests
async function testUserProfile() {
  logInfo('👤 Testing User Profile Operations...');
  
  // Get user profile
  const result = await makeRequest('GET', `/users/profile/${userId}`, null, {
    'Authorization': `Bearer ${authToken}`
  });
  
  if (result.success) {
    logSuccess('User profile retrieved successfully');
    logInfo(`Username: ${result.data.user.username}`);
    logInfo(`Email: ${result.data.user.email}`);
  } else {
    logError(`Failed to get user profile: ${JSON.stringify(result.error)}`);
    return false;
  }
  
  return true;
}

// 4. Task Management Tests
async function testTaskManagement() {
  logInfo('📝 Testing Task Management...');

  // Create a task
  logInfo('Creating a new task...');
  const taskData = {
    userId: userId,
    title: 'Test Task',
    description: 'This is a test task',
    priority: 'High',
    isImportant: true,
    category: 'Testing',
    tags: ['test', 'automation'],
    estimatedTime: 60,
    status: 'Pending'
  };

  let result = await makeRequest('POST', '/tasks', taskData, {
    'Authorization': `Bearer ${authToken}`
  });

  if (result.success) {
    logSuccess('Task created successfully');
    taskId = result.data.task._id;
    logInfo(`Task ID: ${taskId}`);
  } else {
    logError(`Failed to create task: ${JSON.stringify(result.error)}`);
    return false;
  }

  // Get user tasks
  logInfo('Retrieving user tasks...');
  result = await makeRequest('GET', `/tasks/user/${userId}`, null, {
    'Authorization': `Bearer ${authToken}`
  });

  if (result.success) {
    logSuccess(`Retrieved ${result.data.length} tasks`);
  } else {
    logError(`Failed to get tasks: ${JSON.stringify(result.error)}`);
    return false;
  }

  // Update task
  logInfo('Updating task...');
  result = await makeRequest('PUT', `/tasks/${taskId}`, {
    status: 'In Progress',
    actualTime: 30
  }, {
    'Authorization': `Bearer ${authToken}`
  });

  if (result.success) {
    logSuccess('Task updated successfully');
  } else {
    logError(`Failed to update task: ${JSON.stringify(result.error)}`);
    return false;
  }

  return true;
}

// 5. Skills Management Tests
async function testSkillsManagement() {
  logInfo('🎯 Testing Skills Management...');

  // Create a skill
  logInfo('Creating a new skill...');
  const skillData = {
    userId: userId,
    name: 'JavaScript Programming', // Required by the model
    description: 'Learning JavaScript fundamentals',
    category: 'Programming',
    subTopic: 'JavaScript Fundamentals', // Required by the route
    level: 'Beginner',
    content: 'Variables, functions, objects, arrays'
  };

  let result = await makeRequest('POST', '/skills', skillData, {
    'Authorization': `Bearer ${authToken}`
  });

  if (result.success) {
    logSuccess('Skill created successfully');
    skillId = result.data.skill._id;
    logInfo(`Skill ID: ${skillId}`);
  } else {
    logError(`Failed to create skill: ${JSON.stringify(result.error)}`);
    return false;
  }

  // Get user skills
  logInfo('Retrieving user skills...');
  result = await makeRequest('GET', `/skills/user/${userId}`, null, {
    'Authorization': `Bearer ${authToken}`
  });

  if (result.success) {
    logSuccess(`Retrieved ${result.data.length} skills`);
  } else {
    logError(`Failed to get skills: ${JSON.stringify(result.error)}`);
    return false;
  }

  return true;
}

// 6. Pomodoro Session Tests
async function testPomodoroSessions() {
  logInfo('🍅 Testing Pomodoro Sessions...');

  // Create a pomodoro session
  logInfo('Creating a new pomodoro session...');
  const pomodoroData = {
    userId: userId,
    duration: 25,
    status: 'Completed',
    taskId: taskId,
    moodBefore: 'Neutral',
    moodAfter: 'Happy',
    notes: 'Productive session'
  };

  let result = await makeRequest('POST', '/pomodoro', pomodoroData, {
    'Authorization': `Bearer ${authToken}`
  });

  if (result.success) {
    logSuccess('Pomodoro session created successfully');
    pomodoroId = result.data.session._id;
    logInfo(`Pomodoro ID: ${pomodoroId}`);
  } else {
    logError(`Failed to create pomodoro session: ${JSON.stringify(result.error)}`);
    return false;
  }

  // Get user pomodoro sessions
  logInfo('Retrieving user pomodoro sessions...');
  result = await makeRequest('GET', `/pomodoro/user/${userId}`, null, {
    'Authorization': `Bearer ${authToken}`
  });

  if (result.success) {
    logSuccess(`Retrieved ${result.data.length} pomodoro sessions`);
  } else {
    logError(`Failed to get pomodoro sessions: ${JSON.stringify(result.error)}`);
    return false;
  }

  return true;
}

// 7. Mood Logging Tests
async function testMoodLogging() {
  logInfo('😊 Testing Mood Logging...');

  // Create a mood log
  logInfo('Creating a new mood log...');
  const moodData = {
    userId: userId,
    moodType: 'Happy',
    note: 'Feeling productive after completing tasks',
    sessionType: 'After Pomodoro'
  };

  let result = await makeRequest('POST', '/moods', moodData, {
    'Authorization': `Bearer ${authToken}`
  });

  if (result.success) {
    logSuccess('Mood log created successfully');
    moodLogId = result.data.moodLog._id;
    logInfo(`Mood Log ID: ${moodLogId}`);
  } else {
    logError(`Failed to create mood log: ${JSON.stringify(result.error)}`);
    return false;
  }

  // Get user mood logs
  logInfo('Retrieving user mood logs...');
  result = await makeRequest('GET', `/moods/user/${userId}`, null, {
    'Authorization': `Bearer ${authToken}`
  });

  if (result.success) {
    logSuccess(`Retrieved ${result.data.length} mood logs`);
  } else {
    logError(`Failed to get mood logs: ${JSON.stringify(result.error)}`);
    return false;
  }

  return true;
}

// Main test runner
async function runAllTests() {
  log('\n🚀 Starting Comprehensive Backend Tests\n', colors.bold);

  const tests = [
    { name: 'Server Health', fn: testServerHealth },
    { name: 'Authentication', fn: testAuthentication },
    { name: 'User Profile', fn: testUserProfile },
    { name: 'Task Management', fn: testTaskManagement },
    { name: 'Skills Management', fn: testSkillsManagement },
    { name: 'Pomodoro Sessions', fn: testPomodoroSessions },
    { name: 'Mood Logging', fn: testMoodLogging }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    log(`\n${'='.repeat(50)}`, colors.blue);
    log(`Testing: ${test.name}`, colors.bold);
    log('='.repeat(50), colors.blue);

    try {
      const success = await test.fn();
      if (success) {
        passed++;
        logSuccess(`${test.name} tests passed`);
      } else {
        failed++;
        logError(`${test.name} tests failed`);
      }
    } catch (error) {
      failed++;
      logError(`${test.name} tests crashed: ${error.message}`);
    }
  }

  log('\n' + '='.repeat(50), colors.blue);
  log('TEST SUMMARY', colors.bold);
  log('='.repeat(50), colors.blue);
  logSuccess(`Passed: ${passed}`);
  if (failed > 0) {
    logError(`Failed: ${failed}`);
  }
  log(`Total: ${passed + failed}`, colors.blue);

  if (failed === 0) {
    logSuccess('\n🎉 All tests passed!');
  } else {
    logError('\n💥 Some tests failed!');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  runAllTests,
  testServerHealth,
  testAuthentication,
  testUserProfile,
  testTaskManagement,
  testSkillsManagement,
  testPomodoroSessions,
  testMoodLogging
};
