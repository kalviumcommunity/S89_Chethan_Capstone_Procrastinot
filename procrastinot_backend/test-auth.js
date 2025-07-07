// Simple authentication test script
const axios = require('axios');

const API_URL = 'http://localhost:8080';

// Test data
const testUser = {
  username: 'testuser123',
  email: 'test@example.com',
  password: 'password123'
};

async function testAuthentication() {
  console.log('🧪 Testing Authentication Flows...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing server health...');
    const healthResponse = await axios.get(`${API_URL}/`);
    console.log('✅ Server is running:', healthResponse.data.message);

    // Test 2: User registration
    console.log('\n2. Testing user registration...');
    try {
      const registerResponse = await axios.post(`${API_URL}/api/users/register`, testUser);
      console.log('✅ Registration successful');
      console.log('   Token received:', !!registerResponse.data.token);
      console.log('   User ID received:', !!registerResponse.data.userId);
    } catch (error) {
      if (error.response?.data?.message?.includes('already exists')) {
        console.log('⚠️  User already exists (expected if running multiple times)');
      } else {
        throw error;
      }
    }

    // Test 3: User login
    console.log('\n3. Testing user login...');
    const loginResponse = await axios.post(`${API_URL}/api/users/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login successful');
    console.log('   Token received:', !!loginResponse.data.token);
    console.log('   User ID received:', !!loginResponse.data.userId);

    const token = loginResponse.data.token;

    // Test 4: Protected route access
    console.log('\n4. Testing protected route access...');
    try {
      const protectedResponse = await axios.get(`${API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('✅ Protected route accessible with valid token');
    } catch (error) {
      console.log('❌ Protected route test failed:', error.response?.data?.message);
    }

    // Test 5: Invalid token
    console.log('\n5. Testing invalid token handling...');
    try {
      await axios.get(`${API_URL}/api/users`, {
        headers: {
          Authorization: 'Bearer invalid-token'
        }
      });
      console.log('❌ Invalid token was accepted (this should not happen)');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Invalid token properly rejected');
      } else {
        console.log('⚠️  Unexpected error:', error.response?.data?.message);
      }
    }

    // Test 6: Missing token
    console.log('\n6. Testing missing token handling...');
    try {
      await axios.get(`${API_URL}/api/users`);
      console.log('❌ Request without token was accepted (this should not happen)');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Request without token properly rejected');
      } else {
        console.log('⚠️  Unexpected error:', error.response?.data?.message);
      }
    }

    console.log('\n🎉 All authentication tests completed!');

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data?.message || error.message);
    console.error('Make sure the server is running on', API_URL);
  }
}

// Run tests
testAuthentication();
