const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Import the user model
const router = express.Router();

// Middleware to verify the token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Route to update profile picture
router.post('/update-profile-picture', authenticateToken, async (req, res) => {
  const { profilePicture } = req.body;

  if (!profilePicture) {
    return res.status(400).json({ error: 'Profile picture is required' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePicture },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Profile picture updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
