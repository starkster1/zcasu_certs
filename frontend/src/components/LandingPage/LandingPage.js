// LandingPage.js

import { Link } from 'react-router-dom';
import React, { useState } from "react"; 
import { FaSearch, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import styles from './LandingPage.module.css';

const LandingPage = () => {
  const [certificateId, setCertificateId] = useState("");

  const handleVerification = (e) => {
    e.preventDefault();
    console.log("Verifying certificate:", certificateId);
  };

  const navigation = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <div className={styles.minHScreen}>
      <header className={styles.header}>
        <nav className={styles.navContainer}>
          <div className={styles.navContent}>
            <div className={styles.logoSection}>
              <img
                src="https://esis.zcasu.edu.zm/templates//zcasu/images/header.png"
                alt="ZCAS University Logo"
                className={styles.logo}
              />
              <span className={styles.logoText}>ZCAS University</span>
            </div>
            <div className={styles.navigationLinks}>
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={styles.navLink}
                >
                  {item.name}
                </a>
              ))}
              <Link to="/signin" className={styles.loginButton}>Get Started</Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Make main content scrollable */}
      <div className={styles.mainContent}>
        <main>
          <section className={styles.heroSection}>
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                Blockchain Certificate Verification System
              </h1>
              <p className={styles.heroSubtitle}>
                Verify your ZCAS University certificates securely and instantly
              </p>
              <form onSubmit={handleVerification} className={styles.formContainer}>
                <div className={styles.formRow}>
                  <input
                    type="text"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                    placeholder="Enter Certificate ID"
                    className={styles.inputField}
                  />
                  <button
                    type="submit"
                    className={styles.verifyButton}
                  >
                    <FaSearch className={styles.searchIcon} />
                    Verify Certificate
                  </button>
                </div>
              </form>
            </div>
          </section>

          <section className={styles.howItWorksSection}>
            <div className={styles.container}>
              <h2 className={styles.sectionTitle}>
                How It Works
              </h2>
              <div className={styles.stepsGrid}>
                {[
                  {
                    title: "Upload Certificate",
                    description: "Submit your certificate ID for verification",
                  },
                  {
                    title: "Blockchain Verification",
                    description: "Our system verifies the certificate authenticity",
                  },
                  {
                    title: "Get Results",
                    description: "Receive instant verification results",
                  },
                ].map((step, index) => (
                  <div
                    key={index}
                    className={styles.stepCard}
                  >
                    <h3 className={styles.stepTitle}>
                      {step.title}
                    </h3>
                    <p className={styles.stepDescription}>{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <footer className={styles.footer}>
          <div className={styles.footerContainer}>
            <div className={styles.footerGrid}>
              <div>
                <h3 className={styles.footerHeading}>Contact Us</h3>
                <div className={styles.contactInfo}>
                  <p className={styles.contactItem}>
                    <FaPhone className={styles.icon} /> +260 211 232093 / 5
                  </p>
                  <p className={styles.contactItem}>
                    <FaEnvelope className={styles.icon} /> info@zcasu.edu.zm
                  </p>
                  <p className={styles.contactItem}>
                    <FaMapMarkerAlt className={styles.icon} /> Dedan Kimathi Road, Lusaka, Zambia
                  </p>
                </div>
              </div>
              <div>
                <h3 className={styles.footerHeading}>Quick Links</h3>
                <ul className={styles.quickLinks}>
                  <li><Link to="#" className={styles.quickLink}>About Us</Link></li>
                  <li><Link to="#" className={styles.quickLink}>Programs</Link></li>
                  <li><Link to="#" className={styles.quickLink}>Student Portal</Link></li>
                </ul>
              </div>
              <div>
                <h3 className={styles.footerHeading}>Follow Us</h3>
                <p className={styles.socialText}>Stay connected with us on social media</p>
                <div className={styles.socialIcons}>
                  <FaFacebook className="text-2xl text-gray-400 hover:text-white cursor-pointer" />
                  <FaTwitter className="text-2xl text-gray-400 hover:text-white cursor-pointer" />
                  <FaLinkedin className="text-2xl text-gray-400 hover:text-white cursor-pointer" />
                  <FaInstagram className="text-2xl text-gray-400 hover:text-white cursor-pointer" />
                </div>
              </div>
            </div>
            <div className={styles.footerBottom}>
              <p>© 2024 ZCAS University. All rights reserved.</p>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default LandingPage;
