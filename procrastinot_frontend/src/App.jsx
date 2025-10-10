import { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import HeroSection from './components/HeroSection/HeroSection';
import FeatureCards from './components/FeatureCards/FeatureCards';
import ShowcaseSection from './components/ShowcaseSection/ShowcaseSection';
import AnimationElement from './components/AnimationElement/AnimationElement';
import AboutSection from './components/AboutSection/AboutSection';
import Footer from './components/Footer/Footer';
import AuthModal from './components/AuthModal/AuthModal';
import Dashboard from './components/Dashboard/Dashboard';
import AuthCallback from './components/AuthCallback/AuthCallback';
import authService from './services/authService';
import prewarmService from './services/prewarmService';
import './index.css';
import SmartPlan from './components/SmartPlan/SmartPlan';
import Pomodoro from './components/Pomodoro/Pomodoro';
import ChatBot from './components/ChatBot/ChatBot';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [isAppLoaded, setIsAppLoaded] = useState(false);

  useEffect(() => {
    // Simple routing based on URL path
    const path = window.location.pathname;
    
    if (path === '/dashboard') {
      setCurrentPage('dashboard');
    } else if (path === '/smart-plan') {
      setCurrentPage('smart_plan');
    } else if (path === '/pomodoro') {
      setCurrentPage('pomodoro');
    } else if (path === '/auth/callback') {
      setCurrentPage('callback');
    } else {
      setCurrentPage('home');
    }

    // Check if user is already authenticated and redirect only if they're on home page
    if (authService.isAuthenticated() && path === '/') {
      setCurrentPage('dashboard');
      window.history.pushState({}, '', '/dashboard');
    }

    const handleOpenAuthModal = (event) => {
      setIsAuthModalOpen(true);
    };

    window.addEventListener('openAuthModal', handleOpenAuthModal);

    // Initialize backend prewarming
    prewarmService.initialPrewarm();
    prewarmService.startPeriodicPrewarm();

    // Mark app as loaded after initial setup
    setTimeout(() => setIsAppLoaded(true), 500);

    return () => {
      window.removeEventListener('openAuthModal', handleOpenAuthModal);
    };
  }, []);

  const handleCloseModal = () => {
    setIsAuthModalOpen(false);
  };

  // Render different pages based on current route
  if (currentPage === 'dashboard') {
    return (
      <>
        <Dashboard />
        {authService.isAuthenticated() && isAppLoaded && <ChatBot />}
      </>
    );
  }

  if (currentPage === 'smart_plan') {
    return (
      <>
        <SmartPlan />
        {authService.isAuthenticated() && isAppLoaded && <ChatBot />}
      </>
    );
  }

  if (currentPage === 'pomodoro') {
    return (
      <>
        <Pomodoro />
        {authService.isAuthenticated() && isAppLoaded && <ChatBot />}
      </>
    );
  }

  if (currentPage === 'callback') {
    return <AuthCallback />;
  }

  return (
    <div className="App">
      <Header />
      <HeroSection />
      <FeatureCards />
      <ShowcaseSection />
      <AnimationElement />
      <AboutSection />
      <Footer />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseModal}
        initialMode="signup"
      />
    </div>
  );
}

export default App;
