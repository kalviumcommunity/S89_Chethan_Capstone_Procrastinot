import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/Auth/AuthLayout";
import api from "../services/api";
import { motion } from "framer-motion";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { storeAuthData, handleAuthError, isValidEmail } from "../utils/auth";
import tokenMonitor from "../services/tokenMonitor";
import { useTheme } from "../contexts/ThemeContext";

const LoginForm = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate inputs
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (!isValidEmail(form.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/users/login', form);

      if (res.data.token && res.data.userId) {
        storeAuthData(res.data.token, res.data.userId);
        tokenMonitor.startMonitoring(); // Start token monitoring after login
        navigate("/dashboard");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(handleAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Login to Procrastinot">
      <motion.form 
        onSubmit={handleSubmit} 
        className="space-y-6 card-modern p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
        >
          <label className="block mb-2 text-sm font-semibold text-gradient">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="input-modern"
            placeholder="Enter your email"
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
        >
          <label className="block mb-2 text-sm font-semibold text-gradient">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="input-modern"
            placeholder="Enter your password"
          />
        </motion.div>

        {error && (
          <motion.p 
            className="text-red-500 text-sm bg-red-50 p-3 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.p>
        )}

        <motion.button 
          type="submit" 
          disabled={loading}
          className="btn-primary w-full"
          whileTap={{ scale: 0.95 }}
        >
          {loading ? "Logging in..." : "Login"}
        </motion.button>

        <div className="text-center text-sm">
          <span className="text-gray-600">Don't have an account?</span>{" "}
          <a href="/register" className="text-gradient font-semibold hover-lift inline-block">
            Sign up
          </a>
        </div>

        <div className="flex items-center justify-center gap-4 my-6">
          <span className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></span>
          <span className="text-gray-400 text-sm font-medium">OR</span>
          <span className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></span>
        </div>

        <GoogleLoginButton />
      </motion.form>
    </AuthLayout>
  );
};

export default LoginForm;
