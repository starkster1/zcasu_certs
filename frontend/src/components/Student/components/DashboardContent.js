// src/components/DashboardContent.js
import React from 'react';

const DashboardContent = ({ userName, isWaving }) => (
  <div className="p-6">
    <h1 className="dashboard-heading">
      Welcome back {userName}!{" "}
      <span className={isWaving ? "wave-hand" : ""}>🖐️</span>
    </h1>

    {/* Blockchain Certificate Verification System Placeholder */}
    <section className="dashboard-section mb-6">
      <h2 className="section-title">Blockchain Certificate Verification</h2>
      <p className="section-text">
        This section will include features for verifying certificates using blockchain technology.
      </p>
      <button className="verify-btn">Verify Certificate</button>
    </section>

    {/* Additional Dashboard Sections */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="dashboard-section">
        <h3 className="section-title">Recent Activity</h3>
        <ul className="section-list">
          <li>Completed Course: Web Development</li>
          <li>Submitted Assignment: Data Structures</li>
          <li>Registered for: Machine Learning 101</li>
        </ul>
      </div>
      <div className="dashboard-section">
        <h3 className="section-title">Upcoming Events</h3>
        <ul className="section-list">
          <li>Guest Lecture: AI in Education (Tomorrow)</li>
          <li>Mid-term Exams (Next Week)</li>
          <li>Career Fair (In 2 Weeks)</li>
        </ul>
      </div>
      <div className="dashboard-section">
        <h3 className="section-title">Quick Links</h3>
        <ul className="section-list">
          <li><a href="#" className="quick-link">Course Catalog</a></li>
          <li><a href="#" className="quick-link">Student Handbook</a></li>
          <li><a href="#" className="quick-link">Academic Calendar</a></li>
        </ul>
      </div>
    </div>
  </div>
);

export default DashboardContent;
