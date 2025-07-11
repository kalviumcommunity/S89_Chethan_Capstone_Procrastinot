// src/components/Auth/
import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";

const AuthLayout = ({ children, title }) => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-dark-900' : 'bg-gray-50'}`}>
      {/* Left Side - Branding or Illustration */}
      <motion.div
        className={`hidden md:flex w-1/2 ${isDark ? 'bg-gradient-to-tr from-purple-600 to-indigo-900 text-white' : 'bg-gradient-to-tr from-blue-500 to-purple-600 text-white'} items-center justify-center p-10`}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Welcome to Procrastinot</h1>
          <p className="text-lg">Defeat procrastination. Dominate your goals.</p>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <div className={`w-full md:w-1/2 flex items-center justify-center p-8 ${isDark ? 'bg-dark-800' : 'bg-white'}`}>
        <div className="w-full max-w-md">
          <h2 className={`text-2xl font-semibold text-center mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;AuthLayout.jsx
