// models/Admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },  // Store hashed password
  ethereumAddress: { type: String, required: true },  // Admin's Ethereum address
  role: { type: String, default: 'admin' }  // New field for admin role, default is 'admin'
});

module.exports = mongoose.model('Admin', adminSchema);
