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
  { id: 'skills', label: 'Skills', icon: SkillsIcon },
  { id: 'daily_challenges', label: 'Daily Challenges', icon: ChallengeIcon }
];

const NavigationMenu = ({ activeItem, onNavigate }) => {
  return (
    <nav className={styles.navigationMenu}>
      {navigationItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeItem === item.id;
        
        return (
          <button
            key={item.id}
            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            onClick={() => onNavigate(item.id)}
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