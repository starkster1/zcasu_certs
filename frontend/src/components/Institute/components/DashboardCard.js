import React from 'react';
import styles from './DashboardCard.module.css';

const DashboardCard = ({ title, value, icon }) => (
  <div className={`${styles.card} relative`}>
    {/* Decorative Ribbon */}
    <div className={styles.ribbon}></div>
    <div className={styles.iconContainer}>
      {React.cloneElement(icon, { className: `${styles.icon}` })}
    </div>
    <div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.value}>{value}</p>
    </div>
  </div>
);

export default DashboardCard;
