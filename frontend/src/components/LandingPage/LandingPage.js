import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import styles from "./LandingPage.module.css";
import Features from "./Features";
import Footer from "./Footer";

const LandingPage = () => {
  const [certificateId, setCertificateId] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);

  const handleVerification = (e) => {
    e.preventDefault();
    console.log("Verifying certificate:", certificateId);

    // Simulate verification result for demonstration
    setVerificationResult({
      isValid: true,
      institute: "ZCAS University",
      student: "John Doe",
      timestamp: 1634083200, // Example timestamp
    });
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const navigation = [
    { name: "Home", sectionId: "home" },
    { name: "About", sectionId: "about" },
    { name: "Services", sectionId: "services" },
    { name: "Contact", sectionId: "contact" },
  ];

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
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
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.sectionId)}
                  className={styles.navLink}
                >
                  {item.name}
                </button>
              ))}
              <Link to="/signin" className={styles.loginButton}>
                Get Started
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <div className={styles.scrollableContent}>
        {/* Main Content */}
        <main className={styles.mainContent}>
          {/* Home Section */}
          <div id="home" className={styles.textCenter}>
            <div className={styles.logoWrapper}>
              <img
                src="https://esis.zcasu.edu.zm/templates//zcasu/images/header.png"
                alt="University Logo"
                className={styles.mainLogo}
              />
            </div>
            <h1 className={styles.mainHeading}>
              Secure Certificate Management
            </h1>
            <h2 className={styles.highlight}>on the Blockchain</h2>

            <p className={styles.description}>
              ZCASU-Certs provides a secure, decentralized platform for managing
              academic certificates. Powered by blockchain technology for
              tamper-proof verification.
            </p>

            {/* Verification Section */}
            <div className={styles.verificationSection}>
              <form
                onSubmit={handleVerification}
                className={styles.verificationForm}
              >
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                    placeholder="Enter Certificate ID to verify"
                    className={styles.inputField}
                  />
                  <button type="submit" className={styles.verifyButton}>
                    <FaSearch className={styles.icon} />
                    Verify
                  </button>
                </div>
              </form>

              {verificationResult && (
                <div className={styles.resultContainer}>
                  <h3 className={styles.resultTitle}>Verification Result</h3>
                  <dl className={styles.resultDetails}>
                    <div className={styles.detailItem}>
                      <dt className={styles.detailLabel}>Status</dt>
                      <dd className={styles.detailValue}>
                        {verificationResult.isValid ? "Valid" : "Invalid"}
                      </dd>
                    </div>
                    <div className={styles.detailItem}>
                      <dt className={styles.detailLabel}>Issuing Institute</dt>
                      <dd className={styles.detailValue}>
                        {verificationResult.institute}
                      </dd>
                    </div>
                    <div className={styles.detailItem}>
                      <dt className={styles.detailLabel}>Student</dt>
                      <dd className={styles.detailValue}>
                        {verificationResult.student}
                      </dd>
                    </div>
                    <div className={styles.detailItem}>
                      <dt className={styles.detailLabel}>Issue Date</dt>
                      <dd className={styles.detailValue}>
                        {new Date(
                          verificationResult.timestamp * 1000
                        ).toLocaleDateString()}
                      </dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>
          </div>

          {/* About Section */}
          <section id="about" className={styles.howItWorksSection}>
            <div className={styles.container}>
              <h2 className={styles.sectionTitle}>How It Works</h2>
              <div className={styles.stepsGrid}>
                {[
                  {
                    title: "Upload Certificate",
                    description: "Submit your certificate ID for verification",
                  },
                  {
                    title: "Blockchain Verification",
                    description:
                      "Our system verifies the certificate authenticity",
                  },
                  {
                    title: "Get Results",
                    description: "Receive instant verification results",
                  },
                ].map((step, index) => (
                  <div key={index} className={styles.stepCard}>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepDescription}>
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section id="services">
            <Features />
          </section>

          {/* Footer (Contact Section) */}
          <section id="contact">
            <Footer />
          </section>
        </main>
      </div>
    </div>
  );
};

export default LandingPage;
