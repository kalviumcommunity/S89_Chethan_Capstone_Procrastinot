# Procrastinot Backend API Documentation

## 🚀 Overview

The Procrastinot Backend is a comprehensive Node.js/Express.js API that provides productivity management features including task management, skill tracking, pomodoro sessions, mood logging, and challenges.

## 🔧 Technical Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + Google OAuth 2.0
- **Security**: Rate limiting, CORS, input validation
- **Testing**: Custom test suites for all endpoints

## 🌐 Base URL

```
Development: http://localhost:8080
Production: [Your production URL]
```

## 🔐 Authentication

### JWT Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Google OAuth 2.0
- **Initiate OAuth**: `GET /api/users/google`
- **OAuth Callback**: `GET /api/users/google/callback`
- **Frontend Login**: `POST /api/users/google-login`

## 📊 API Endpoints

### 🏥 Health Check
```http
GET /
```
**Response**: `{ "message": "🚀 Server is running!" }`

---

### 👤 User Management

#### Register User
```http
POST /api/users/register
```
**Body**:
```json
{
  "username": "string (3-30 chars, alphanumeric)",
  "email": "string (valid email)",
  "password": "string (6+ chars, must contain letter and number)"
}
```
**Response**: `{ "userId": "string", "token": "string" }`

#### Login User
```http
POST /api/users/login
```
**Body**:
```json
{
  "email": "string",
  "password": "string"
}
```
**Response**: `{ "userId": "string", "token": "string" }`

#### Get User Profile (Protected)
```http
GET /api/users/profile/:userId
```
**Response**: User object with populated relationships

#### Get All Users (Protected)
```http
GET /api/users
```
**Response**: Array of user objects

#### Update User (Protected)
```http
PUT /api/users/:id
```
**Body**: Partial user object
**Response**: Updated user object

---

### 📝 Task Management

#### Create Task (Protected)
```http
POST /api/tasks
```
**Body**:
```json
{
  "userId": "string (required)",
  "title": "string (required)",
  "description": "string",
  "status": "Pending|Completed|In Progress|Revise Again",
  "priority": "Low|Medium|High|Urgent",
  "isImportant": "boolean",
  "dueDate": "date",
  "category": "string",
  "tags": ["string"],
  "estimatedTime": "number (minutes)",
  "moodBefore": "Happy|Neutral|Sad|Stressed"
}
```
**Response**: Created task object

#### Get User Tasks (Protected)
```http
GET /api/tasks/user/:userId
```
**Response**: Array of task objects with populated relationships

#### Update Task (Protected)
```http
PUT /api/tasks/:id
```
**Body**: Partial task object
**Response**: Updated task object

#### Delete Task (Protected)
```http
DELETE /api/tasks/:id
```
**Response**: `{ "message": "Task deleted successfully", "taskId": "string" }`

---

### 🎯 Skills Management

#### Create Skill (Protected)
```http
POST /api/skills
```
**Body**:
```json
{
  "userId": "string (required)",
  "name": "string (required)",
  "description": "string",
  "category": "string (required)",
  "subTopic": "string (required)",
  "level": "Beginner|Intermediate|Advanced",
  "content": "string",
  "progress": "number (0-100)"
}
```
**Response**: Created skill object

#### Get User Skills (Protected)
```http
GET /api/skills/user/:userId
```
**Response**: `{ "message": "string", "count": number, "skills": [skill objects] }`

#### Get All Skills (Protected)
```http
GET /api/skills
```
**Response**: Array of all skills

#### Get Skills by Category (Protected)
```http
GET /api/skills/category/:category
```
**Response**: Array of skills in specified category

#### Update Skill (Protected)
```http
PUT /api/skills/:id
```
**Body**: Partial skill object
**Response**: Updated skill object

#### Delete Skill (Protected)
```http
DELETE /api/skills/:id
```
**Response**: `{ "message": "Skill deleted successfully" }`

---

### 🍅 Pomodoro Sessions

#### Create Pomodoro Session (Protected)
```http
POST /api/pomodoro
```
**Body**:
```json
{
  "userId": "string (required)",
  "duration": "number (required, minutes)",
  "status": "Completed|In Progress|Paused (required)",
  "taskId": "string (optional)",
  "moodBefore": "Happy|Neutral|Sad|Anxious|Excited",
  "moodAfter": "Happy|Neutral|Sad|Anxious|Excited",
  "notes": "string"
}
```
**Response**: `{ "message": "string", "session": session_object }`

#### Get User Pomodoro Sessions (Protected)
```http
GET /api/pomodoro/user/:userId
```
**Response**: Array of pomodoro session objects

#### Update Pomodoro Session (Protected)
```http
PUT /api/pomodoro/:id
```
**Body**: Partial pomodoro session object
**Response**: Updated session object

#### Delete Pomodoro Session (Protected)
```http
DELETE /api/pomodoro/:id
```
**Response**: `{ "message": "Pomodoro session deleted successfully" }`

---

### 😊 Mood Logging

#### Create Mood Log (Protected)
```http
POST /api/moods
```
**Body**:
```json
{
  "userId": "string (required)",
  "moodType": "Happy|Sad|Anxious|Excited|Tired|Angry|Neutral (required)",
  "note": "string (max 300 chars)",
  "sessionType": "Before Pomodoro|After Pomodoro (required)"
}
```
**Response**: `{ "message": "string", "moodLog": mood_log_object }`

#### Get User Mood Logs (Protected)
```http
GET /api/moods/user/:userId
```
**Response**: Array of mood log objects

#### Update Mood Log (Protected)
```http
PUT /api/moods/:id
```
**Body**: Partial mood log object
**Response**: Updated mood log object

#### Delete Mood Log (Protected)
```http
DELETE /api/moods/:id
```
**Response**: `{ "message": "Mood log deleted successfully" }`

---

### 🏆 Challenges

#### Create Challenge (Protected)
```http
POST /api/challenges
```
**Body**:
```json
{
  "title": "string (required, max 100 chars)",
  "description": "string (required, max 300 chars)",
  "difficulty": "Easy|Medium|Hard (required)",
  "tags": ["string"],
  "validFor": "number (hours, default 24)"
}
```
**Response**: `{ "message": "string", "challenge": challenge_object }`

#### Get All Challenges (Protected)
```http
GET /api/challenges
```
**Response**: Array of challenge objects

#### Get Challenges by Difficulty (Protected)
```http
GET /api/challenges/difficulty/:level
```
**Response**: Array of challenges with specified difficulty

#### Update Challenge (Protected)
```http
PUT /api/challenges/:id
```
**Body**: Partial challenge object
**Response**: Updated challenge object

#### Delete Challenge (Protected)
```http
DELETE /api/challenges/:id
```
**Response**: `{ "message": "Challenge deleted successfully" }`

---

## 🔒 Security Features

### Rate Limiting
- **General**: 100 requests per 15 minutes per IP
- **Authentication**: 5 requests per 15 minutes per IP
- **Password Reset**: 3 requests per hour per IP

### CORS Configuration
- **Allowed Origin**: `http://localhost:5173` (configurable via CLIENT_URL)
- **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Allowed Headers**: Content-Type, Authorization
- **Credentials**: Enabled

### Input Validation
- **Email**: Valid email format required
- **Username**: 3-30 characters, alphanumeric with underscores/hyphens
- **Password**: Minimum 6 characters, must contain letter and number
- **Required Fields**: Validated on all endpoints

---

## 🌍 Environment Variables

```env
PORT=8080
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-jwt-secret-key
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8080/api/users/google/callback
SERVER_URL=http://localhost:8080
```

---

## 🧪 Testing

The backend includes comprehensive test suites:

- **comprehensive-test.js**: Basic functionality tests
- **google-oauth-test.js**: Google OAuth configuration tests
- **crud-operations-test.js**: Full CRUD operation tests
- **security-test.js**: Security and middleware tests

Run tests:
```bash
node comprehensive-test.js
node google-oauth-test.js
node crud-operations-test.js
node security-test.js
```

---

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set Environment Variables**: Create `.env` file with required variables

3. **Start Server**:
   ```bash
   npm start          # Production
   npm run dev        # Development with nodemon
   ```

4. **Run Tests**: Execute test files to verify functionality

---

## 📈 Status

✅ **Completed Features**:
- User authentication (JWT + Google OAuth)
- Complete CRUD operations for all models
- Security middleware (rate limiting, CORS, validation)
- Comprehensive test coverage
- Error handling and logging
- Database relationships and population

🔧 **Ready for Frontend Integration**:
- All API endpoints tested and working
- Proper error responses and status codes
- CORS configured for frontend communication
- Authentication flow ready for frontend implementation

---

*Last Updated: 2025-01-20*
*Backend Version: 1.0.0*
