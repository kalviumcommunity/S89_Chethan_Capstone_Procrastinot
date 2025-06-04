// src/components/Auth/LoginForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/Auth/AuthLayout";
import axios from "axios";
import { motion } from "framer-motion";

const LoginForm = () => {
  const navigate = useNavigate();
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

    try {
      const res = await axios.post("http://localhost:8080/api/users/login", form);
      localStorage.setItem("token", res.data.token); // save JWT
      navigate("/dashboard"); // redirect to user dashboard
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Login to Procrastinot">
      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block mb-1 text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block mb-1 text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </motion.div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <motion.button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition duration-300"
          whileTap={{ scale: 0.95 }}
        >
          {loading ? "Logging in..." : "Login"}
        </motion.button>

        <div className="text-center text-sm text-gray-600">
          Don't have an account? <a href="/register" className="text-indigo-600">Sign up</a>
        </div>

        <div className="flex items-center justify-center gap-2 mt-4">
          <span className="h-px bg-gray-300 w-1/4"></span>
          <span className="text-gray-400 text-sm">OR</span>
          <span className="h-px bg-gray-300 w-1/4"></span>
        </div>

        <motion.button
          type="button"
          className="w-full py-2 bg-white border hover:bg-gray-100 text-gray-700 font-medium rounded-md transition duration-300 flex items-center justify-center gap-2"
          whileTap={{ scale: 0.95 }}
          onClick={() => alert("Google OAuth coming soon!")}
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          Continue with Google
        </motion.button>
      </form>
    </AuthLayout>
  );
};

export default LoginForm;
