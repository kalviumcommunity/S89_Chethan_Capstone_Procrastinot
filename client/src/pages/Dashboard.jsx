// src/pages/Dashboard.jsx
import Navbar from '../components/Navbar1';
import Footer from '../components/Footer';
import FeatureCard from '../components/FeatureCard';
import { TimerIcon, SmileIcon, BrainIcon, CalendarIcon, RocketIcon, GraduationCapIcon } from 'lucide-react';

export default function Dashboard() {
  const features = [
    {
      title: 'Pomodoro Timer',
      description: 'Boost focus with the proven Pomodoro technique.',
      icon: <TimerIcon className="w-8 h-8 text-purple-600" />,
      to: '/pomodoro',
    },
    {
      title: 'Mood Tracker',
      description: 'Track how you feel before and after each session.',
      icon: <SmileIcon className="w-8 h-8 text-purple-600" />,
      to: '/mood',
    },
    {
      title: 'AI Task Assistant',
      description: 'Get smart breakdowns of your tasks using AI.',
      icon: <BrainIcon className="w-8 h-8 text-purple-600" />,
      to: '/ai-tasks',
    },
    {
      title: 'Task Management',
      description: 'Organize and prioritize your tasks effortlessly.',
      icon: <CalendarIcon className="w-8 h-8 text-purple-600" />,
      to: '/tasks',
    },
    {
      title: 'Daily Challenges',
      description: 'Stay motivated with daily productivity missions.',
      icon: <RocketIcon className="w-8 h-8 text-purple-600" />,
      to: '/challenges',
    },
    {
      title: 'Skill Building',
      description: 'Learn new skills with curated YouTube content.',
      icon: <GraduationCapIcon className="w-8 h-8 text-purple-600" />,
      to: '/skills',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 to-indigo-900 text-white">
      <Navbar />

      <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome Back!</h1>
        <p className="text-purple-200 text-lg mb-12">
          Choose a tool to get started
        </p>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
        <Footer />
    </div>
        
  );
}
