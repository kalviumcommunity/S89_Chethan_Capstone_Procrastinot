import { useState } from 'react';
import AuthModal from '../AuthModal/AuthModal';
import styles from './Header.module.css';

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGetStartedClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.brandName}>Procrastinot</span>
        </div>
        <div className={styles.authButtons}>
          <button className="btn btn-primary" onClick={handleGetStartedClick}>
            Get Started
          </button>
        </div>
      </header>
      
      <AuthModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialMode="signup"
      />
    </>
  );
};

export default Header;