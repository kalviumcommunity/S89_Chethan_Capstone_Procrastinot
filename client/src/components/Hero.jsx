import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28">
      {/* Heading with animation */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-6xl font-bold text-white leading-tight max-w-4xl"
      >
        Beat Procrastination. <br /> Build Skills. <br /> Stay Productive.
      </motion.h1>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-lg md:text-xl text-purple-200 mt-6 max-w-2xl"
      >
        Procrastinot helps you focus with Pomodoro, AI task planning, mood tracking, and learning tools — all in one place.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-10 flex gap-4"
      >
        <Link
          to="/register"
          className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl text-lg font-semibold transition"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="border border-white text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-white hover:text-purple-700 transition"
        >
          Login
        </Link>
      </motion.div>
    </section>
  );
}
