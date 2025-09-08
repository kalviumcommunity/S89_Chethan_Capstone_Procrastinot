import styles from './QuickActionButton.module.css';

const QuickActionButton = ({ 
  label, 
  icon: IconComponent, 
  onClick, 
  variant = 'primary',
  size = 'medium',
  className = ''
}) => {
  return (
    <button 
      className={`${styles.quickActionButton} ${styles[variant]} ${styles[size]} ${className} dashboard-glass`}
      onClick={onClick}
    >
      {IconComponent && (
        <IconComponent 
          width={size === 'large' ? 24 : 20} 
          height={size === 'large' ? 24 : 20} 
          color="currentColor" 
        />
      )}
      <span className={styles.buttonLabel}>{label}</span>
      <div className={styles.buttonGlow}></div>
    </button>
  );
};

export default QuickActionButton;