const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const StudentProfile = require('../models/StudentProfile');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save uploads to 'uploads/' directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and JPG files are allowed'), false);
    }
  },
});

// Endpoint to save student profile data
router.post('/saveProfile', async (req, res) => {
  const {
    studentNumber,
    firstName,
    lastName,
    email,
    program,
    schoolOf,
    startDate,
    endDate,
    duration,
    accessLevel,
    studyLevel,
  } = req.body;

  try {
    const newStudentProfile = new StudentProfile({
      studentNumber,
      firstName,
      lastName,
      email,
      program,
      schoolOf,
      startDate,
      endDate,
      duration,
      accessLevel,
      studyLevel,
      profilePicture: null, // Initialize with null
    });

    await newStudentProfile.save();
    res.status(201).json({ message: 'Profile saved successfully!' });
  } catch (error) {
    console.error('Error saving student profile:', error);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

// Endpoint to update profile picture
router.post('/updateProfilePicture', upload.single('profilePicture'), async (req, res) => {
  const { studentNumber } = req.body;

  try {
    const student = await StudentProfile.findOne({ studentNumber });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Update the profile picture
    student.profilePicture = `/uploads/${req.file.filename}`;
    await student.save();

    res.status(200).json({ message: 'Profile picture updated successfully!' });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ error: 'Failed to update profile picture' });
  }
});

// routes/studentRoutes.js (Updated fetchProfile endpoint)

router.get('/fetchProfile/:studentNumber', async (req, res) => {
  const { studentNumber } = req.params;

  console.log(`Request received to fetch profile for student number: ${studentNumber}`);

  try {
    if (!studentNumber) {
      console.error('No student number provided in request params');
      return res.status(400).json({ error: 'Student number is required' });
    }

    // Log database query attempt
    console.log(`Attempting to query database for student number: ${studentNumber}`);

    const studentProfile = await StudentProfile.findOne({ studentNumber });

    if (!studentProfile) {
      console.warn(`No profile found in database for student number: ${studentNumber}`);
      return res.status(404).json({ error: 'Student profile not found' });
    }

    // Log successful query
    console.log(`Successfully retrieved profile: ${JSON.stringify(studentProfile)}`);
    res.status(200).json(studentProfile);

  } catch (error) {
    console.error(`Error occurred while fetching profile for student number: ${studentNumber}`, error);
    res.status(500).json({ error: 'Failed to fetch student profile' });
  }
});


module.exports = router;





/*const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const StudentProfile = require('../models/StudentProfile');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save uploads to 'uploads/' directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and JPG files are allowed'), false);
    }
  },
});

// Endpoint to save student profile data
router.post('/saveProfile', async (req, res) => {
  const {
    studentNumber,
    firstName,
    lastName,
    email,
    program,
    schoolOf,
    startDate,
    endDate,
    duration,
    accessLevel,
    studyLevel,
  } = req.body;

  try {
    const newStudentProfile = new StudentProfile({
      studentNumber,
      firstName,
      lastName,
      email,
      program,
      schoolOf,
      startDate,
      endDate,
      duration,
      accessLevel,
      studyLevel,
      profilePicture: null, // Initialize with null
    });

    await newStudentProfile.save();
    res.status(201).json({ message: 'Profile saved successfully!' });
  } catch (error) {
    console.error('Error saving student profile:', error);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

// Endpoint to update profile picture
router.post('/updateProfilePicture', upload.single('profilePicture'), async (req, res) => {
  const { studentNumber } = req.body;

  try {
    const student = await StudentProfile.findOne({ studentNumber });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Update the profile picture
    student.profilePicture = `/uploads/${req.file.filename}`;
    await student.save();

    res.status(200).json({ message: 'Profile picture updated successfully!' });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ error: 'Failed to update profile picture' });
  }
});

module.exports = router;
*/