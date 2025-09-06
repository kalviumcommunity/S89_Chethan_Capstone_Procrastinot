import { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import styles from './AuthModal.module.css';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [authMode, setAuthMode] = useState(initialMode);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleModeChange = (mode) => {
    setAuthMode(mode);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`${styles.modalOverlay} ${isVisible ? styles.visible : ''}`}
      onClick={handleOverlayClick}
    >
      <div className={`${styles.modalContainer} glass-form`}>
        <button 
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Close modal"
        >
          <span className={styles.closeIcon}>×</span>
        </button>

        <div className={styles.modalContent}>
          {authMode === 'login' ? (
            <LoginForm onModeChange={handleModeChange} onClose={handleClose} />
          ) : (
            <SignupForm onModeChange={handleModeChange} onClose={handleClose} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;