// Debug script to test backend connection
// Run this in browser console to diagnose connection issues

export const debugConnection = async () => {
  console.log('🔍 Debug: Testing Backend Connection');
  console.log('=====================================');
  
  // Test 1: Basic server health check
  console.log('1️⃣ Testing server health...');
  try {
    const healthResponse = await fetch('http://localhost:8080');
    const healthData = await healthResponse.json();
    console.log('✅ Server health:', healthData);
  } catch (error) {
    console.error('❌ Server health check failed:', error);
    return;
  }
  
  // Test 2: Check authentication data
  console.log('2️⃣ Checking authentication data...');
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  
  console.log('Token exists:', !!token);
  console.log('User ID exists:', !!userId);
  
  if (!token || !userId) {
    console.error('❌ No authentication data found. Please log in first.');
    return;
  }
  
  console.log('Token preview:', token.substring(0, 30) + '...');
  console.log('User ID:', userId);
  
  // Test 3: Test authenticated API call
  console.log('3️⃣ Testing authenticated API call...');
  try {
    const response = await fetch(`http://localhost:8080/api/users/profile/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const userData = await response.json();
      console.log('✅ User profile fetched successfully:', userData);
    } else {
      const errorData = await response.text();
      console.error('❌ API call failed:', response.status, errorData);
    }
  } catch (error) {
    console.error('❌ API call error:', error);
  }
  
  // Test 4: Test CORS
  console.log('4️⃣ Testing CORS configuration...');
  try {
    const corsResponse = await fetch('http://localhost:8080/api/users', {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:5173',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Authorization, Content-Type'
      }
    });
    console.log('✅ CORS preflight response:', corsResponse.status);
  } catch (error) {
    console.error('❌ CORS test failed:', error);
  }
  
  console.log('=====================================');
  console.log('🔍 Debug complete');
};

// Test task API specifically
export const debugTaskAPI = async () => {
  console.log('🔍 Debug: Testing Task API');
  console.log('==========================');
  
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  
  if (!token || !userId) {
    console.error('❌ No authentication data found. Please log in first.');
    return;
  }
  
  try {
    // Test getting user tasks
    console.log('📋 Testing GET user tasks...');
    const tasksResponse = await fetch(`http://localhost:8080/api/tasks/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (tasksResponse.ok) {
      const tasks = await tasksResponse.json();
      console.log('✅ Tasks fetched:', tasks.length, 'tasks');
      console.log('Tasks:', tasks);
    } else {
      console.error('❌ Failed to fetch tasks:', tasksResponse.status);
    }
    
    // Test creating a task
    console.log('➕ Testing POST create task...');
    const createResponse = await fetch('http://localhost:8080/api/tasks', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId,
        title: 'Debug Test Task',
        description: 'This is a test task created by debug script',
        priority: 'Medium',
        category: 'Testing'
      })
    });
    
    if (createResponse.ok) {
      const newTask = await createResponse.json();
      console.log('✅ Task created successfully:', newTask);
      
      // Clean up - delete the test task
      if (newTask.task && newTask.task._id) {
        console.log('🗑️ Cleaning up test task...');
        const deleteResponse = await fetch(`http://localhost:8080/api/tasks/${newTask.task._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (deleteResponse.ok) {
          console.log('✅ Test task cleaned up successfully');
        }
      }
    } else {
      const errorText = await createResponse.text();
      console.error('❌ Failed to create task:', createResponse.status, errorText);
    }
    
  } catch (error) {
    console.error('❌ Task API test failed:', error);
  }
  
  console.log('==========================');
  console.log('🔍 Task API debug complete');
};

// Make functions available globally
if (typeof window !== 'undefined') {
  window.debugConnection = debugConnection;
  window.debugTaskAPI = debugTaskAPI;
  
  console.log('🔧 Debug functions loaded!');
  console.log('Run: debugConnection() or debugTaskAPI()');
}
