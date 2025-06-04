import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/LoginForm';
import Register from './pages/RegisterForm';
import AuthCallback from './pages/AuthCallback';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      {/* More routes later */}
    </Routes>
  );
}

export default App;
