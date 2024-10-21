import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, IconButton, InputAdornment, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { FaEthereum } from 'react-icons/fa';
import './sign_in.css';

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
  const [ethAddress, setEthAddress] = useState('');
  const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailOrStudentNumber, setEmailOrStudentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

      // Send login request to the server
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailOrStudentNumber,
          password,
          ethAddress: currentAddress,
        }),
      });

      const data = await response.json();
      console.log('Login response:', data);  // Check response data

      if (response.ok) {
        // Check if role exists in data.user
        if (data.user && data.user.role) {
          console.log('Role:', data.user.role);
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('userRole', data.user.role);  // Save role in localStorage
          setUserProfile(data.user);  // Set user profile correctly

          // Navigate to the respective dashboard based on role
          if (data.user.role === 'admin') {
            navigate('/admin/dashboard');
          } else if (data.user.role === 'student') {
            navigate('/dashboard');
          } else {
            console.error('Invalid role detected:', data.user.role);
            setErrorMessage('Invalid role. Please try again.');
          }
        } else {
          console.error('Role not found in the response data.');
          setErrorMessage('Role not found. Please contact support.');
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

  return (
    <Container className="sign-in-container">
      <div className="sign-in-box">
        <Typography variant="h4" className="sign-in-title">
          Login
        </Typography>

        {/* Email or Student Number Input */}
        <TextField
          label="Email or Student Number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={emailOrStudentNumber}
          onChange={(e) => setEmailOrStudentNumber(e.target.value)}
          className="sign-in-input"
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
          className="sign-in-input"
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

        {/* Error Message Display */}
        {errorMessage && (
          <Alert severity="error" className="sign-in-alert">
            {errorMessage}
          </Alert>
        )}

        {/* Login Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          disabled={isLoading}
          className="sign-in-button"
          startIcon={<FaEthereum />}
        >
          {isLoading ? 'Connecting...' : 'Login'}
        </Button>
      </div>
    </Container>
  );
};

export default SignIn;
