import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { connectToMetaMask } from '../../utils/metamask'; // Import MetaMask utility
import { FaUserAlt, FaEnvelope, FaIdCard, FaLock } from 'react-icons/fa';
import './SignUp.css';
import { motion } from 'framer-motion';

const SignUpPage = ({ account, setUserProfile }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studentNumber: '',
    email: '',
    ethereumAddress: account || '',
    password: ''  // Add password field
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [metaMaskError, setMetaMaskError] = useState('');
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

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

  // Password strength validation function
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
  
      // Set the role to 'student' during registration
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          ethereumAddress: account.toLowerCase(),
          role: 'student'  // Set the role to 'student'
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        // Display success message and wait for 2 seconds before redirecting
        setSuccessMessage('Registration Successful! Redirecting to login...');
        setTimeout(() => {
          setSuccessMessage('');  // Clear message
          navigate('/signin');    // Redirect to SignIn
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
      <div className="form-wrapper">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <h2>Sign Up</h2>

            <div className="input-field">
              <label htmlFor="firstName">First Name</label>
              <FaUserAlt aria-hidden="true" />
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`${errors.firstName ? 'border-red-300' : ''}`}
                placeholder="Jones"
              />
              {errors.firstName && <p className="error-text">{errors.firstName}</p>}
            </div>

            <div className="input-field">
              <label htmlFor="lastName">Last Name</label>
              <FaUserAlt aria-hidden="true" />
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`${errors.lastName ? 'border-red-300' : ''}`}
                placeholder="Mukelabai"
              />
              {errors.lastName && <p className="error-text">{errors.lastName}</p>}
            </div>

            <div className="input-field">
              <label htmlFor="studentNumber">Student Number</label>
              <FaIdCard aria-hidden="true" />
              <input
                type="text"
                name="studentNumber"
                id="studentNumber"
                value={formData.studentNumber}
                onChange={handleChange}
                className={`${errors.studentNumber ? 'border-red-300' : ''}`}
                placeholder="202100154"
              />
              {errors.studentNumber && <p className="error-text">{errors.studentNumber}</p>}
            </div>

            <div className="input-field">
              <label htmlFor="email">Email Address</label>
              <FaEnvelope aria-hidden="true" />
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className={`${errors.email ? 'border-red-300' : ''}`}
                placeholder="mukelabaijones@gmail.com"
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>
            <div className="input-field">
              <label htmlFor="password">Password</label>
              <FaLock aria-hidden="true" />
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className={`${errors.password ? 'border-red-300' : ''}`}
                placeholder="Enter your password"
              />
              {errors.password && <p className="error-text">{errors.password}</p>}
            </div>

            <button type="button" className="button-connect" onClick={handleMetaMaskConnection}>
              {isMetaMaskConnected ? 'Connected' : 'Connect'}
            </button>
            {metaMaskError && <p className="error-text">{metaMaskError}</p>}

            <button type="submit" className="button-submit">
              Sign Up
            </button>
          </form>

          {/* Success Message */}
          {successMessage && <p className="success-message">{successMessage}</p>}
        </div>
      </div>

      <div className="welcome-container">
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-12"
        >
          <div>
            <img
              src="https://esis.zcasu.edu.zm/templates//zcasu/images/header.png"
              alt="ZCAS University Logo"
            />
            <h1>Welcome to ZCAS University</h1>
            <p>Join our blockchain verification system for secure and transparent academic records.</p>
          </div>
        </motion.header>
      </div>
    </div>
  );
};

export default SignUpPage;





/*import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { connectToMetaMask } from '../../utils/metamask'; // Import MetaMask utility
import { FaUserAlt, FaEnvelope, FaIdCard, FaLock } from 'react-icons/fa';
import './SignUp.css';
import { motion } from 'framer-motion';

const SignUpPage = ({ account, setUserProfile }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studentNumber: '',
    email: '',
    ethereumAddress: account || '',
    password: ''  // Add password field
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [metaMaskError, setMetaMaskError] = useState('');
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

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

  // Password strength validation function
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
        body: JSON.stringify({ ...formData, ethereumAddress: account.toLowerCase() }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        setUserProfile(data);
        setSuccessMessage('User registered successfully!');
        navigate('/dashboard');
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
      <div className="form-wrapper">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <h2>Sign Up</h2>

            <div className="input-field">
              <label htmlFor="firstName">First Name</label>
              <FaUserAlt aria-hidden="true" />
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`${errors.firstName ? 'border-red-300' : ''}`}
                placeholder="Jones"
              />
              {errors.firstName && <p className="error-text">{errors.firstName}</p>}
            </div>

            <div className="input-field">
              <label htmlFor="lastName">Last Name</label>
              <FaUserAlt aria-hidden="true" />
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`${errors.lastName ? 'border-red-300' : ''}`}
                placeholder="Mukelabai"
              />
              {errors.lastName && <p className="error-text">{errors.lastName}</p>}
            </div>

            <div className="input-field">
              <label htmlFor="studentNumber">Student Number</label>
              <FaIdCard aria-hidden="true" />
              <input
                type="text"
                name="studentNumber"
                id="studentNumber"
                value={formData.studentNumber}
                onChange={handleChange}
                className={`${errors.studentNumber ? 'border-red-300' : ''}`}
                placeholder="202100154"
              />
              {errors.studentNumber && <p className="error-text">{errors.studentNumber}</p>}
            </div>

            <div className="input-field">
              <label htmlFor="email">Email Address</label>
              <FaEnvelope aria-hidden="true" />
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className={`${errors.email ? 'border-red-300' : ''}`}
                placeholder="mukelabaijones@gmail.com"
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>
            <div className="input-field">
              <label htmlFor="password">Password</label>
              <FaLock aria-hidden="true" />
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className={`${errors.password ? 'border-red-300' : ''}`}
                placeholder="Enter your password"
              />
              {errors.password && <p className="error-text">{errors.password}</p>}
            </div>

            <button type="button" className="button-connect" onClick={handleMetaMaskConnection}>
              {isMetaMaskConnected ? 'Connected' : 'Connect MetaMask'}
            </button>
            {metaMaskError && <p className="error-text">{metaMaskError}</p>}

            <button type="submit" className="button-submit">
              Sign Up
            </button>
          </form>

          {successMessage && <p className="success-message">{successMessage}</p>}
        </div>
      </div>

      <div className="welcome-container">
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-12"
        >
          <div>
            <img
              src="https://esis.zcasu.edu.zm/templates//zcasu/images/header.png"
              alt="ZCAS University Logo"
            />
            <h1>Welcome to ZCAS University</h1>
            <p>Join our blockchain verification system for secure and transparent academic records.</p>
          </div>
        </motion.header>
      </div>
    </div>
  );
};

export default SignUpPage;
*/