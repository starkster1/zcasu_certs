import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../contexts/WalletContext';
import PasswordStrengthIndicator from '../../utils/PasswordStrengthIndicator';
import { motion } from 'framer-motion';
import { FaEthereum } from 'react-icons/fa';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import styles from './SignUp.module.css';


const SignUpPage = ({ setUserProfile }) => {
  const { account, isConnected,  connectWallet } = useWallet();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studentNumber: '',
    ethereumAddress: account || '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [setMetaMaskError] = useState('');
  const navigate = useNavigate();
  const [isPasswordFieldFocused, setIsPasswordFieldFocused] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState([]);


  useEffect(() => {
    if (account) {
      setFormData((prevData) => ({ ...prevData, ethereumAddress: account }));
    }
  }, [account]);

  const handleMetaMaskConnection = async () => {
    try {
      if (!account) { // Ensure the wallet is connected
        await connectWallet();
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      setMetaMaskError("Unable to connect to MetaMask. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      validatePasswordStrength(value);
    }
    validateField(name, value);
  };

  const handleFocus = () => {
    setIsPasswordFieldFocused(false);
  };

  const handleBlur = () => {
    setIsPasswordFieldFocused(false);
  };


  const validatePasswordStrength = (password) => {
    const feedback = [];
    let score = 0;

    if (password.length >= 8) score++;
    else feedback.push('Use at least 8 characters.');

    if (/[A-Z]/.test(password)) score++;
    else feedback.push('Include at least one uppercase letter.');

    if (/[a-z]/.test(password)) score++;
    else feedback.push('Include at least one lowercase letter.');

    if (/\d/.test(password)) score++;
    else feedback.push('Include at least one number.');

    setPasswordScore(score);
    setPasswordFeedback(feedback);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) newErrors[name] = 'This field is required';
        else delete newErrors[name];
        break;
      case 'studentNumber':
        if (!value.trim()) newErrors[name] = 'Student number is required';
        else if (!/^\d{9}$/.test(value)) newErrors[name] = 'Student number should be 9 digits';
        else delete newErrors[name];
        break;
      case 'password':
        if (passwordFeedback.length > 0) newErrors.password = 'Improve password strength.';
        else delete newErrors.password;
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  <div className={styles.buttonWrapper}>
        <button
          type="button"
          className={styles.buttonConnect}
          onClick={handleMetaMaskConnection}
          style={{
            backgroundColor: isConnected ? 'rgba(255, 183, 0, 0.708)' : '#3e2272',
          }}
        >
          {isConnected ? 'Connected' : 'Connect'}
        </button>
      </div>

      const handleSubmit = async (e) => {
        e.preventDefault();

        try {
          // Ensure wallet is connected before registration
          if (!account) {
            await connectWallet();
          }

          const { firstName, lastName, studentNumber, password } = formData;

          if (!firstName || !lastName || !studentNumber || !password) {
            setMetaMaskError('Required fields are missing.');
            return;
          }

          const bodyData = {
            firstName,
            lastName,
            studentNumber,
            ethereumAddress: account.toLowerCase(),
            password,
            role: 'student',
          };

          const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData),
          });

          const data = await response.json();
          if (response.ok) {
            setSuccessMessage('Registration Successful! Redirecting to login...');
            setTimeout(() => {
              setSuccessMessage('');
              navigate('/signin');
            }, 2000);
          } else {
            setMetaMaskError(data.message || 'Registration failed. Please try again.');
          }
        } catch (error) {
          setMetaMaskError('Server error during registration. Please try again.');
        }
      };

  const goToSignIn = () => {
    navigate('/signin');
  };

 
  
  return (
    <div className={styles.container}>
      <div className={styles.buttonWrapper}>
        <button
          type="button"
          className={styles.buttonConnect}
          onClick={handleMetaMaskConnection}
          style={{
            backgroundColor: isConnected ? 'rgba(255, 183, 0, 0.708)' : '#3e2272',
          }}
        >
          {isConnected ? 'Connected' : 'Connect'}
        </button>
      </div>
  
    
        <div className={styles.formSection}>
        <form onSubmit={handleSubmit}>
          <h2 className={styles.header}>Create Account</h2>

          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className={`${styles.inputField} ${errors.firstName ? styles.inputFieldError : ''}`}
          />
          {errors.firstName && <p className={styles.errorMessage}>{errors.firstName}</p>}

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className={`${styles.inputField} ${errors.lastName ? styles.inputFieldError : ''}`}
          />
          {errors.lastName && <p className={styles.errorMessage}>{errors.lastName}</p>}

          <input
            type="text"
            name="studentNumber"
            placeholder="Student Number"
            value={formData.studentNumber}
            onChange={handleChange}
            className={`${styles.inputField} ${errors.studentNumber ? styles.inputFieldError : ''}`}
          />
          {errors.studentNumber && <p className={styles.errorMessage}>{errors.studentNumber}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`${styles.inputField} ${errors.password ? styles.inputFieldError : ''}`}

        
          />
          
          {errors.password && <p className={styles.errorMessage}>{errors.password}</p>}

          {isPasswordFieldFocused || formData.password && (
            <PasswordStrengthIndicator score={passwordScore} feedback={passwordFeedback} />
          )}

          {/* Container for the button */}
          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.subButton}>
              <FaEthereum /> Proceed
            </button>
          </div>

          <p className={styles.loginButton}>
            Already have an account?{' '}
            <a href="#" onClick={goToSignIn}>
              Login
            </a>
          </p>
        </form>

          {successMessage && <p className="success-message">{successMessage}</p>}
        </div>

        <div className={styles.logoSection}>
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <img
            src="https://esis.zcasu.edu.zm/templates//zcasu/images/header.png"
            alt="ZCAS University Logo"
            className={styles.logo}
          />
          <h1 className={styles.title}>Welcome to ZCAS University</h1>
          <p className={styles.subText}>Join our blockchain verification system for secure and transparent academic records.</p>
        </motion.header>
        </div>
    
    </div>
  );
};

export default SignUpPage;