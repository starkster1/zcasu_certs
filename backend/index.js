require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');  // MongoDB connection
const profileRoutes = require('./routes/profileRoutes');  // Import profile routes
const authRoutes = require('./routes/authRoutes');  // Import auth routes
const upload = require('./routes/upload'); // Import upload routes
const adminRoutes = require('./routes/adminRoutes');  // Import admin routes

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

console.log("MONGO_URI:", process.env.MONGO_URI);
connectDB();  // Only call this once

// Use the auth routes for handling authentication-related requests
app.use('/api/auth', authRoutes);

// Use the profile routes
app.use('/api', profileRoutes); // This makes /api/user-profile available

// Use the admin routes
app.use('/api', adminRoutes);  // This makes /api/admin-profile available

// Use the upload routes
app.use('/api', upload); // This makes /api/upload available

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
