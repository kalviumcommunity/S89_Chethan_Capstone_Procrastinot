import styles from './DashboardCard.module.css';

const DashboardCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: IconComponent, 
  onClick, 
  className = '',
  variant = 'default'
}) => {
  return (
    <div 
      className={`${styles.dashboardCard} ${styles[variant]} ${className} dashboard-glass card-3d`}
      onClick={onClick}
    >
      <div className={styles.cardHeader}>
        {IconComponent && (
          <div className={styles.iconContainer}>
            <IconComponent 
              width={24} 
              height={24} 
              color="var(--color-primary)" 
            />
          </div>
        )}
        <h3 className={`${styles.cardTitle} heading-md`}>{title}</h3>
      </div>
      
      <div className={styles.cardContent}>
        <div className={styles.valueContainer}>
          <span className={`${styles.cardValue} heading-xl`}>{value}</span>
          {subtitle && (
            <span className={`${styles.cardSubtitle} text-sm`}>{subtitle}</span>
          )}
        </div>
      </div>
      
      <div className={styles.cardGlow}></div>
    </div>
  );
};

export default DashboardCard;