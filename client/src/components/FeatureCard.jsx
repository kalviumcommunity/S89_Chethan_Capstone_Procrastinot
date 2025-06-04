// src/components/FeatureCard.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function FeatureCard({ title, description, icon, to }) {
  return (
    <motion.div
      className="bg-purple-50 p-6 rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
    >
      <Link to={to} className="block text-gray-800">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-600 mt-2">{description}</p>
      </Link>
    </motion.div>
  );
}
