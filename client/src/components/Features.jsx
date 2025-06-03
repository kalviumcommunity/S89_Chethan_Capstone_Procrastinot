import { RocketIcon, TimerIcon, SmileIcon, BrainIcon, CalendarIcon, GraduationCapIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'Pomodoro Timer',
    description: 'Boost focus with the proven Pomodoro technique.',
    icon: <TimerIcon className="w-8 h-8 text-purple-600" />,
  },
  {
    title: 'Mood Tracker',
    description: 'Track how you feel before and after each session.',
    icon: <SmileIcon className="w-8 h-8 text-purple-600" />,
  },
  {
    title: 'AI Task Assistant',
    description: 'Get smart breakdowns of your tasks using AI.',
    icon: <BrainIcon className="w-8 h-8 text-purple-600" />,
  },
  {
    title: 'Task Management',
    description: 'Organize and prioritize your tasks effortlessly.',
    icon: <CalendarIcon className="w-8 h-8 text-purple-600" />,
  },
  {
    title: 'Daily Challenges',
    description: 'Stay motivated with small daily productivity goals.',
    icon: <RocketIcon className="w-8 h-8 text-purple-600" />,
  },
  {
    title: 'Skill Building',
    description: 'Enhance your knowledge with curated learning resources.',
    icon: <GraduationCapIcon className="w-8 h-8 text-purple-600" />,
  },
];

export default function Features() {
  return (
    <section className="bg-white text-gray-900 py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-10">What You Get</h2>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-purple-50 p-6 rounded-2xl shadow-md hover:shadow-xl transition"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-gray-600 mt-2">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
