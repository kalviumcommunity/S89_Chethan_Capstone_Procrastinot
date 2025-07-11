# Frontend-Backend Integration Testing Guide

## Overview
This guide explains how to test the integration between the Procrastinot frontend and backend, specifically for task management and user profile features.

## Prerequisites
1. Backend server running on `http://localhost:8080`
2. Frontend development server running on `http://localhost:5173`
3. MongoDB database connected
4. User account created and logged in

## Features Implemented

### ✅ Task Management Integration
- **Create Tasks**: Frontend can create new tasks via backend API
- **Read Tasks**: Frontend fetches user tasks from backend
- **Update Tasks**: Frontend can update task properties
- **Delete Tasks**: Frontend can delete tasks
- **Complete Tasks**: Frontend can mark tasks as completed
- **Toggle Importance**: Frontend can toggle task importance

### ✅ User Profile Integration
- **User Authentication**: JWT token-based authentication
- **Profile Display**: Real user data displayed in navbar and profile page
- **Profile Editing**: Users can update their profile information
- **User Statistics**: Display task counts, completion rates, etc.
- **Profile Pictures**: Support for profile picture uploads

## Testing Steps

### 1. Manual Testing via UI

#### Test Task Operations:
1. Navigate to `http://localhost:5173`
2. Log in with your credentials
3. Go to the Tasks page (`/tasks`)
4. Try the following operations:
   - **Create**: Click "Add New Task" and fill out the form
   - **Read**: Verify tasks are loaded and displayed
   - **Update**: Click edit on a task and modify it
   - **Delete**: Click delete on a task
   - **Complete**: Click the circle icon to mark as complete
   - **Filter**: Use the filter options to test task filtering

#### Test User Profile:
1. Check the navbar - your username and avatar should appear
2. Click on your profile in the navbar
3. Navigate to the Profile page (`/profile`)
4. Verify your user information is displayed
5. Try editing your profile
6. Check that statistics are calculated correctly

### 2. Automated Testing via Console

#### Run Integration Tests:
1. Open browser console (F12)
2. Navigate to the application and log in
3. Run the following commands:

```javascript
// Test everything
window.testIntegration.runAllTests()

// Test individual components
window.testIntegration.testAuthentication()
window.testIntegration.testUserProfile()
window.testIntegration.testTaskOperations()
```

### 3. API Testing via Network Tab

#### Monitor API Calls:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Perform actions in the UI
4. Verify the following API calls are made:

**Task Operations:**
- `POST /api/tasks` - Create task
- `GET /api/tasks/user/:userId` - Get user tasks
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

**User Operations:**
- `GET /api/users/profile/:userId` - Get user profile
- `PUT /api/users/:userId` - Update user profile

## Expected Behavior

### Task Management
- ✅ Tasks are created with proper user association
- ✅ Tasks are fetched and displayed correctly
- ✅ Task updates are reflected immediately in UI
- ✅ Task deletion removes tasks from UI
- ✅ Task completion updates status and UI appearance
- ✅ Filters work correctly with backend data

### User Profile
- ✅ Real user data appears in navbar
- ✅ Profile page shows accurate user information
- ✅ Profile editing updates backend data
- ✅ Statistics are calculated from actual user data
- ✅ Authentication is maintained across page refreshes

## Troubleshooting

### Common Issues

#### 1. "No user ID found" Error
- **Cause**: User not logged in or token expired
- **Solution**: Log in again and ensure token is stored in localStorage

#### 2. "Failed to fetch tasks" Error
- **Cause**: Backend not running or API endpoint issues
- **Solution**: Check backend server is running on port 8080

#### 3. CORS Errors
- **Cause**: Frontend and backend on different origins
- **Solution**: Verify CORS configuration in backend server.js

#### 4. Authentication Errors
- **Cause**: Invalid or expired JWT token
- **Solution**: Clear localStorage and log in again

### Debug Commands

```javascript
// Check authentication status
console.log('Token:', localStorage.getItem('token'))
console.log('User ID:', localStorage.getItem('userId'))

// Test API connectivity
fetch('http://localhost:8080/api/users/profile/' + localStorage.getItem('userId'), {
  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
})
.then(r => r.json())
.then(console.log)
```

## API Endpoints Reference

### Task Endpoints
- `GET /api/tasks/user/:userId` - Get all tasks for user
- `GET /api/tasks/:taskId` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:taskId` - Update task
- `DELETE /api/tasks/:taskId` - Delete task

### User Endpoints
- `GET /api/users/profile/:userId` - Get user profile
- `PUT /api/users/:userId` - Update user profile
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user

## Success Criteria

The integration is successful when:
- ✅ All task CRUD operations work through the UI
- ✅ User profile data is displayed correctly
- ✅ Authentication persists across page refreshes
- ✅ Real-time updates work (create/update/delete tasks)
- ✅ Error handling works properly
- ✅ No console errors during normal operation

## Next Steps

After successful integration testing:
1. Add more comprehensive error handling
2. Implement loading states for better UX
3. Add data validation on both frontend and backend
4. Implement real-time updates with WebSockets
5. Add unit and integration tests with Jest/Cypress
