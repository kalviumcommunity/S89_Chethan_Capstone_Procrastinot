// Test script to verify authentication system
const API_BASE_URL = 'https://s89-chethan-capstone-procrastinot-1.onrender.com/api';

async function testAuthSystem() {
  console.log('🧪 Testing Procrastinot Authentication System...\n');

  // Test 1: Server Health Check
  try {
    console.log('1️⃣ Testing server health...');
    const response = await fetch('https://s89-chethan-capstone-procrastinot-1.onrender.com/');
    const data = await response.json();
    console.log('✅ Server is running:', data.message);
  } catch (error) {
    console.log('❌ Server health check failed:', error.message);
    return;
  }

  // Test 2: User Registration
  try {
    console.log('\n2️⃣ Testing user registration...');
    const testUser = {
      username: 'testuser' + Date.now(),
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    };

    const registerResponse = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });

    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('✅ Registration successful! Token received:', registerData.token ? 'Yes' : 'No');
      
      // Test 3: User Login
      console.log('\n3️⃣ Testing user login...');
      const loginResponse = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password
        })
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('✅ Login successful! Token received:', loginData.token ? 'Yes' : 'No');
        
        // Test 4: Protected Route Access
        console.log('\n4️⃣ Testing protected route access...');
        const profileResponse = await fetch(`${API_BASE_URL}/users/profile/${loginData.userId}`, {
          headers: {
            'Authorization': `Bearer ${loginData.token}`
          }
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          console.log('✅ Protected route access successful! User:', profileData.username);
        } else {
          console.log('❌ Protected route access failed');
        }
      } else {
        const loginError = await loginResponse.json();
        console.log('❌ Login failed:', loginError.message);
      }
    } else {
      const registerError = await registerResponse.json();
      console.log('❌ Registration failed:', registerError.message);
    }
  } catch (error) {
    console.log('❌ Authentication test failed:', error.message);
  }

  console.log('\n🎉 Authentication system test completed!');
  console.log('\n📋 Frontend Integration Summary:');
  console.log('• Header updated with single "Get Started" button');
  console.log('• AuthService created for API communication');
  console.log('• Login/Signup forms connected to backend');
  console.log('• Success page created for post-authentication');
  console.log('• Google OAuth integration ready');
  console.log('• JWT token management implemented');
  console.log('\n🚀 Ready to test in browser!');
}

// Run the test
testAuthSystem();