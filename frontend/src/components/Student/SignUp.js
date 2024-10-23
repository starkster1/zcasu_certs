import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { connectToMetaMask } from '../../utils/metamask';
import './SignUp.css';
import { motion } from 'framer-motion';
import { FaEthereum } from 'react-icons/fa';

const SignUpPage = ({ account, setUserProfile }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studentNumber: '',
    email: '',
    ethereumAddress: account || '',
    password: ''  
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [metaMaskError, setMetaMaskError] = useState('');
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (account) {
      setFormData((prevData) => ({ ...prevData, ethereumAddress: account }));
      setIsMetaMaskConnected(true);
    }
  }, [account]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validatePasswordStrength = (password) => {
    const minLength = 6;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /\d/;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

    let message = '';
    if (password.length < minLength) {
      message = 'Password must be at least 6 characters';
    } else if (!uppercaseRegex.test(password)) {
      message = 'Password must include at least one uppercase letter';
    } else if (!lowercaseRegex.test(password)) {
      message = 'Password must include at least one lowercase letter';
    } else if (!numberRegex.test(password)) {
      message = 'Password must include at least one number';
    } else if (!specialCharRegex.test(password)) {
      message = 'Password must include at least one special character';
    }

    return message;
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) {
          newErrors[name] = 'This field is required';
        } else {
          delete newErrors[name];
        }
        break;
      case 'studentNumber':
        if (!value.trim()) {
          newErrors[name] = 'Student number is required';
        } else if (!/^\d{9}$/.test(value)) {
          newErrors[name] = 'Student number should be 9 digits';
        } else {
          delete newErrors[name];
        }
        break;
      case 'email':
        if (!value.trim()) {
          newErrors[name] = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[name] = 'Invalid email format';
        } else {
          delete newErrors[name];
        }
        break;
      case 'password':
        const passwordError = validatePasswordStrength(value);
        if (passwordError) {
          newErrors.password = passwordError;
        } else {
          delete newErrors.password;
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const handleMetaMaskConnection = async () => {
    try {
      if (isMetaMaskConnected) {
        setIsMetaMaskConnected(false);
        setFormData((prevData) => ({ ...prevData, ethereumAddress: '' }));
        console.log('Disconnected from MetaMask');
      } else {
        const ethereumAddress = await connectToMetaMask();
        setFormData({ ...formData, ethereumAddress });
        setIsMetaMaskConnected(true);
        console.log('Connected to MetaMask:', ethereumAddress);
      }
    } catch (error) {
      setMetaMaskError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isMetaMaskConnected) {
      setMetaMaskError('MetaMask account not connected.');
      return;
    }

    try {
      const { firstName, lastName, studentNumber, email, password } = formData;

      if (!firstName || !lastName || !studentNumber || !email || !password) {
        setMetaMaskError('Required fields are missing.');
        return;
      }

      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ethereumAddress: account.toLowerCase(),
          role: 'student'
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage('Registration Successful! Redirecting to login...');
        setTimeout(() => {
          setSuccessMessage('');
          navigate('/signin');
        }, 2000);
      } else {
        console.error('Error:', data.message);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setMetaMaskError('Server error during registration. Please try again.');
    }
  };

  return (
    <div className="container">
      {/* MetaMask Connect Button on the top right corner */}
      <div className="button-wrapper">
        <button
          type="button"
          className="button-connect"
          onClick={handleMetaMaskConnection}
          style={{
            backgroundColor: isMetaMaskConnected
              ? 'rgba(255, 183, 0, 0.708)' // Gold color for "Connected"
              : '#3e2272' // Purple color for "Connect"
          }}
        >
          {isMetaMaskConnected ? 'Connected' : 'Connect'}
        </button>
      </div>

      <div className="flex bg-gray-100 p-8 shadow-lg rounded-lg">
        <div className="w-1-2">
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-semibold mb-6">Create Account</h2>

            {/* First Name Field */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                First Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex-items-center pl-3">
                  <i className="fas fa-user text-gray-400"></i>
                </span>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full py-2 px-3 pl-12 border ${errors.firstName ? 'border-red-300' : ''} rounded-lg shadow-sm`}
                  placeholder="John"
                />
                {errors.firstName && <p className="text-red-500 text-xs italic">{errors.firstName}</p>}
              </div>
            </div>

            {/* Last Name Field */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                Last Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex-items-center pl-3">
                  <i className="fas fa-user text-gray-400"></i>
                </span>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full py-2 px-3 pl-12 border ${errors.lastName ? 'border-red-300' : ''} rounded-lg shadow-sm`}
                  placeholder="Doe"
                />
                {errors.lastName && <p className="text-red-500 text-xs italic">{errors.lastName}</p>}
              </div>
            </div>

            {/* Student Number Field */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="studentNumber">
                Student Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex-items-center pl-3">
                  <i className="fas fa-id-card text-gray-400"></i>
                </span>
                <input
                  type="text"
                  name="studentNumber"
                  id="studentNumber"
                  value={formData.studentNumber}
                  onChange={handleChange}
                  className={`w-full py-2 px-3 pl-12 border ${errors.studentNumber ? 'border-red-300' : ''} rounded-lg shadow-sm`}
                  placeholder="202100154"
                />
                {errors.studentNumber && <p className="text-red-500 text-xs italic">{errors.studentNumber}</p>}
              </div>
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex-items-center pl-3">
                  <i className="fas fa-envelope text-gray-400"></i>
                </span>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full py-2 px-3 pl-12 border ${errors.email ? 'border-red-300' : ''} rounded-lg shadow-sm`}
                  placeholder="john.doe@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex-items-center pl-3">
                  <i className="fas fa-lock text-gray-400"></i>
                </span>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full py-2 px-3 pl-12 border ${errors.password ? 'border-red-300' : ''} rounded-lg shadow-sm`}
                  placeholder="******"
                />
                {errors.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover-bg-blue-700 transition"
            >
              <FaEthereum />
              <span>Proceed</span>
            </button>
          </form>

          {/* Success Message */}
          {successMessage && <p className="success-message">{successMessage}</p>}
        </div>

        <div className="w-1-2 flex flex-col justify-center items-center">
          <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <img
              src="https://esis.zcasu.edu.zm/templates//zcasu/images/header.png"
              alt="ZCAS University Logo"
              className="mb-4"
            />
            <h1 className="text-4xl font-bold mb-5">Welcome to ZCAS University</h1>
            <p className="text-lg">Join our blockchain verification system for secure and transparent academic records.</p>
          </motion.header>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
