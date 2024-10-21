import React, { useState } from 'react';
import { Link } from 'react-router-dom';  // Import the Link component
import { FaHome, FaInfoCircle, FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './LandingPage.css';

const LandingPage = () => {
  const [certificateId, setCertificateId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const handleVerify = (e) => {
    e.preventDefault();
    setIsVerifying(true);
    // Simulating verification process
    setTimeout(() => {
      setVerificationResult(Math.random() > 0.5 ? 'valid' : 'invalid');
      setIsVerifying(false);
    }, 2000);
  };

  return (
    <div className="landing-page">
      <header className="header">
        <div className="header-container">
          <img
            src="https://example.com/zcas-logo.png"
            alt="ZCAS University Logo"
            className="logo"
          />
          <nav>
            <ul className="nav-links">
              <li>
                <a href="#home" className="nav-link">
                  <FaHome className="icon" />
                  Home
                </a>
              </li>
              <li>
                <a href="#contact" className="nav-link">
                  <FaEnvelope className="icon" />
                  Contact
                </a>
              </li>
              <li>
                <a href="#about" className="nav-link">
                  <FaInfoCircle className="icon" />
                  About
                </a>
              </li>
              
            </ul>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-12"
        >
          <h1 className="title">Blockchain Certificate Verification</h1>
        </motion.header>

        <form onSubmit={handleVerify} className="mb-12">
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <input
              type="text"
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
              placeholder="Enter Certificate ID"
              className="w-full sm:w-96 px-4 py-2 rounded-md border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
              aria-label="Certificate ID"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
              disabled={isVerifying}
            >
              {isVerifying ? 'Verifying...' : 'Verify Certificate'}
            </motion.button>
          </div>
        </form>
        {verificationResult && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-md ${verificationResult === 'valid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
          >
            <FaCheckCircle className="inline-block mr-2" />
            {verificationResult === 'valid' ? 'Certificate is valid!' : 'Certificate is invalid. Please check the ID and try again.'}
          </motion.div>
        )}
        <div className="button-group">
          <Link to="/signup" className="signup-button">Sign Up</Link>  {/* Link to Sign Up */}
          <Link to="/signin" className="login-button">Login</Link>    {/* Link to Login */}
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2024 ZCAS University. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
