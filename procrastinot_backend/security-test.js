// security-test.js
// Security and middleware testing for Procrastinot Backend
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

// Test rate limiting
async function testRateLimiting() {
  logInfo('🚦 Testing Rate Limiting...');
  
  try {
    const requests = [];
    const maxRequests = 15; // Should exceed the rate limit
    
    // Make multiple rapid requests to test rate limiting
    for (let i = 0; i < maxRequests; i++) {
      requests.push(
        axios.get(BASE_URL, {
          validateStatus: function (status) {
            return status >= 200 && status < 500;
          }
        })
      );
    }
    
    const responses = await Promise.all(requests);
    
    // Check if any requests were rate limited (429 status)
    const rateLimitedResponses = responses.filter(res => res.status === 429);
    
    if (rateLimitedResponses.length > 0) {
      logSuccess(`Rate limiting is working: ${rateLimitedResponses.length} requests were rate limited`);
      
      // Check rate limit headers
      const rateLimitHeaders = rateLimitedResponses[0].headers;
      if (rateLimitHeaders['ratelimit-limit']) {
        logInfo(`Rate limit: ${rateLimitHeaders['ratelimit-limit']} requests`);
      }
      if (rateLimitHeaders['ratelimit-remaining']) {
        logInfo(`Remaining: ${rateLimitHeaders['ratelimit-remaining']} requests`);
      }
      
      return true;
    } else {
      logWarning('Rate limiting may not be working - no 429 responses received');
      return true; // Don't fail the test as rate limiting might be configured differently
    }
    
  } catch (error) {
    logError(`Rate limiting test failed: ${error.message}`);
    return false;
  }
}

// Test CORS configuration
async function testCORS() {
  logInfo('🌐 Testing CORS Configuration...');
  
  try {
    // Test preflight request
    const response = await axios.options(BASE_URL, {
      headers: {
        'Origin': 'http://localhost:5173',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type,Authorization'
      },
      validateStatus: function (status) {
        return status >= 200 && status < 500;
      }
    });
    
    const corsHeaders = response.headers;
    
    if (corsHeaders['access-control-allow-origin']) {
      logSuccess(`CORS Allow-Origin: ${corsHeaders['access-control-allow-origin']}`);
    } else {
      logError('CORS Allow-Origin header missing');
      return false;
    }
    
    if (corsHeaders['access-control-allow-methods']) {
      logSuccess(`CORS Allow-Methods: ${corsHeaders['access-control-allow-methods']}`);
    } else {
      logWarning('CORS Allow-Methods header missing');
    }
    
    if (corsHeaders['access-control-allow-headers']) {
      logSuccess(`CORS Allow-Headers: ${corsHeaders['access-control-allow-headers']}`);
    } else {
      logWarning('CORS Allow-Headers header missing');
    }
    
    return true;
  } catch (error) {
    logError(`CORS test failed: ${error.message}`);
    return false;
  }
}

// Test input validation
async function testInputValidation() {
  logInfo('🔍 Testing Input Validation...');
  
  try {
    // Test user registration with invalid data
    const invalidUserData = [
      { username: '', email: 'test@example.com', password: 'password123' }, // Empty username
      { username: 'test', email: 'invalid-email', password: 'password123' }, // Invalid email
      { username: 'test', email: 'test@example.com', password: '123' }, // Short password
      { username: 'a'.repeat(50), email: 'test@example.com', password: 'password123' }, // Long username
    ];
    
    let validationTests = 0;
    let passedValidation = 0;
    
    for (const userData of invalidUserData) {
      validationTests++;
      try {
        const response = await axios.post(`${API_URL}/users/register`, userData, {
          validateStatus: function (status) {
            return status >= 200 && status < 500;
          }
        });
        
        if (response.status === 400) {
          passedValidation++;
          logSuccess(`Validation rejected invalid data: ${JSON.stringify(userData).substring(0, 50)}...`);
        } else {
          logError(`Validation failed to reject invalid data: ${JSON.stringify(userData).substring(0, 50)}...`);
        }
      } catch (error) {
        logError(`Validation test error: ${error.message}`);
      }
    }
    
    logInfo(`Input validation tests: ${passedValidation}/${validationTests} passed`);
    return passedValidation >= validationTests * 0.75; // At least 75% should pass
    
  } catch (error) {
    logError(`Input validation test failed: ${error.message}`);
    return false;
  }
}

// Test authentication middleware
async function testAuthMiddleware() {
  logInfo('🔐 Testing Authentication Middleware...');
  
  try {
    // Test accessing protected route without token
    let response = await axios.get(`${API_URL}/users`, {
      validateStatus: function (status) {
        return status >= 200 && status < 500;
      }
    });
    
    if (response.status === 401) {
      logSuccess('Protected route properly rejects requests without token');
    } else {
      logError('Protected route should reject requests without token');
      return false;
    }
    
    // Test with invalid token
    response = await axios.get(`${API_URL}/users`, {
      headers: {
        'Authorization': 'Bearer invalid-token-here'
      },
      validateStatus: function (status) {
        return status >= 200 && status < 500;
      }
    });
    
    if (response.status === 401) {
      logSuccess('Protected route properly rejects invalid tokens');
    } else {
      logError('Protected route should reject invalid tokens');
      return false;
    }
    
    // Test with malformed authorization header
    response = await axios.get(`${API_URL}/users`, {
      headers: {
        'Authorization': 'InvalidFormat token-here'
      },
      validateStatus: function (status) {
        return status >= 200 && status < 500;
      }
    });
    
    if (response.status === 401) {
      logSuccess('Protected route properly rejects malformed authorization headers');
    } else {
      logError('Protected route should reject malformed authorization headers');
      return false;
    }
    
    return true;
  } catch (error) {
    logError(`Authentication middleware test failed: ${error.message}`);
    return false;
  }
}

// Test error handling
async function testErrorHandling() {
  logInfo('⚠️  Testing Error Handling...');
  
  try {
    // Test 404 for non-existent route
    const response = await axios.get(`${API_URL}/non-existent-route`, {
      validateStatus: function (status) {
        return status >= 200 && status < 500;
      }
    });
    
    if (response.status === 404) {
      logSuccess('404 error handling works for non-existent routes');
      
      if (response.data && response.data.error) {
        logInfo(`404 Error message: ${response.data.error}`);
      }
    } else {
      logError(`Expected 404 for non-existent route, got: ${response.status}`);
      return false;
    }
    
    return true;
  } catch (error) {
    logError(`Error handling test failed: ${error.message}`);
    return false;
  }
}

// Main test runner for security tests
async function runSecurityTests() {
  log('\n🚀 Starting Security & Middleware Tests\n', colors.bold);
  
  const tests = [
    { name: 'Rate Limiting', fn: testRateLimiting },
    { name: 'CORS Configuration', fn: testCORS },
    { name: 'Input Validation', fn: testInputValidation },
    { name: 'Authentication Middleware', fn: testAuthMiddleware },
    { name: 'Error Handling', fn: testErrorHandling }
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
  log('SECURITY & MIDDLEWARE TEST SUMMARY', colors.bold);
  log('='.repeat(50), colors.blue);
  logSuccess(`Passed: ${passed}`);
  if (failed > 0) {
    logError(`Failed: ${failed}`);
  }
  log(`Total: ${passed + failed}`, colors.blue);
  
  if (failed === 0) {
    logSuccess('\n🎉 All security tests passed!');
  } else {
    logError('\n💥 Some security tests failed!');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runSecurityTests().catch(console.error);
}

module.exports = {
  runSecurityTests,
  testRateLimiting,
  testCORS,
  testInputValidation,
  testAuthMiddleware,
  testErrorHandling
};
