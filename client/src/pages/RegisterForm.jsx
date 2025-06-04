import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/Auth/AuthLayout";
import axios from "axios";
import { motion } from "framer-motion";
import GoogleLoginButton from "../components/GoogleLoginButton";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((e) => {
    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/api/users/register", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <label className="block mb-1 text-sm font-medium">Full Name</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            autoComplete="name"
            className="w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <label className="block mb-1 text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
            className="w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <label className="block mb-1 text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
            className="w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </motion.div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <motion.button type="submit" disabled={loading} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition duration-300" whileTap={{ scale: 0.95 }}>
          {loading ? "Creating account..." : "Register"}
        </motion.button>

        <div className="text-center text-sm text-gray-600">
          Already have an account? <a href="/login" className="text-indigo-600">Login</a>
        </div>

        <div className="flex items-center justify-center gap-2 mt-4">
          <span className="h-px bg-gray-300 w-1/4"></span>
          <span className="text-gray-400 text-sm">OR</span>
          <span className="h-px bg-gray-300 w-1/4"></span>
        </div>

        <GoogleLoginButton />
      </form>
    </AuthLayout>
  );
};

export default RegisterForm;
