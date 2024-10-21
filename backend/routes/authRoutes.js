const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Web3 = require('web3');
const User = require('../models/user');
const Admin = require('../models/admin');
const router = express.Router();

// Smart contract ABI and address (deployed on Ganache or another network)
const contractABI = [
  // Add your contract ABI here
  
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "student",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "certId",
        "type": "bytes32"
      }
    ],
    "name": "CertificateIssued",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "certId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "verified",
        "type": "bool"
      }
    ],
    "name": "CertificateVerified",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "certificates",
    "outputs": [
      {
        "internalType": "address",
        "name": "student",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "verified",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "institute",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "pendingApprovals",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "students",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "student",
        "type": "address"
      }
    ],
    "name": "addStudent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "student",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "name": "issueCertificate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "certId",
        "type": "bytes32"
      }
    ],
    "name": "verifyCertificate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "student",
        "type": "address"
      }
    ],
    "name": "requestApproval",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "student",
        "type": "address"
      }
    ],
    "name": "approveStudent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }

];
const contractAddress = '0x9d8a4D0C143bB7A23C43B05CAc89e53a9674B154'; // Replace with your contract address

// MetaMask verification utility function for admin
const checkMetaMaskAdmin = async (ethAddress) => {
  const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');  // Connect to Ganache
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  const instituteAddress = await contract.methods.institute().call();

  return ethAddress.toLowerCase() === instituteAddress.toLowerCase();  // Return true if MetaMask address matches the admin address
};

router.post('/login', async (req, res) => {
  const { emailOrStudentNumber, password, ethAddress } = req.body;

  try {
    console.log('Login request received:', { emailOrStudentNumber, ethAddress });

    // 1. Try to find the user in the User collection (students)
    let user = await User.findOne({
      $or: [{ email: emailOrStudentNumber }, { studentNumber: emailOrStudentNumber }],
    });

    if (user) {
      console.log('Student found:', user);

      // Compare password
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        console.log('Password mismatch for user:', user.email);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check Ethereum address for student
      if (user.ethereumAddress !== ethAddress) {
        console.log('Ethereum address mismatch:', { userAddress: user.ethereumAddress, ethAddress });
        return res.status(401).json({ message: 'Ethereum address mismatch. Please use the registered MetaMask account.' });
      }

      // Generate JWT token for student
      const jwtSecret = process.env.JWT_SECRET || 'default_secret';
      const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: '1h' });

      console.log('JWT generated for student:', { token, role: user.role });

      return res.status(200).json({ token, user });  // Return user object with role
    }

    // 2. Try to find the user in the Admin collection
    let admin = await Admin.findOne({ email: emailOrStudentNumber });
    if (admin) {
      console.log('Admin found:', admin);

      // Compare password for admin
      const isPasswordMatch = await bcrypt.compare(password, admin.password);
      if (!isPasswordMatch) {
        console.log('Password mismatch for admin:', admin.email);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check Ethereum address for admin
      if (admin.ethereumAddress !== ethAddress) {
        console.log('Ethereum address mismatch for admin:', { adminAddress: admin.ethereumAddress, ethAddress });
        return res.status(401).json({ message: 'Ethereum address mismatch. Please use the registered MetaMask account.' });
      }

      // Generate JWT token for admin
      const jwtSecret = process.env.JWT_SECRET || 'default_secret';
      const token = jwt.sign({ id: admin._id, role: admin.role }, jwtSecret, { expiresIn: '1h' });

      console.log('JWT generated for admin:', { token, role: admin.role });

      return res.status(200).json({ token, user: admin });  // Return admin object with role
    }

    // 3. If neither student nor admin is found, check if MetaMask address is an admin
    const isMetaMaskAdmin = await checkMetaMaskAdmin(ethAddress); // Smart contract check
    if (isMetaMaskAdmin) {
      console.log('MetaMask address is an admin:', ethAddress);

      // Register new admin in MongoDB
      const hashedPassword = await bcrypt.hash(password, 10);
      admin = new Admin({ email: emailOrStudentNumber, password: hashedPassword, ethereumAddress: ethAddress, role: 'admin' });
      await admin.save();

      // Generate JWT token for new admin
      const jwtSecret = process.env.JWT_SECRET || 'default_secret';
      const token = jwt.sign({ id: admin._id, role: 'admin' }, jwtSecret, { expiresIn: '1h' });

      console.log('New admin registered and JWT generated:', { token, role: 'admin' });

      return res.status(201).json({ token, user: admin });  // Return new admin object with role
    }

    // 4. If no user or admin found, and MetaMask address is not admin
    console.log('No user or admin found for the provided credentials');
    return res.status(404).json({ message: 'User not found' });

  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


// Registration route
router.post('/register', async (req, res) => {
  const { firstName, lastName, studentNumber, email, ethereumAddress, password, profilePicture, role } = req.body;

  try {
      // Ensure all required fields are present
      if (!firstName || !lastName || !studentNumber || !email || !password || !role) {
          return res.status(400).json({ message: 'Missing required fields' });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user with optional profilePicture and set the role (student)
      const newUser = new User({
          firstName,
          lastName,
          studentNumber,
          email,
          ethereumAddress,
          password: hashedPassword,
          role,  // Add role (student or admin)
          profilePicture: profilePicture || '' // Default to an empty string if no picture provided
      });

      // Save the user to MongoDB
      await newUser.save();

      // Generate JWT token
      const jwtSecret = process.env.JWT_SECRET || 'default_secret';
      const token = jwt.sign({ id: newUser._id }, jwtSecret, { expiresIn: '1h' });

      // Respond with the token and user details (excluding password)
      res.status(201).json({
          token,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          ethereumAddress: newUser.ethereumAddress,
          profilePicture: newUser.profilePicture
      });
  } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});



// Route to check if a user is registered by Ethereum address
router.get('/check-registration', async (req, res) => {
    const { ethAddress } = req.query;

    try {
        const user = await User.findOne({ ethereumAddress: ethAddress });

        if (user) {
            // User is registered
            res.status(200).json({ isRegistered: true, userProfile: user });
        } else {
            // User is not registered
            res.status(200).json({ isRegistered: false });
        }
    } catch (error) {
        console.error('Error checking registration status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Middleware to authenticate the JWT token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];  // Extract token from "Bearer <token>"
  if (!token) return res.status(401).json({ message: 'Token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');  // Verify the token
    req.userId = decoded.id;  // Attach user ID to request object
    req.userRole = decoded.role;  // Attach user role to request object
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Route to fetch admin profile
router.get('/admin-profile', authenticateToken, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const admin = await Admin.findById(req.userId).select('-password');  // Exclude the password field
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    return res.status(200).json(admin);
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to fetch the user profile based on the token
router.get('/user-profile', authenticateToken, async (req, res) => {
  try {
    let userProfile;

    if (req.userRole === 'student') {
      userProfile = await User.findById(req.userId).select('-password');  // Fetch student profile without the password
      if (!userProfile) return res.status(404).json({ message: 'Student not found' });
    } else if (req.userRole === 'admin') {
      userProfile = await Admin.findById(req.userId).select('-password');  // Fetch admin profile without the password
      if (!userProfile) return res.status(404).json({ message: 'Admin not found' });
    } else {
      return res.status(403).json({ message: 'Invalid user role' });
    }

    return res.status(200).json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;

