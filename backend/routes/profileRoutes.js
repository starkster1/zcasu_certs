const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');  // For handling file uploads
const User = require('../models/user');
const router = express.Router();

// Middleware to verify the token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authorization header is missing or improperly formatted' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;  // Attach decoded user to request
    next();
  });
};

// Configure multer for file uploads
const upload = multer();

// Route to fetch user profile (return profile picture as base64)
router.get('/user-profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Convert binary image data to base64 string
    const profilePicture = user.profilePicture ? user.profilePicture.toString('base64') : null;

    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      ethereumAddress: user.ethereumAddress,
      profilePicture: profilePicture  // Send base64-encoded image
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route to update profile picture (binary buffer stored in MongoDB)
router.post('/update-profile-picture', authenticateToken, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No profile picture uploaded.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: req.file.buffer },  // Store the uploaded file as a binary buffer
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

// Route to fetch only the profile picture
router.get('/get-profile-picture', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.profilePicture) {
      return res.status(404).json({ message: 'Profile picture not found' });
    }

    // Convert binary image data to base64 string
    const profilePicture = user.profilePicture.toString('base64');

    res.status(200).json({ profilePicture: profilePicture });  // Return only the profile picture
  } catch (error) {
    console.error('Error fetching profile picture:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router;

