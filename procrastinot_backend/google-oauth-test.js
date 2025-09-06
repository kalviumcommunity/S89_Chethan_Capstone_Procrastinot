// google-oauth-test.js
// Google OAuth testing for Procrastinot Backend
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const BASE_URL = process.env.SERVER_URL || 'http://localhost:8080';
const API_URL = `${BASE_URL}/api`;

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

// Test Google OAuth configuration
async function testGoogleOAuthConfig() {
  logInfo('🔐 Testing Google OAuth Configuration...');
  
  try {
    // Test if Google OAuth route is accessible
    const response = await axios.get(`${API_URL}/users/google`, {
      maxRedirects: 0,
      validateStatus: function (status) {
        return status >= 200 && status < 400; // Accept redirects
      }
    });
    
    if (response.status === 302) {
      logSuccess('Google OAuth route is accessible and redirecting properly');
      logInfo(`Redirect URL: ${response.headers.location}`);
      
      // Check if the redirect URL contains Google OAuth parameters
      const redirectUrl = response.headers.location;
      if (redirectUrl && redirectUrl.includes('accounts.google.com')) {
        logSuccess('Redirect URL points to Google OAuth');
        
        // Check for required OAuth parameters
        const url = new URL(redirectUrl);
        const clientId = url.searchParams.get('client_id');
        const scope = url.searchParams.get('scope');
        const responseType = url.searchParams.get('response_type');
        
        if (clientId) {
          logSuccess(`Client ID found: ${clientId.substring(0, 20)}...`);
        } else {
          logError('Client ID not found in OAuth URL');
          return false;
        }
        
        if (scope && scope.includes('profile') && scope.includes('email')) {
          logSuccess('Required scopes (profile, email) are present');
        } else {
          logError('Required scopes missing');
          return false;
        }
        
        if (responseType === 'code') {
          logSuccess('Response type is correctly set to "code"');
        } else {
          logError('Response type is not set to "code"');
          return false;
        }
        
      } else {
        logError('Redirect URL does not point to Google OAuth');
        return false;
      }
    } else {
      logError(`Unexpected response status: ${response.status}`);
      return false;
    }
    
    return true;
  } catch (error) {
    logError(`Google OAuth configuration test failed: ${error.message}`);
    return false;
  }
}

// Test Google OAuth callback endpoint
async function testGoogleOAuthCallback() {
  logInfo('🔄 Testing Google OAuth Callback...');
  
  try {
    // Test callback endpoint without parameters (should fail gracefully)
    const response = await axios.get(`${API_URL}/users/google/callback`, {
      validateStatus: function (status) {
        return status >= 200 && status < 500; // Accept various status codes
      }
    });
    
    // The callback should redirect to login on failure
    if (response.status === 302 && response.headers.location) {
      logSuccess('Callback endpoint handles missing parameters correctly');
      logInfo(`Redirect on failure: ${response.headers.location}`);
    } else if (response.status === 401) {
      logSuccess('Callback endpoint returns 401 for missing parameters');
    } else {
      logWarning(`Callback returned status: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    logError(`Google OAuth callback test failed: ${error.message}`);
    return false;
  }
}

// Test Google login endpoint (frontend integration)
async function testGoogleLoginEndpoint() {
  logInfo('📱 Testing Google Login Endpoint (Frontend Integration)...');
  
  try {
    // Test with missing parameters
    let response = await axios.post(`${API_URL}/users/google-login`, {}, {
      validateStatus: function (status) {
        return status >= 200 && status < 500;
      }
    });
    
    if (response.status === 400) {
      logSuccess('Google login endpoint properly validates required fields');
      logInfo(`Error message: ${response.data.message}`);
    } else {
      logError(`Expected 400 status, got: ${response.status}`);
      return false;
    }
    
    // Test with invalid data
    response = await axios.post(`${API_URL}/users/google-login`, {
      email: 'invalid-email',
      googleId: 'test-google-id'
    }, {
      validateStatus: function (status) {
        return status >= 200 && status < 500;
      }
    });
    
    if (response.status === 400) {
      logSuccess('Google login endpoint validates email format');
    } else {
      logWarning(`Email validation response: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    logError(`Google login endpoint test failed: ${error.message}`);
    return false;
  }
}

// Test environment variables
async function testEnvironmentVariables() {
  logInfo('🌍 Testing Environment Variables...');
  
  const requiredVars = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_REDIRECT_URI',
    'JWT_SECRET',
    'MONGO_URI',
    'CLIENT_URL'
  ];
  
  let allPresent = true;
  
  for (const varName of requiredVars) {
    if (process.env[varName]) {
      logSuccess(`${varName}: Present`);
      
      // Additional validation for specific variables
      if (varName === 'GOOGLE_CLIENT_ID' && process.env[varName].length < 50) {
        logWarning(`${varName} seems too short`);
      }
      
      if (varName === 'JWT_SECRET' && process.env[varName].length < 32) {
        logWarning(`${varName} should be at least 32 characters`);
      }
      
      if (varName === 'MONGO_URI' && !process.env[varName].includes('mongodb')) {
        logError(`${varName} doesn't appear to be a valid MongoDB URI`);
        allPresent = false;
      }
      
    } else {
      logError(`${varName}: Missing`);
      allPresent = false;
    }
  }
  
  return allPresent;
}

// Main test runner for Google OAuth
async function runGoogleOAuthTests() {
  log('\n🚀 Starting Google OAuth Tests\n', colors.bold);
  
  const tests = [
    { name: 'Environment Variables', fn: testEnvironmentVariables },
    { name: 'Google OAuth Configuration', fn: testGoogleOAuthConfig },
    { name: 'Google OAuth Callback', fn: testGoogleOAuthCallback },
    { name: 'Google Login Endpoint', fn: testGoogleLoginEndpoint }
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
  log('GOOGLE OAUTH TEST SUMMARY', colors.bold);
  log('='.repeat(50), colors.blue);
  logSuccess(`Passed: ${passed}`);
  if (failed > 0) {
    logError(`Failed: ${failed}`);
  }
  log(`Total: ${passed + failed}`, colors.blue);
  
  if (failed === 0) {
    logSuccess('\n🎉 All Google OAuth tests passed!');
  } else {
    logError('\n💥 Some Google OAuth tests failed!');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runGoogleOAuthTests().catch(console.error);
}

module.exports = {
  runGoogleOAuthTests,
  testGoogleOAuthConfig,
  testGoogleOAuthCallback,
  testGoogleLoginEndpoint,
  testEnvironmentVariables
};
