import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between bg-transparent absolute top-0 z-50">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-white hover:scale-105 transition-transform duration-200">
        🧠 Procrastinot
      </Link>

      {/* Links */}
      <div className="flex gap-4">
        <Link
          to="/login"
          className="bg-white text-purple-700 font-semibold py-2 px-4 rounded-xl hover:bg-purple-200 transition"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-xl hover:bg-purple-500 transition"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}
