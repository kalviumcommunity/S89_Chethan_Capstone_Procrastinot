import UserProfile from './UserProfile';
import NavigationMenu from './NavigationMenu';
import styles from './DashboardNavbar.module.css';

const DashboardNavbar = ({ user, activeRoute, onNavigate, onLogout }) => {
  return (
    <header className={`${styles.navbar} dashboard-glass`}>
      <div className={styles.navbarContent}>
        <div className={styles.leftSection}>
          <div className={styles.brand}>
            <span className={styles.brandName}>Procrastinot</span>
          </div>
        </div>
        
        <div className={styles.centerSection}>
          <NavigationMenu 
            activeItem={activeRoute} 
            onNavigate={onNavigate} 
          />
        </div>
        
        <div className={styles.rightSection}>
          <UserProfile user={user} onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;