// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  studentNumber: { type: String, required: true },
  email: { type: String, required: true },
  ethereumAddress: { type: String, required: true }, // New field for Ethereum address
  profilePicture: { type: Buffer, default: null },  //store image as a binary buffer
  password: { type: String, required: true },  // Add the password field
  role: { type: String, default: 'student' }
});

module.exports = mongoose.model('User', userSchema);
