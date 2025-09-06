// crud-operations-test.js
// Comprehensive CRUD operations testing for all models
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const BASE_URL = process.env.SERVER_URL || 'http://localhost:8080';
const API_URL = `${BASE_URL}/api`;

// Test data
const testUser = {
  username: 'crudtestuser',
  email: 'crudtest@example.com',
  password: 'testpass123'
};

let authToken = '';
let userId = '';
let createdIds = {
  task: '',
  skill: '',
  challenge: '',
  pomodoro: '',
  moodLog: '',
  skillProgress: ''
};

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

// Setup authentication
async function setupAuth() {
  logInfo('Setting up authentication...');
  
  // Try to register, if user exists, login
  let result = await makeRequest('POST', '/users/register', testUser);
  
  if (result.success) {
    authToken = result.data.token;
    userId = result.data.userId;
    logSuccess('User registered successfully');
  } else if (result.error.message?.includes('already exists')) {
    // Try login
    result = await makeRequest('POST', '/users/login', {
      email: testUser.email,
      password: testUser.password
    });
    
    if (result.success) {
      authToken = result.data.token;
      userId = result.data.userId;
      logSuccess('User login successful');
    } else {
      logError('Authentication setup failed');
      return false;
    }
  } else {
    logError('Authentication setup failed');
    return false;
  }
  
  return true;
}

// Test CRUD operations for Tasks
async function testTaskCRUD() {
  logInfo('📝 Testing Task CRUD Operations...');
  
  const headers = { 'Authorization': `Bearer ${authToken}` };
  
  // CREATE
  const taskData = {
    userId: userId,
    title: 'CRUD Test Task',
    description: 'Testing CRUD operations',
    priority: 'High',
    category: 'Testing',
    estimatedTime: 45
  };
  
  let result = await makeRequest('POST', '/tasks', taskData, headers);
  if (!result.success) {
    logError(`Task creation failed: ${JSON.stringify(result.error)}`);
    return false;
  }
  
  createdIds.task = result.data.task._id;
  logSuccess(`Task created: ${createdIds.task}`);
  
  // READ
  result = await makeRequest('GET', `/tasks/user/${userId}`, null, headers);
  if (!result.success) {
    logError(`Task retrieval failed: ${JSON.stringify(result.error)}`);
    return false;
  }
  
  const taskFound = result.data.find(task => task._id === createdIds.task);
  if (!taskFound) {
    logError('Created task not found in user tasks');
    return false;
  }
  logSuccess('Task retrieved successfully');
  
  // UPDATE
  const updateData = { status: 'In Progress', actualTime: 30 };
  result = await makeRequest('PUT', `/tasks/${createdIds.task}`, updateData, headers);
  if (!result.success) {
    logError(`Task update failed: ${JSON.stringify(result.error)}`);
    return false;
  }
  logSuccess('Task updated successfully');
  
  // DELETE
  result = await makeRequest('DELETE', `/tasks/${createdIds.task}`, null, headers);
  if (!result.success) {
    logError(`Task deletion failed: ${JSON.stringify(result.error)}`);
    return false;
  }
  logSuccess('Task deleted successfully');
  
  return true;
}

// Test CRUD operations for Skills
async function testSkillCRUD() {
  logInfo('🎯 Testing Skill CRUD Operations...');
  
  const headers = { 'Authorization': `Bearer ${authToken}` };
  
  // CREATE
  const skillData = {
    userId: userId,
    name: 'CRUD Test Skill',
    description: 'Testing CRUD operations for skills',
    category: 'Testing',
    subTopic: 'CRUD Operations',
    level: 'Intermediate'
  };
  
  let result = await makeRequest('POST', '/skills', skillData, headers);
  if (!result.success) {
    logError(`Skill creation failed: ${JSON.stringify(result.error)}`);
    return false;
  }
  
  createdIds.skill = result.data.skill._id;
  logSuccess(`Skill created: ${createdIds.skill}`);
  
  // READ
  result = await makeRequest('GET', `/skills/user/${userId}`, null, headers);
  if (!result.success) {
    logError(`Skill retrieval failed: ${JSON.stringify(result.error)}`);
    return false;
  }
  
  const skillFound = result.data.skills.find(skill => skill._id === createdIds.skill);
  if (!skillFound) {
    logError('Created skill not found in user skills');
    return false;
  }
  logSuccess('Skill retrieved successfully');
  
  // UPDATE
  const updateData = { progress: 75, level: 'Advanced' };
  result = await makeRequest('PUT', `/skills/${createdIds.skill}`, updateData, headers);
  if (!result.success) {
    logError(`Skill update failed: ${JSON.stringify(result.error)}`);
    return false;
  }
  logSuccess('Skill updated successfully');
  
  // DELETE
  result = await makeRequest('DELETE', `/skills/${createdIds.skill}`, null, headers);
  if (!result.success) {
    logError(`Skill deletion failed: ${JSON.stringify(result.error)}`);
    return false;
  }
  logSuccess('Skill deleted successfully');
  
  return true;
}

// Test CRUD operations for Challenges
async function testChallengeCRUD() {
  logInfo('🏆 Testing Challenge CRUD Operations...');
  
  const headers = { 'Authorization': `Bearer ${authToken}` };
  
  // CREATE
  const challengeData = {
    title: 'CRUD Test Challenge',
    description: 'Testing CRUD operations for challenges',
    difficulty: 'Medium',
    tags: ['testing', 'crud'],
    validFor: 48
  };
  
  let result = await makeRequest('POST', '/challenges', challengeData, headers);
  if (!result.success) {
    logError(`Challenge creation failed: ${JSON.stringify(result.error)}`);
    return false;
  }
  
  createdIds.challenge = result.data.challenge._id;
  logSuccess(`Challenge created: ${createdIds.challenge}`);
  
  // READ
  result = await makeRequest('GET', '/challenges', null, headers);
  if (!result.success) {
    logError(`Challenge retrieval failed: ${JSON.stringify(result.error)}`);
    return false;
  }
  
  const challengeFound = result.data.challenges.find(challenge => challenge._id === createdIds.challenge);
  if (!challengeFound) {
    logError('Created challenge not found');
    return false;
  }
  logSuccess('Challenge retrieved successfully');
  
  // UPDATE
  const updateData = { difficulty: 'Hard', validFor: 72 };
  result = await makeRequest('PUT', `/challenges/${createdIds.challenge}`, updateData, headers);
  if (!result.success) {
    logError(`Challenge update failed: ${JSON.stringify(result.error)}`);
    return false;
  }
  logSuccess('Challenge updated successfully');
  
  // DELETE
  result = await makeRequest('DELETE', `/challenges/${createdIds.challenge}`, null, headers);
  if (!result.success) {
    logError(`Challenge deletion failed: ${JSON.stringify(result.error)}`);
    return false;
  }
  logSuccess('Challenge deleted successfully');
  
  return true;
}

// Main test runner
async function runCRUDTests() {
  log('\n🚀 Starting CRUD Operations Tests\n', colors.bold);
  
  // Setup authentication first
  const authSetup = await setupAuth();
  if (!authSetup) {
    logError('Authentication setup failed. Cannot proceed with CRUD tests.');
    return;
  }
  
  const tests = [
    { name: 'Task CRUD', fn: testTaskCRUD },
    { name: 'Skill CRUD', fn: testSkillCRUD },
    { name: 'Challenge CRUD', fn: testChallengeCRUD }
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
  log('CRUD OPERATIONS TEST SUMMARY', colors.bold);
  log('='.repeat(50), colors.blue);
  logSuccess(`Passed: ${passed}`);
  if (failed > 0) {
    logError(`Failed: ${failed}`);
  }
  log(`Total: ${passed + failed}`, colors.blue);
  
  if (failed === 0) {
    logSuccess('\n🎉 All CRUD tests passed!');
  } else {
    logError('\n💥 Some CRUD tests failed!');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runCRUDTests().catch(console.error);
}

module.exports = {
  runCRUDTests,
  testTaskCRUD,
  testSkillCRUD,
  testChallengeCRUD
};
