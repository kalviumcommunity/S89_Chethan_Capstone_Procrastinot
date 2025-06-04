import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/LoginForm';
import Register from './pages/RegisterForm';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* More routes later */}
    </Routes>
  );
}

export default App;
