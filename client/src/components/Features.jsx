import { motion } from 'framer-motion';
import { TimerIcon, SmileIcon, BrainIcon, CalendarIcon, RocketIcon, GraduationCapIcon, Sparkles, Zap } from 'lucide-react';

const features = [
  {
    title: 'Pomodoro Timer',
    description: 'Boost focus with scientifically-proven time management techniques and smart break reminders.',
    icon: <TimerIcon className="w-8 h-8" />,
    gradient: 'from-red-500 to-orange-500',
    to: '/pomodoro'
  },
  {
    title: 'Mood Tracker',
    description: 'Monitor your emotional journey and discover patterns that boost your productivity.',
    icon: <SmileIcon className="w-8 h-8" />,
    gradient: 'from-yellow-500 to-pink-500',
    to: '/mood'
  },
  {
    title: 'AI Task Assistant',
    description: 'Get intelligent task breakdowns and personalized productivity recommendations.',
    icon: <BrainIcon className="w-8 h-8" />,
    gradient: 'from-purple-500 to-indigo-500',
    to: '/ai-tasks'
  },
  {
    title: 'Task Management',
    description: 'Organize, prioritize, and track your tasks with our intuitive management system.',
    icon: <CalendarIcon className="w-8 h-8" />,
    gradient: 'from-blue-500 to-cyan-500',
    to: '/tasks'
  },
  {
    title: 'Daily Challenges',
    description: 'Stay motivated with gamified productivity missions and achievement rewards.',
    icon: <RocketIcon className="w-8 h-8" />,
    gradient: 'from-green-500 to-emerald-500',
    to: '/challenges'
  },
  {
    title: 'Skill Building',
    description: 'Accelerate your learning with curated content and progress tracking.',
    icon: <GraduationCapIcon className="w-8 h-8" />,
    gradient: 'from-violet-500 to-purple-500',
    to: '/skills'
  },
];

export default function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="features" className="relative py-24 px-6 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-primary-400/10 to-secondary-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-accent-400/10 to-primary-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-white/90 text-sm font-medium mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles size={16} className="text-accent-400" />
            <span>Powerful Features</span>
            <Zap size={16} className="text-primary-400" />
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
            Everything You Need to
            <span className="text-gradient block mt-2">Succeed</span>
          </h2>

          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Discover a comprehensive suite of tools designed to transform your productivity
            and help you achieve your goals faster than ever before.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-8 md:gap-10 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              {/* Feature Card */}
              <div className="card-glass p-8 h-full min-h-[320px] flex flex-col relative overflow-hidden">
                {/* Background Gradient */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`}
                  whileHover={{ opacity: 0.05 }}
                />

                {/* Icon */}
                <motion.div
                  className="mb-6"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} bg-opacity-20 backdrop-blur-sm flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors duration-300`}>
                    <div className="text-white group-hover:scale-110 transition-transform duration-200">
                      {feature.icon}
                    </div>
                  </div>
                </motion.div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-xl font-display font-semibold text-white mb-4 group-hover:text-primary-200 transition-colors duration-200">
                    {feature.title}
                  </h3>

                  <p className="text-white/70 text-sm leading-relaxed flex-1 group-hover:text-white/80 transition-colors duration-200">
                    {feature.description}
                  </p>

                  {/* Learn More Link */}
                  <motion.div
                    className="mt-6 pt-4 border-t border-white/10"
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-sm font-medium text-white/60 group-hover:text-white/80 transition-colors duration-200 cursor-pointer">
                      Learn more →
                    </span>
                  </motion.div>
                </div>

                {/* Hover Border Effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/10 transition-colors duration-300"
                  whileHover={{ opacity: 1 }}
                />
              </div>

              {/* Floating Accent */}
              <motion.div
                className={`absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br ${feature.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-white/60 text-lg mb-6">
            Ready to transform your productivity?
          </p>
          <motion.button
            className="btn-primary text-lg px-8 py-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = "/register"}
          >
            Get Started Today
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
