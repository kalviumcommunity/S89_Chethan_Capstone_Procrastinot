# 🔐 Procrastinot Authentication Setup Guide

This guide will help you set up authentication for the Procrastinot application.

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Google Cloud Console account

## 🚀 Quick Setup

### 1. Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd procrastinot_backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in `.env`:**
   - Set your MongoDB connection string
   - Generate a JWT secret key
   - Configure Google OAuth credentials (see Google Setup section)

### 2. Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in `.env`:**
   - Set backend API URL
   - Set Google OAuth Client ID

## 🔧 Google OAuth Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (or Google Identity API)

### Step 2: Create OAuth Credentials

1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Add authorized JavaScript origins:
   - `http://localhost:5173` (development)
   - Your production frontend URL
5. Add authorized redirect URIs:
   - `http://localhost:8080/api/users/google/callback` (development)
   - Your production backend URL + `/api/users/google/callback`

### Step 3: Configure Environment Variables

Add the credentials to your `.env` files:

**Backend (.env):**
```env
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

**Frontend (.env):**
```env
VITE_GOOGLE_CLIENT_ID=your-client-id-here
```

## 🔑 JWT Secret Generation

Generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Add this to your backend `.env` file:
```env
JWT_SECRET=your-generated-secret-here
```

## 🗄️ Database Setup

### Local MongoDB
```env
MONGO_URI=mongodb://localhost:27017/procrastinot
```

### MongoDB Atlas
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/procrastinot
```

## 🏃‍♂️ Running the Application

### Start Backend (Terminal 1)
```bash
cd procrastinot_backend
npm start
```

### Start Frontend (Terminal 2)
```bash
cd client
npm run dev
```

## 🔍 Testing Authentication

1. **Register:** Create a new account with email/password
2. **Login:** Sign in with your credentials
3. **Google OAuth:** Use "Continue with Google" button
4. **Token Storage:** Check browser localStorage for JWT token

## 🛠️ Troubleshooting

### Common Issues

1. **"Missing environment variable" error:**
   - Ensure all required variables are set in `.env` files
   - Check for typos in variable names

2. **Google OAuth not working:**
   - Verify Client ID matches in both frontend and backend
   - Check authorized origins and redirect URIs in Google Console
   - Ensure Google+ API is enabled

3. **CORS errors:**
   - Verify CLIENT_URL in backend matches frontend URL
   - Check that both servers are running

4. **JWT errors:**
   - Ensure JWT_SECRET is set and consistent
   - Check token expiration (default: 7 days)

### Debug Mode

Enable debug logging by setting:
```env
DEBUG=true
VITE_DEBUG=true
```

## 🔒 Security Best Practices

1. **Never commit `.env` files** - they're in `.gitignore`
2. **Use strong JWT secrets** - minimum 64 characters
3. **Set appropriate token expiration** - balance security vs UX
4. **Use HTTPS in production** - never send tokens over HTTP
5. **Validate all inputs** - prevent injection attacks
6. **Keep dependencies updated** - regularly run `npm audit`

## 📚 API Endpoints

### Authentication Endpoints

- `POST /api/users/register` - Email/password registration
- `POST /api/users/login` - Email/password login
- `POST /api/users/google-login` - Google OAuth login
- `GET /api/users/google` - Initiate Google OAuth flow
- `GET /api/users/google/callback` - Google OAuth callback

### Protected Endpoints

All other API endpoints require JWT token in Authorization header:
```
Authorization: Bearer your-jwt-token-here
```
