import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import Login from './pages/LoginForm';
import Register from './pages/RegisterForm';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard'; // Placeholder for future dashboard page
import Pomodoro from './pages/Pomodoro';
import Tasks from './pages/Tasks';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import tokenMonitor from './services/tokenMonitor';
import { getUserFromToken } from './utils/auth';

function App() {
  const location = useLocation();

  useEffect(() => {
    // Start token monitoring if user is authenticated
    const user = getUserFromToken();
    if (user) {
      tokenMonitor.startMonitoring();
    }

    // Stop monitoring on login/register pages
    const publicPaths = ['/', '/login', '/register', '/auth/callback'];
    if (publicPaths.includes(location.pathname)) {
      tokenMonitor.stopMonitoring();
    }

    // Handle browser window/tab close - keep session alive
    const handleBeforeUnload = (e) => {
      // Don't clear auth data on page refresh or navigation
      // Only clear when user explicitly logs out
    };

    const handleVisibilityChange = () => {
      // Resume token monitoring when tab becomes visible
      if (!document.hidden && user) {
        tokenMonitor.startMonitoring();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // Don't stop monitoring on unmount to maintain session
    };
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/pomodoro" element={<ProtectedRoute><Pomodoro /></ProtectedRoute>} />
      <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      {/* More routes later */}
    </Routes>
  );
}

export default App;
