import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/LoginForm';
import Register from './pages/RegisterForm';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard'; // Placeholder for future dashboard page
import Pomodoro from './pages/Pomodoro';
import Tasks from './pages/Tasks';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/pomodoro" element={<Pomodoro />} />
      <Route path="/tasks" element={<Tasks />} />
      {/* More routes later */}
    </Routes>
  );
}

export default App;
