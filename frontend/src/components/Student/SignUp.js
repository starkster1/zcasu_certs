import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../contexts/WalletContext'; // useWallet for wallet connection
import './SignUp.css';
import { motion } from 'framer-motion';
import { FaEthereum } from 'react-icons/fa';

const SignUpPage = ({ setUserProfile }) => {
  const { account, connectWallet } = useWallet(); // Destructure connectWallet and account
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studentNumber: '',
    ethereumAddress: account || '',
    password: ''  
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [metaMaskError, setMetaMaskError] = useState('');
  const navigate = useNavigate();

  // Auto-update ethereum address if account changes
  useEffect(() => {
    if (account) {
      setFormData((prevData) => ({ ...prevData, ethereumAddress: account }));
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
    
    if (password.length < minLength) return 'Password must be at least 6 characters';
    if (!uppercaseRegex.test(password)) return 'Password must include at least one uppercase letter';
    if (!lowercaseRegex.test(password)) return 'Password must include at least one lowercase letter';
    if (!numberRegex.test(password)) return 'Password must include at least one number';
    if (!specialCharRegex.test(password)) return 'Password must include at least one special character';
    return '';
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
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
      await connectWallet(); // Call connectWallet from useWallet to connect MetaMask
    } catch (error) {
      setMetaMaskError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!account) {
      
      setMetaMaskError('MetaMask account not connected.');
      return;
    }
  
    try {
      const { firstName, lastName, studentNumber, password } = formData;
  
      // Log the form data and account before validation
      console.log('Form Data before validation:', formData);
      console.log('Ethereum Address from account:', account);
  
      if (!firstName || !lastName || !studentNumber || !password) {
        setMetaMaskError('Required fields are missing.');
        return;
      }
  
      // Log the data being sent to the server
      const bodyData = {
        firstName,
        lastName,
        studentNumber,
        ethereumAddress: account.toLowerCase(),
        password,
        role: 'student',
      };
      console.log('Data to be sent:', bodyData);
  
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('Registration Successful:', data);
        setSuccessMessage('Registration Successful! Redirecting to login...');
        await connectWallet(); // Ensure wallet connection after registration
        setTimeout(() => {
          setSuccessMessage('');
          navigate('/signin');
        }, 2000);
      } else {
        console.error('Registration Error:', data.message);
        setMetaMaskError(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setMetaMaskError('Server error during registration. Please try again.');
    }
  };
  

  // Handle navigation to the sign-in page
  const goToSignIn = () => {
    navigate('/signin');
  };

  return (
    <div className="container">
      <div className="button-wrapper">
        <button
          type="button"
          className="button-connect"
          onClick={handleMetaMaskConnection}
          style={{
            backgroundColor: account
              ? 'rgba(255, 183, 0, 0.708)' // Gold color for "Connected"
              : '#3e2272' // Purple color for "Connect"
          }}
        >
          {account ? 'Connected' : 'Connect'}
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
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full py-2 px-3 border ${errors.firstName ? 'border-red-300' : ''} rounded-lg shadow-sm`}
                placeholder="John"
              />
              {errors.firstName && <p className="text-red-500 text-xs italic">{errors.firstName}</p>}
            </div>

            {/* Last Name Field */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full py-2 px-3 border ${errors.lastName ? 'border-red-300' : ''} rounded-lg shadow-sm`}
                placeholder="Doe"
              />
              {errors.lastName && <p className="text-red-500 text-xs italic">{errors.lastName}</p>}
            </div>

            {/* Student Number Field */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="studentNumber">
                Student Number
              </label>
              <input
                type="text"
                name="studentNumber"
                id="studentNumber"
                value={formData.studentNumber}
                onChange={handleChange}
                className={`w-full py-2 px-3 border ${errors.studentNumber ? 'border-red-300' : ''} rounded-lg shadow-sm`}
                placeholder="202100154"
              />
              {errors.studentNumber && <p className="text-red-500 text-xs italic">{errors.studentNumber}</p>}
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full py-2 px-3 border ${errors.password ? 'border-red-300' : ''} rounded-lg shadow-sm`}
                placeholder="******"
              />
              {errors.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover-bg-blue-700 transition"
            >
              <FaEthereum />
              <span>Proceed</span>
            </button>
            <p className="text-center">
              Already have an account? <a href="#" onClick={goToSignIn}>Login</a>
            </p>
          </form>

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
