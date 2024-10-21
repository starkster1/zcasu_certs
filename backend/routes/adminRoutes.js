// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');  // Import your Admin model

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

    const admin = await Admin.findById(req.userId).select('-password');  // Exclude password field
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    return res.status(200).json(admin);
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
