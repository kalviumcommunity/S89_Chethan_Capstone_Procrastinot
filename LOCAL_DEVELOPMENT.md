# 🛠️ Local Development Setup

## Quick Start

### Backend (Terminal 1)
```bash
cd procrastinot_backend
npm install
npm run dev
```

### Frontend (Terminal 2)
```bash
cd procrastinot_frontend
npm install
npm run dev:local
```

## Environment Configuration

### Development (Local)
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`
- Uses `.env.local` files

### Production
- Frontend: Vercel deployment
- Backend: Render deployment
- Uses `.env.production` files

## Files Created/Modified

### New Files:
- `procrastinot_frontend/.env.local` - Local frontend config
- `procrastinot_frontend/.env.production` - Production frontend config
- `procrastinot_backend/.env.local` - Local backend config

### Modified Files:
- All service files now use `import.meta.env.VITE_API_BASE_URL`
- `vite.config.js` simplified for local development
- `package.json` updated with proper dev scripts

## Environment Variables

### Frontend (.env.local)
```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_CLIENT_URL=http://localhost:5173
```

### Backend (.env.local)
```
PORT=8080
MONGO_URI=mongodb://localhost:27017/procrastinot
JWT_SECRET=your-jwt-secret-key-here
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:8080
GEMINI_API_KEY=AIzaSyBNDADF9V3oCy3stOrw3quk_GedK6S-DYY
```

## How It Works

1. **Development Mode**: Uses `.env.local` files for local URLs
2. **Production Mode**: Uses `.env.production` files for deployed URLs
3. **Automatic Detection**: Services automatically pick the right environment
4. **No Code Changes**: Same codebase works in both environments

## Troubleshooting

- Ensure MongoDB is running locally for backend
- Check that ports 5173 and 8080 are available
- Verify environment files are in correct locations
- Backend must be running before frontend for API calls to work