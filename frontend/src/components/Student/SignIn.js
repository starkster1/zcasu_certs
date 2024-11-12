// SignIn.js

import React, { useState } from 'react';
import { FaEthereum } from 'react-icons/fa';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Container, TextField, Button, Typography, IconButton, InputAdornment, Alert, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWallet } from '../../contexts/WalletContext';
import styles from './SignIn.module.css';

const SignIn = ({ setUserProfile }) => {
  const { account, isConnected, connectWallet } = useWallet();
  const [emailOrStudentNumber, setEmailOrStudentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      if (!isConnected) {
        await connectWallet();
      }

      if (!emailOrStudentNumber || !password) {
        setErrors({
          emailOrStudentNumber: !emailOrStudentNumber ? 'Email or Student Number is required' : '',
          password: !password ? 'Password is required' : '',
        });
        setIsLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrStudentNumber, password, ethAddress: account, rememberMe }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userRole', data.user.role);
        setUserProfile(data.user);

        if (data.user.role === 'admin') navigate('/admin/dashboard');
        else if (data.user.role === 'student') navigate('/dashboard');
        else setErrorMessage('Invalid role detected. Please try again.');
      } else {
        setErrorMessage(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  const goToSignUp = () => {
    navigate('/signup');
  };

  const handleMetaMaskConnection = async () => {
    await connectWallet();
  };

  return (
    <Container className={styles.signInContainer}>
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

      <div className={styles.formContainer}>
        <Typography variant="h5" className={styles.header}>Sign In</Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Email or Student Number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={emailOrStudentNumber}
            onChange={(e) => setEmailOrStudentNumber(e.target.value)}
            error={!!errors.emailOrStudentNumber}
            helperText={errors.emailOrStudentNumber}
            className={styles.input}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            className={styles.input}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <div className={styles.options}>
            <FormControlLabel
              control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} color="primary" />}
              label="Remember me"
            />
            <a href="#" className={styles.forgotPassword}>Forgot your password?</a>
          </div>

          {errorMessage && <Alert severity="error" className={styles.alert}>{errorMessage}</Alert>}

          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            className={styles.button}
            disabled={isLoading}
            startIcon={<FaEthereum />}
          >
            {isLoading ? 'Connecting...' : 'Login'}
          </Button>
        </form>

        <p className={styles.footerText}>
          Not a member? <a href="#" onClick={goToSignUp}>Create an Account</a>
        </p>
      </div>

      <div className={styles.infoContainer}>
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
    </Container>
  );
};

export default SignIn;
