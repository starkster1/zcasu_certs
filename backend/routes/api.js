const express = require('express');
const Web3 = require('web3');
const UserModel = require('../models/user');  // User model for MongoDB
const dotenv = require('dotenv');
const StudentProfileABI = require('../contracts/StudentProfileABI.json');

dotenv.config(); // Load environment variables

const router = express.Router();

// Setup web3 with Infura or Ganache (depending on your use case)
const web3 = new Web3(process.env.INFURA_URL || 'http://127.0.0.1:7545');  // Infura URL or Ganache URL

// Get the student profile contract instance using the ABI and deployed contract address
const studentProfileContract = new web3.eth.Contract(
  StudentProfileABI,
  process.env.STUDENT_PROFILE_CONTRACT_ADDRESS // Ensure this address is in your .env
);

// Register user and create blockchain profile
router.post('/register', async (req, res) => {
  const { firstName, lastName, studentNumber, ethereumAddress } = req.body;

  try {
    // Step 1: Save user data in MongoDB
    const newUser = new UserModel({ firstName, lastName, studentNumber, ethereumAddress });
    await newUser.save();

    // Step 2: Interact with Ethereum blockchain to create the profile
    const profileExists = await studentProfileContract.methods
      .getProfile()
      .call({ from: ethereumAddress });

    if (!profileExists) {
      await studentProfileContract.methods
        .createProfile(
          `${firstName} ${lastName}`,
          studentNumber,
          ''  // Optional field for profile picture IPFS hash or additional data
        )
        .send({ from: ethereumAddress, gas: 6721975 });

      res.status(200).json({ message: 'User registered and profile created on blockchain.' });
    } else {
      res.status(200).json({ message: 'User registered but profile already exists on blockchain.' });
    }
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Server error occurred while registering user.' });
  }
});

module.exports = router;
