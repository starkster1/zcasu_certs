const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Web3 = require('web3');
const User = require('../models/user');
const Admin = require('../models/admin');
const router = express.Router();
const StudentProfile = require('../models/StudentProfile');

// Smart contract ABI and address (deployed on Ganache or another network)
const contractABI = [
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
        "internalType": "address",
        "name": "institute",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
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
        "internalType": "address",
        "name": "student",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "name": "CertificateRevoked",
    "type": "event"
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
        "indexed": false,
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isValid",
        "type": "bool"
      }
    ],
    "name": "CertificateVerified",
    "type": "event"
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
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "studentCertificates",
    "outputs": [
      {
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "student",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "institute",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isValid",
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
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "usedHashes",
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
      },
      {
        "internalType": "string",
        "name": "_ipfsHash",
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
        "internalType": "string",
        "name": "_ipfsHash",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "_isValid",
        "type": "bool"
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
        "internalType": "string",
        "name": "_ipfsHash",
        "type": "string"
      }
    ],
    "name": "revokeCertificate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_student",
        "type": "address"
      }
    ],
    "name": "getCertificates",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "ipfsHash",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "student",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "institute",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isValid",
            "type": "bool"
          }
        ],
        "internalType": "struct ZCASUCertificate.Certificate[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_ipfsHash",
        "type": "string"
      }
    ],
    "name": "getCertificateDetails",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "ipfsHash",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "student",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "institute",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isValid",
            "type": "bool"
          }
        ],
        "internalType": "struct ZCASUCertificate.Certificate",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_ipfsHash",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "_institute",
        "type": "address"
      }
    ],
    "name": "registerCertificate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
const contractAddress = '0xA39e30e17F63F8b6AD4CE2ddcfb76fC36FE2444f'; // Replace with your contract address

// MetaMask verification utility function for admin
const checkMetaMaskAdmin = async (ethAddress) => {
  if (!ethAddress) {
    console.error("Ethereum address is null.");
    throw new Error("Ethereum address is required for MetaMask admin check.");
  }

  const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
  const contract = new web3.eth.Contract(contractABI, contractAddress);

  try {
    const instituteAddress = await contract.methods.institute().call();
    return ethAddress.toLowerCase() === instituteAddress.toLowerCase();
  } catch (error) {
    console.error("Error calling contract method 'institute':", error);
    throw new Error("Failed to verify MetaMask admin.");
  }
};


router.post('/login', async (req, res) => {
  const { studentNumber, password, ethAddress } = req.body;

  try {
    console.log('Login request received:', { studentNumber, ethAddress });

    // Find the user by `studentNumber`
    let user = await User.findOne({ studentNumber });
    if (user) {
      console.log('Student found:', {
        id: user._id,
        role: user.role,
        studentNumber: user.studentNumber, // Debug this value
        ethereumAddress: user.ethereumAddress,
      });

      // Compare password
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        console.log('Password mismatch for user:', user.studentNumber);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check Ethereum address for student
      if (user.ethereumAddress !== ethAddress) {
        console.log('Ethereum address mismatch:', { userAddress: user.ethereumAddress, ethAddress });
        return res.status(401).json({ message: 'Ethereum address mismatch. Please use the registered MetaMask account.' });
      }

      // Generate JWT token for student, including `studentNumber`
      const jwtSecret = process.env.JWT_SECRET || 'default_secret';
      const token = jwt.sign(
        {
          id: user._id, 
          role: user.role,
          studentNumber: user.studentNumber,
          ethereumAddress: user.ethereumAddress
         },
        jwtSecret,
        { expiresIn: '1h' }
      );

      console.log('JWT generated for student:', {
        token,
        id: user._id,
        role: user.role,
        studentNumber: user.studentNumber,
      });

      return res.status(200).json({ token, user });
    }

    // Handle admin login
    let admin = await Admin.findOne({ email: studentNumber }); // Admin login uses email
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
      const token = jwt.sign(
        { id: admin._id, role: admin.role, ethereumAddress: admin.ethereumAddress },
        jwtSecret,
        { expiresIn: '1h' }
      );

      console.log('JWT generated for admin:', {
        token,
        role: admin.role,
      });

      return res.status(200).json({ token, user: admin });
    }

    // Check if MetaMask address is an admin
    const isMetaMaskAdmin = await checkMetaMaskAdmin(ethAddress);
    if (isMetaMaskAdmin) {
      console.log('MetaMask address is an admin:', ethAddress);

      // Register new admin in MongoDB
      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = new Admin({ email: studentNumber, password: hashedPassword, ethereumAddress: ethAddress, role: 'admin' });
      await newAdmin.save();

      // Generate JWT token for new admin
      const jwtSecret = process.env.JWT_SECRET || 'default_secret';
      const token = jwt.sign(
        { id: newAdmin._id, role: 'admin', ethereumAddress: newAdmin.ethereumAddress },
        jwtSecret,
        { expiresIn: '1h' }
      );

      console.log('New admin registered and JWT generated:', {
        token,
        role: 'admin',
      });

      return res.status(201).json({ token, user: newAdmin });
    }

    // If no user or admin found
    console.log('No user or admin found for the provided credentials');
    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/register', async (req, res) => {
  const { firstName, lastName, studentNumber, ethereumAddress, password, role } = req.body;

  try {
    // Ensure all required fields are present
    console.log('Incoming registration data:', { firstName, lastName, studentNumber, ethereumAddress, role });
    if (!firstName || !lastName || !studentNumber || !password || !role) {
      console.error('Missing required fields during registration:', { firstName, lastName, studentNumber, role });
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ studentNumber });
    if (existingUser) {
      console.warn('User already exists with studentNumber:', studentNumber);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      studentNumber,
      ethereumAddress,
      password: hashedPassword,
      role,
    });

    // Save the user to MongoDB
    await newUser.save();

    console.log('New user successfully registered:', {
      id: newUser._id,
      studentNumber: newUser.studentNumber,
      ethereumAddress: newUser.ethereumAddress,
      role: newUser.role,
    });

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'default_secret';
    const token = jwt.sign(
      {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        studentNumber: newUser.studentNumber,
        ethereumAddress: newUser.ethereumAddress,
        role: newUser.role,
      },
      jwtSecret,
      { expiresIn: '1h' }
    );

    console.log('JWT successfully generated for new user:', token);

    res.status(201).json({
      token,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      studentNumber: newUser.studentNumber,
      ethereumAddress: newUser.ethereumAddress,
    });
  } catch (error) {
    // Detailed error logging
    if (error.name === 'ValidationError') {
      console.error('MongoDB Validation Error:', error.errors);
    } else {
      console.error('Unexpected Error:', error.message);
    }

    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


router.get('/users', async (req, res) => {
  try {
    // Fetch users with only the required fields
    const users = await User.find({}, 'studentNumber ethereumAddress role');

    if (!users.length) {
      return res.status(404).json({ message: 'No registered users found.' });
    }

    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Failed to fetch users.', error: error.message });
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


const authenticateToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  // Validate that the Authorization header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access token is missing or invalid.' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token part

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret'); // Verify the token
    console.log(`[AUTH] Decoded JWT payload:`, decoded);

    // Validate required fields in the decoded token
    if (!decoded.id || !decoded.role) {
      return res.status(403).json({ message: 'Invalid token: Missing required fields.' });
    }

    // Attach the required fields to the `req` object
    req.userId = decoded.id; // User ID
    req.userRole = decoded.role; // Role (e.g., student or admin)
    req.ethereumAddress = decoded.ethereumAddress; // Ethereum Address
    
    // Additional checks for student-specific fields
    if (decoded.role === 'student') {
      if (!decoded.studentNumber) {
        return res.status(403).json({ message: 'Invalid token: Missing student number for student role.' });
      }
      req.studentNumber = decoded.studentNumber; // Attach student number for students
    }

    console.log('[AUTH] Attached to req:', {
      userId: req.userId,
      userRole: req.userRole,
      studentNumber: req.studentNumber || null, // Null for non-students
      ethereumAddress: req.ethereumAddress || null, // Null if not available
    });

    next(); // Move to the next middleware or route handler
  } catch (error) {
    console.error(`[AUTH] Token verification error: ${error.message}`);
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};


router.get('/user-profile', authenticateToken, async (req, res) => {
  try {
    let userProfile;

    if (req.userRole === 'student') {
      // Fetch from StudentProfile based on studentNumber
      console.log('Fetching profile for studentNumber:', req.studentNumber);
      userProfile = await StudentProfile.findOne({ studentNumber: req.studentNumber }).select(
        'firstName lastName email studentNumber program schoolOf startDate endDate duration accessLevel studyLevel profilePicture'
      );
      if (!userProfile) {
        console.error(`Student profile not found for studentNumber: ${req.studentNumber}`);
        return res.status(404).json({ message: 'Student profile not found' });
      }
    } else if (req.userRole === 'admin') {
      // Fetch from Admin collection
      userProfile = await Admin.findById(req.userId).select(
        'firstName lastName email role ethereumAddress profilePicture'
      );
      if (!userProfile) {
        console.error(`Admin profile not found for ID: ${req.userId}`);
        return res.status(404).json({ message: 'Admin profile not found' });
      }
    } else {
      console.error(`Invalid role: ${req.userRole}`);
      return res.status(400).json({ message: 'Invalid user role' });
    }

    return res.status(200).json({
      role: req.userRole,
      profile: userProfile,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;



router.get('/ethereum-address', authenticateToken, async (req, res) => {
  try {
    if (!req.ethereumAddress) {
      console.error('Ethereum address not found in token');
      return res.status(404).json({ message: 'Ethereum address not available' });
    }

    return res.status(200).json({ ethereumAddress: req.ethereumAddress });
  } catch (error) {
    console.error('Error fetching Ethereum address:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});