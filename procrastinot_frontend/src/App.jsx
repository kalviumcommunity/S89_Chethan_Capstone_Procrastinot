import { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import HeroSection from './components/HeroSection/HeroSection';
import FeatureCards from './components/FeatureCards/FeatureCards';
import ShowcaseSection from './components/ShowcaseSection/ShowcaseSection';
import AnimationElement from './components/AnimationElement/AnimationElement';
import AboutSection from './components/AboutSection/AboutSection';
import Footer from './components/Footer/Footer';
import AuthModal from './components/AuthModal/AuthModal';
import SuccessPage from './components/SuccessPage/SuccessPage';
import AuthCallback from './components/AuthCallback/AuthCallback';
import authService from './services/authService';
import './index.css';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    // Simple routing based on URL path
    const path = window.location.pathname;
    if (path === '/success') {
      setCurrentPage('success');
    } else if (path === '/auth/callback') {
      setCurrentPage('callback');
    } else {
      setCurrentPage('home');
    }

    // Check if user is already authenticated
    if (authService.isAuthenticated() && path === '/') {
      setCurrentPage('success');
      window.history.pushState({}, '', '/success');
    }

    const handleOpenAuthModal = (event) => {
      setIsAuthModalOpen(true);
    };

    window.addEventListener('openAuthModal', handleOpenAuthModal);

    return () => {
      window.removeEventListener('openAuthModal', handleOpenAuthModal);
    };
  }, []);

  const handleCloseModal = () => {
    setIsAuthModalOpen(false);
  };

  // Render different pages based on current route
  if (currentPage === 'success') {
    return <SuccessPage />;
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
