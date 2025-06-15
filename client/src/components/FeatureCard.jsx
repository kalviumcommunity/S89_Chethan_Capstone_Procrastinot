// src/components/FeatureCard.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function FeatureCard({ title, description, icon, to, gradient = "from-primary-500 to-secondary-500" }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="group relative overflow-hidden"
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link to={to} className="block">
        {/* Main Card */}
        <div className="relative card-glass p-8 h-full min-h-[280px] flex flex-col">
          {/* Background Gradient Overlay */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.1 }}
          />

          {/* Sparkle Effect */}
          <motion.div
            className="absolute top-4 right-4 text-white/30"
            animate={isHovered ? { rotate: 180, scale: 1.2 } : { rotate: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Sparkles size={20} />
          </motion.div>

          {/* Icon Container */}
          <motion.div
            className="relative mb-6"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors duration-300">
              <div className="text-white group-hover:scale-110 transition-transform duration-200">
                {icon}
              </div>
            </div>

            {/* Glow Effect */}
            <motion.div
              className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 0.2 }}
            />
          </motion.div>

          {/* Content */}
          <div className="flex-1 flex flex-col">
            <motion.h3
              className="text-xl font-display font-semibold text-white mb-3 group-hover:text-primary-200 transition-colors duration-200"
              layoutId={`title-${title}`}
            >
              {title}
            </motion.h3>

            <motion.p
              className="text-white/70 text-sm leading-relaxed flex-1 group-hover:text-white/80 transition-colors duration-200"
              layoutId={`description-${title}`}
            >
              {description}
            </motion.p>

            {/* Action Area */}
            <motion.div
              className="flex items-center justify-between mt-6 pt-4 border-t border-white/10"
              initial={{ opacity: 0.7 }}
              whileHover={{ opacity: 1 }}
            >
              <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
                Explore
              </span>

              <motion.div
                className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors duration-200"
                whileHover={{ x: 5 }}
              >
                <span className="text-sm font-medium">Launch</span>
                <ArrowRight size={16} />
              </motion.div>
            </motion.div>
          </div>

          {/* Hover Border Effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/20 transition-colors duration-300"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          />
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-accent-400 to-secondary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          animate={isHovered ? { scale: [1, 1.2, 1], rotate: 360 } : { scale: 1 }}
          transition={{ duration: 0.5 }}
        />

        <motion.div
          className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          animate={isHovered ? { scale: [1, 1.3, 1], rotate: -360 } : { scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        />
      </Link>
    </motion.div>
  );
}
