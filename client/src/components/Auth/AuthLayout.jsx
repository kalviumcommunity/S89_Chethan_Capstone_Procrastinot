// src/components/Auth/
import React from "react";
import { motion } from "framer-motion";

const AuthLayout = ({ children, title }) => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding or Illustration */}
      <motion.div
        className="hidden md:flex w-1/2 bg-gradient-to-tr from-purple-600 to-indigo-900 text-white items-center justify-center p-10"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Welcome to Procrastinot</h1>
          <p className="text-lg">Defeat procrastination. Dominate your goals.</p>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center mb-6">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;AuthLayout.jsx
