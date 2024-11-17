// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  studentNumber: { type: String, required: true },
  ethereumAddress: { type: String, required: true }, // New field for Ethereum address
  password: { type: String, required: true },  // Add the password field
  role: { type: String, default: 'student' }
});

module.exports = mongoose.model('User', userSchema);
