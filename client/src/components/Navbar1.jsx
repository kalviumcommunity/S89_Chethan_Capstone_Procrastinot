// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Moon, Bell } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <nav className="w-full shadow-md bg-white fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        
        {/* Left: Logo */}
        <div className="text-xl font-bold text-black">
          <Link to="/dashboard">
            <span className="font-bold text-black">🧠 pro</span>
            <span className="text-black">crastinot</span>
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-700">
          <Link to="/tasks" className="hover:text-purple-600 transition">Tasks</Link>
          <Link to="/pomodoro" className="hover:text-purple-600 transition">Pomodoro</Link>
          <Link to="/skills" className="hover:text-purple-600 transition">Skills</Link>
          <Link to="/challenges" className="hover:text-purple-600 transition">Challenges</Link>
          <Link to="/dashboard" className="hover:text-purple-600 transition">Home</Link>
        </div>

        {/* Right: Icons + Profile */}
        <div className="flex items-center space-x-4">
          <Moon className="cursor-pointer text-gray-700 hover:text-purple-600" />
          <Bell className="cursor-pointer text-gray-700 hover:text-purple-600" />
          
          {/* Profile avatar (clickable) */}
          <img
            src="/assets/profile.jpg" // replace with dynamic user profile later
            alt="profile"
            onClick={handleProfileClick}
            className="w-10 h-10 rounded-full border-2 border-purple-500 cursor-pointer hover:scale-105 transition"
          />
        </div>
      </div>
    </nav>
  );
}
