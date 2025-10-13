import { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import HeroSection from './components/HeroSection/HeroSection';
import FeatureCards from './components/FeatureCards/FeatureCards';
import ShowcaseSection from './components/ShowcaseSection/ShowcaseSection';
import AnimationElement from './components/AnimationElement/AnimationElement';
import AboutSection from './components/AboutSection/AboutSection';
import AIShowcase from './components/AIShowcase/AIShowcase';
import Footer from './components/Footer/Footer';
import AuthModal from './components/AuthModal/AuthModal';
import Dashboard from './components/Dashboard/Dashboard';
import AuthCallback from './components/AuthCallback/AuthCallback';
import authService from './services/authService';
import prewarmService from './services/prewarmService';
import './index.css';
import SmartPlan from './components/SmartPlan/SmartPlan';
import Pomodoro from './components/Pomodoro/Pomodoro';
import EduSpace from './components/EduSpace/EduSpace';
import ChatBot from './components/ChatBot/ChatBot';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(null);
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      const path = window.location.pathname;
      
      // Determine page based on path
      let page = 'home';
      if (path === '/dashboard') page = 'dashboard';
      else if (path === '/smart-plan') page = 'smart_plan';
      else if (path === '/pomodoro') page = 'pomodoro';
      else if (path === '/eduspace') page = 'eduspace';
      else if (path === '/auth/callback') page = 'callback';
      
      // Check authentication for protected routes
      const protectedRoutes = ['dashboard', 'smart_plan', 'pomodoro', 'eduspace'];
      if (protectedRoutes.includes(page) && !authService.isAuthenticated()) {
        page = 'home';
        window.history.pushState({}, '', '/');
      }
      
      // Redirect authenticated users from home to dashboard
      if (authService.isAuthenticated() && path === '/') {
        page = 'dashboard';
        window.history.pushState({}, '', '/dashboard');
      }
      
      setCurrentPage(page);
      setIsInitializing(false);
    };
    
    initializeApp();

    const handleOpenAuthModal = (event) => {
      setIsAuthModalOpen(true);
    };

    window.addEventListener('openAuthModal', handleOpenAuthModal);

    // Initialize backend prewarming
    prewarmService.initialPrewarm();
    prewarmService.startPeriodicPrewarm();

    // Mark app as loaded after initial setup
    setTimeout(() => setIsAppLoaded(true), 300);

    return () => {
      window.removeEventListener('openAuthModal', handleOpenAuthModal);
    };
  }, []);

  const handleCloseModal = () => {
    setIsAuthModalOpen(false);
  };

  // Show loading screen during initialization
  if (isInitializing || currentPage === null) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #dc2626 50%, #000000 100%)',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
          <p>Loading Procrastinot...</p>
        </div>
      </div>
    );
  }

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

  if (currentPage === 'eduspace') {
    return (
      <>
        <EduSpace />
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
      <AIShowcase />
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
