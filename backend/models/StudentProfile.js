// models/StudentProfile.js

const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  studentNumber: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  duration: { type: Number, required: true },
  accessLevel: { type: String, enum: ['basic', 'admin'], default: 'basic' },
  studyLevel: { type: String, enum: ['diploma', 'bachelor', 'master'], required: true },
  program: { type: String, required: true },
  schoolOf: { type: String, required: true },
  profilePicture: { type: String, default: null }, // Placeholder for profile picture URL
});

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
