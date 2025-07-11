import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';
import { useTheme } from '../contexts/ThemeContext';

export default function LandingPage() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-mesh text-white' : 'bg-gradient-to-br from-slate-50 to-blue-50 text-gray-900'} relative overflow-hidden`}>
      {/* Animated Background */}
      <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-dark-900/50 via-primary-900/30 to-secondary-900/50' : 'bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50'}`} />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Features />
        <Footer />
      </div>
    </div>
  );
}
