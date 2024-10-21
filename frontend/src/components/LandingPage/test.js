/*import React, { useState } from 'react';
import { FaUniversity, FaCheckCircle, FaUser, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';

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
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center">
            <FaUniversity className="text-blue-600 text-4xl mr-2" />
            <h1 className="text-2xl font-bold text-gray-800">ZCAS University</h1>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Home</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">About</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Blockchain Certificate Verification</h2>
          <p className="text-xl text-gray-600 mb-8">Verify your ZCAS University certificate instantly using our secure blockchain technology.</p>

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
        </section>

        <section className="max-w-4xl mx-auto mt-16 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Sign Up</h3>
              <form>
                <div className="mb-4">
                  <label htmlFor="signup-email" className="block text-gray-700 mb-2">Email</label>
                  <input type="email" id="signup-email" className="w-full px-3 py-2 border rounded-md" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="signup-password" className="block text-gray-700 mb-2">Password</label>
                  <input type="password" id="signup-password" className="w-full px-3 py-2 border rounded-md" required />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full bg-green-500 text-white font-semibold py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                >
                  <FaUser className="inline-block mr-2" />
                  Create Account
                </motion.button>
              </form>
            </div>
            <div className="md:w-1/2 p-8 bg-gray-50">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Login</h3>
              <form>
                <div className="mb-4">
                  <label htmlFor="login-email" className="block text-gray-700 mb-2">Email</label>
                  <input type="email" id="login-email" className="w-full px-3 py-2 border rounded-md" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="login-password" className="block text-gray-700 mb-2">Password</label>
                  <input type="password" id="login-password" className="w-full px-3 py-2 border rounded-md" required />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  <FaLock className="inline-block mr-2" />
                  Login
                </motion.button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 ZCAS University. All rights reserved.</p>
          <p className="mt-2">Powered by Blockchain Technology</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;*/





/*import React, { useState } from 'react';
import { FaSearch, FaUniversity, FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const [certificate, setCertificate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (certificate.length !== 8) {
      setError('Certificate number must be 8 characters long');
      setSuccess(false);
    } else {
      setError('');
      setSuccess(true);
      // Here you would typically make an API call to verify the certificate
    }
  };

  const handleModalOpen = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <FaUniversity className="text-3xl mr-2" />
          <h1 className="text-2xl font-bold">ZCAS University</h1>
        </div>
        <nav>
          <button
            onClick={() => handleModalOpen('signup')}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg mr-2 hover:bg-blue-100 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            aria-label="Sign Up"
          >
            <FaUserPlus className="inline-block mr-2" />
            Sign Up
          </button>
          <button
            onClick={() => handleModalOpen('login')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            aria-label="Log In"
          >
            <FaSignInAlt className="inline-block mr-2" />
            Log In
          </button>
        </nav>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Blockchain Certificate Verification
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="certificate" className="block text-sm font-medium text-gray-700 mb-1">
                Enter Certificate Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="certificate"
                  value={certificate}
                  onChange={(e) => setCertificate(e.target.value)}
                  placeholder="e.g., ZCAS2023"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  aria-describedby="certificate-description"
                />
                <FaSearch className="absolute right-3 top-3 text-gray-400" />
              </div>
              <p id="certificate-description" className="mt-1 text-sm text-gray-500">
                Please enter your 8-character certificate number
              </p>
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm"
              >
                {error}
              </motion.p>
            )}
            {success && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-500 text-sm"
              >
                Certificate verified successfully!
              </motion.p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Verify Certificate
            </button>
          </form>
        </motion.div>
      </main>

      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2023 ZCAS University. All rights reserved.</p>
      </footer>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-8 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold mb-4">
              {modalType === 'signup' ? 'Sign Up' : 'Log In'}
            </h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                {modalType === 'signup' ? 'Sign Up' : 'Log In'}
              </button>
            </form>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 text-sm text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;*/



