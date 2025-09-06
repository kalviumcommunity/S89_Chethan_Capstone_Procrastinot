// run-all-tests.js
// Master test runner for all Procrastinot Backend tests
const { runAllTests } = require('./comprehensive-test');
const { runGoogleOAuthTests } = require('./google-oauth-test');
const { runCRUDTests } = require('./crud-operations-test');
const { runSecurityTests } = require('./security-test');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  underline: '\x1b[4m'
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

// Test suite runner
async function runTestSuite(name, testFunction, color = colors.cyan) {
  log(`\n${'='.repeat(80)}`, color);
  log(`🧪 RUNNING: ${name}`, colors.bold);
  log('='.repeat(80), color);
  
  const startTime = Date.now();
  
  try {
    await testFunction();
    const duration = Date.now() - startTime;
    logSuccess(`${name} completed in ${duration}ms`);
    return { name, success: true, duration };
  } catch (error) {
    const duration = Date.now() - startTime;
    logError(`${name} failed after ${duration}ms: ${error.message}`);
    return { name, success: false, duration, error: error.message };
  }
}

// Main test runner
async function runAllBackendTests() {
  const startTime = Date.now();
  
  log('\n' + '='.repeat(80), colors.magenta);
  log('🚀 PROCRASTINOT BACKEND - COMPREHENSIVE TEST SUITE', colors.bold);
  log('='.repeat(80), colors.magenta);
  
  logInfo('Starting comprehensive backend testing...');
  logInfo('This will test all aspects of the Procrastinot Backend API');
  
  const testSuites = [
    {
      name: 'Basic Functionality Tests',
      fn: runAllTests,
      description: 'Core API functionality, authentication, and basic operations'
    },
    {
      name: 'Google OAuth Tests',
      fn: runGoogleOAuthTests,
      description: 'Google OAuth configuration and authentication flow'
    },
    {
      name: 'CRUD Operations Tests',
      fn: runCRUDTests,
      description: 'Complete Create, Read, Update, Delete operations for all models'
    },
    {
      name: 'Security & Middleware Tests',
      fn: runSecurityTests,
      description: 'Rate limiting, CORS, input validation, and security measures'
    }
  ];
  
  const results = [];
  
  for (const suite of testSuites) {
    logInfo(`\nNext: ${suite.name}`);
    logInfo(`Description: ${suite.description}`);
    
    const result = await runTestSuite(suite.name, suite.fn);
    results.push(result);
    
    // Small delay between test suites
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Final summary
  const totalDuration = Date.now() - startTime;
  const successfulSuites = results.filter(r => r.success).length;
  const failedSuites = results.filter(r => !r.success).length;
  
  log('\n' + '='.repeat(80), colors.magenta);
  log('📊 FINAL TEST SUMMARY', colors.bold);
  log('='.repeat(80), colors.magenta);
  
  logInfo(`Total Test Suites: ${results.length}`);
  logSuccess(`Successful Suites: ${successfulSuites}`);
  if (failedSuites > 0) {
    logError(`Failed Suites: ${failedSuites}`);
  }
  logInfo(`Total Duration: ${totalDuration}ms (${(totalDuration / 1000).toFixed(2)}s)`);
  
  log('\n📋 DETAILED RESULTS:', colors.bold);
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    const duration = `${result.duration}ms`;
    log(`${status} ${result.name} - ${duration}`, result.success ? colors.green : colors.red);
    if (!result.success && result.error) {
      log(`   Error: ${result.error}`, colors.red);
    }
  });
  
  // Backend readiness assessment
  log('\n' + '='.repeat(80), colors.blue);
  log('🎯 BACKEND READINESS ASSESSMENT', colors.bold);
  log('='.repeat(80), colors.blue);
  
  const readinessScore = (successfulSuites / results.length) * 100;
  
  if (readinessScore >= 90) {
    logSuccess(`Backend Readiness: ${readinessScore.toFixed(1)}% - EXCELLENT`);
    logSuccess('✨ Backend is ready for frontend integration!');
    log('\n🚀 READY FOR PRODUCTION:', colors.green);
    log('   • All core functionality working', colors.green);
    log('   • Authentication system operational', colors.green);
    log('   • Security measures in place', colors.green);
    log('   • CRUD operations fully functional', colors.green);
    log('   • API documentation complete', colors.green);
  } else if (readinessScore >= 75) {
    logWarning(`Backend Readiness: ${readinessScore.toFixed(1)}% - GOOD`);
    logWarning('⚠️  Backend is mostly ready with minor issues');
    log('\n🔧 RECOMMENDATIONS:', colors.yellow);
    log('   • Review failed test cases', colors.yellow);
    log('   • Fix minor issues before production', colors.yellow);
    log('   • Consider additional testing', colors.yellow);
  } else {
    logError(`Backend Readiness: ${readinessScore.toFixed(1)}% - NEEDS WORK`);
    logError('❌ Backend needs significant improvements');
    log('\n🚨 CRITICAL ISSUES:', colors.red);
    log('   • Multiple test suites failing', colors.red);
    log('   • Core functionality may be broken', colors.red);
    log('   • Not ready for frontend integration', colors.red);
  }
  
  // Next steps
  log('\n' + '='.repeat(80), colors.cyan);
  log('📋 NEXT STEPS', colors.bold);
  log('='.repeat(80), colors.cyan);
  
  if (readinessScore >= 90) {
    log('1. ✅ Backend testing complete', colors.green);
    log('2. 🎨 Proceed with frontend integration', colors.green);
    log('3. 🔗 Test frontend-backend communication', colors.green);
    log('4. 🚀 Prepare for deployment', colors.green);
  } else {
    log('1. 🔍 Review failed test results above', colors.yellow);
    log('2. 🛠️  Fix identified issues', colors.yellow);
    log('3. 🧪 Re-run tests to verify fixes', colors.yellow);
    log('4. 📝 Update documentation if needed', colors.yellow);
  }
  
  log('\n' + '='.repeat(80), colors.magenta);
  log('🎉 TESTING COMPLETE!', colors.bold);
  log('='.repeat(80), colors.magenta);
  
  return {
    totalSuites: results.length,
    successfulSuites,
    failedSuites,
    readinessScore,
    duration: totalDuration,
    results
  };
}

// Run all tests if this file is executed directly
if (require.main === module) {
  runAllBackendTests()
    .then(summary => {
      process.exit(summary.failedSuites > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('Fatal error running tests:', error);
      process.exit(1);
    });
}

module.exports = {
  runAllBackendTests
};
