// routes/user.js
const express = require('express');
const User = require('../../../backend/models/user');
const router = express.Router();

// Create new user with Ethereum address
router.post('/signup', async (req, res) => {
  const { firstName, lastName, studentNumber, email, ethereumAddress } = req.body;

  try {
    // Check if Ethereum address is already registered
    const existingUser = await User.findOne({ ethereumAddress });
    if (existingUser) {
      return res.status(400).json({ message: 'Ethereum address already registered' });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      studentNumber,
      email,
      ethereumAddress,
    });

    await user.save();
    res.status(201).json({ message: 'User signed up successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error signing up user', error });
  }
});

module.exports = router;
