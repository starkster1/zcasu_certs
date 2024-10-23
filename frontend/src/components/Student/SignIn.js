import React, { useState } from 'react';
import { FaEthereum } from 'react-icons/fa';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Container, TextField, Button, Typography, IconButton, InputAdornment, Alert, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './sign_in.css';  // External CSS for styling

// MetaMask connection logic
export const connectToMetaMask = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      window.ethereum.on('accountsChanged', (newAccounts) => {
        if (newAccounts.length === 0) {
          console.log('Please connect to MetaMask.');
        } else {
          window.location.reload();
        }
      });

      return accounts[0];  // Return the first account
    } catch (error) {
      throw new Error(error.message || 'MetaMask connection failed');
    }
  } else {
    throw new Error('MetaMask is not installed');
  }
};

const SignIn = ({ setUserProfile }) => {
  const [emailOrStudentNumber, setEmailOrStudentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [ethAddress, setEthAddress] = useState('');
  const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      let currentAddress = ethAddress;

      // Connect to MetaMask if not connected
      if (!isMetamaskConnected) {
        currentAddress = await connectToMetaMask();
        setEthAddress(currentAddress);
        setIsMetamaskConnected(true);
      }

      // Validate form fields
      if (!emailOrStudentNumber || !password) {
        setErrors({
          emailOrStudentNumber: !emailOrStudentNumber ? 'Email or Student Number is required' : '',
          password: !password ? 'Password is required' : '',
        });
        setIsLoading(false);
        return;
      }

      // Simulate login (replace with actual API request)
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailOrStudentNumber,
          password,
          ethAddress: currentAddress,
          rememberMe,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userRole', data.user.role);  // Save role in localStorage
        setUserProfile(data.user);

        // Navigate to the correct dashboard
        if (data.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (data.user.role === 'student') {
          navigate('/dashboard');
        } else {
          setErrorMessage('Invalid role detected. Please try again.');
        }
      } else {
        setErrorMessage(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle navigation to Sign Up page
  const goToSignUp = () => {
    navigate('/signup');  // Navigate to the Sign Up page
  };

  return (
    <Container className="login-container">
      <div className="login-box">

        {/* Left side: Login form */}
        <div className="login-form-container">
          <Typography variant="h4" className="login-title">Welcome Back!</Typography>
          <form onSubmit={handleLogin}>

            {/* Email or Student Number */}
            <TextField
              label="Email or Student Number"
              variant="outlined"
              fullWidth
              margin="normal"
              value={emailOrStudentNumber}
              onChange={(e) => setEmailOrStudentNumber(e.target.value)}
              error={!!errors.emailOrStudentNumber}
              helperText={errors.emailOrStudentNumber}
              className="login-input"
            />

            {/* Password Input with Toggle Visibility */}
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
              className="login-input"
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

            {/* Remember Me & Forgot Password */}
            <div className="login-options">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary"
                  />
                }
                label="Remember me"
              />
              <a href="#" className="forgot-password">Forgot your password?</a>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <Alert severity="error" className="login-alert">
                {errorMessage}
              </Alert>
            )}

            {/* MetaMask Login Button */}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              className="login-button"
              disabled={isLoading}
              startIcon={<FaEthereum />}
            >
              {isLoading ? 'Connecting...' : 'Login'}
            </Button>
          </form>

          {/* Not a member? Sign up now */}
          <p className="text-center">
            Not a member? <a href="#" onClick={goToSignUp}>Sign up now</a>
          </p>
        </div>

        {/* Right side: Testimonial */}
        <div className="testimonial-section">
          <img src="https://via.placeholder.com/80" alt="Testimonial" className="testimonial-image" />
          <p className="testimonial-text">
            "This platform has been a game-changer for me. The easy access to resources and the
            integrated MetaMask login makes it super convenient!"
          </p>
          <p className="testimonial-name">Student A</p>
          <p className="testimonial-position">University Student</p>
        </div>

      </div>
    </Container>
  );
};

export default SignIn;
