import HomeIcon from '../icons/HomeIcon';
import PlanIcon from '../icons/PlanIcon';
import TimerIcon from '../icons/TimerIcon';
import SkillsIcon from '../icons/SkillsIcon';
import ChallengeIcon from '../icons/ChallengeIcon';
import styles from './NavigationMenu.module.css';

const navigationItems = [
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'smart_plan', label: 'Smart Plan', icon: PlanIcon },
  { id: 'pomodoro', label: 'Pomodoro', icon: TimerIcon },
  { id: 'eduspace', label: 'EduSpace', icon: ChallengeIcon }
];

const NavigationMenu = ({ activeItem, onNavigate }) => {
  const handleClick = (id) => {
    if (id === 'smart_plan') {
      window.history.pushState({}, '', '/smart-plan');
      window.location.reload();
      return;
    }
    if (id === 'pomodoro') {
      window.history.pushState({}, '', '/pomodoro');
      window.location.reload();
      return;
    }
    if (id === 'home') {
      window.history.pushState({}, '', '/dashboard');
      window.location.reload();
      return;
    }
    if (id === 'eduspace') {
      window.history.pushState({}, '', '/eduspace');
      window.location.reload();
      return;
    }
    if (onNavigate) onNavigate(id);
  };

  return (
    <nav className={styles.navigationMenu}>
      {navigationItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeItem === item.id;
        
        return (
          <button
            key={item.id}
            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            onClick={() => handleClick(item.id)}
          >
            <IconComponent 
              width={20} 
              height={20} 
              color={isActive ? 'var(--color-primary)' : 'var(--color-text-primary)'} 
            />
            <span className={styles.navLabel}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default NavigationMenu;