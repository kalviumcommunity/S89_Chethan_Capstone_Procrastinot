import { useState } from 'react';
import MenuIcon from '../icons/MenuIcon';
import styles from './UserProfile.module.css';

const UserProfile = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    onLogout();
  };

  if (!user) {
    return null;
  }

  return (
    <div className={styles.userProfile}>
      <div className={styles.profileInfo}>
        <img 
          src={user.avatar || user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || user.name || user.email?.split('@')[0] || 'User')}&background=0F0F0F&color=fff&size=40`} 
          alt={user.username || user.name || 'User'}
          className={styles.avatar}
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || user.name || user.email?.split('@')[0] || 'User')}&background=0F0F0F&color=fff&size=40`;
          }}
        />
        <div className={styles.userDetails}>
          <span className={styles.userName}>{user.username || user.name || user.email?.split('@')[0] || 'User'}</span>
          <span className={styles.userStatus}>{user.status || 'Active'}</span>
        </div>
      </div>
      
      <div className={styles.menuContainer}>
        <button 
          className={styles.menuButton}
          onClick={toggleMenu}
          aria-label="User menu"
        >
          <MenuIcon width={20} height={20} color="var(--color-text-primary)" />
        </button>
        
        {isMenuOpen && (
          <div className={`${styles.dropdownMenu} glass`}>
            <button className={styles.menuItem}>
              Profile Settings
            </button>
            <button className={styles.menuItem}>
              Preferences
            </button>
            <button className={styles.menuItem}>
              Help & Support
            </button>
            <hr className={styles.menuDivider} />
            <button 
              className={`${styles.menuItem} ${styles.logoutItem}`}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
      
      {isMenuOpen && (
        <div 
          className={styles.overlay}
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default UserProfile;