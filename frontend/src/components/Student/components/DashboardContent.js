import React from 'react';
import styles from './DashboardContent.module.css';

const DashboardContent = ({ userName, isWaving }) => (
  <div className={styles.dashboardContent}>
    <h1 className={styles.dashboardHeading}>
      Welcome back {userName}!{" "}
      <span className={isWaving ? styles.waveHand : ""}>🖐️</span>

    </h1>

    {/* Blockchain Certificate Verification System Placeholder */}
    <section className={`${styles.dashboardSection} ${styles.mb6}`}>
      <h2 className={styles.sectionTitle}>Blockchain Certificate Verification</h2>
      <p className={styles.sectionText}>
        This section will include features for verifying certificates using blockchain technology.
      </p>
      <button className={styles.verifyBtn}>Verify Certificate</button>
    </section>

    {/* Additional Dashboard Sections */}
    <div className={styles.dashboardGrid}>
      <div className={styles.dashboardSection}>
        <h3 className={styles.sectionTitle}>Recent Activity</h3>
        <ul className={styles.sectionList}>
          <li>Completed Course: Web Development</li>
          <li>Submitted Assignment: Data Structures</li>
          <li>Registered for: Machine Learning 101</li>
        </ul>
      </div>
      <div className={styles.dashboardSection}>
        <h3 className={styles.sectionTitle}>Upcoming Events</h3>
        <ul className={styles.sectionList}>
          <li>Guest Lecture: AI in Education (Tomorrow)</li>
          <li>Mid-term Exams (Next Week)</li>
          <li>Career Fair (In 2 Weeks)</li>
        </ul>
      </div>
      <div className={styles.dashboardSection}>
        <h3 className={styles.sectionTitle}>Quick Links</h3>
        <ul className={styles.sectionList}>
          <li><a href="#" className={styles.quickLink}>Course Catalog</a></li>
          <li><a href="#" className={styles.quickLink}>Student Handbook</a></li>
          <li><a href="#" className={styles.quickLink}>Academic Calendar</a></li>
        </ul>
      </div>
    </div>
  </div>
);

export default DashboardContent;