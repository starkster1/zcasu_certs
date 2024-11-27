require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const http = require('http'); // Required for integrating Socket.IO
const { Server } = require('socket.io'); // Import Socket.IO
const connectDB = require('./db'); // MongoDB connection
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const upload = require('./routes/upload'); // Import upload routes
const adminRoutes = require('./routes/adminRoutes'); // Import admin routes
const studentProfileRoutes = require('./routes/studentProfile');
const certificateRoutes = require('./routes/CertificateRoutes'); // Adjust path as necessary


const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

// Connect to MongoDB
console.log("MONGO_URI:", process.env.MONGO_URI);
connectDB();

// Create HTTP server and initialize Socket.IO
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } }); // Allow all origins for simplicity (configure as needed)

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('New client connected.');

  socket.on('new-certificate-request', (data) => {
    console.log('New certificate request received:', data);
    io.emit('certificate-request-notification', data); // Notify all connected clients
  });

  // Emit a test event to the client
  socket.emit('test-event', { message: 'Hello from server!' });

  // Handle any custom events from the client
  socket.on('custom-event', (data) => {
    console.log('Received custom-event from client:', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected.');
  });
});

// Add a route for the root (GET /)
app.get('/', (req, res) => {
  res.send('Socket.IO server is running!');
});

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api', adminRoutes); // /api/admin-profile
app.use('/api', upload); // /api/upload
app.use('/api/student', studentProfileRoutes); // Student profile routes
app.use('/api', certificateRoutes);




// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = io; // Export io for usage in other files






/*require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');  // MongoDB connection
const profileRoutes = require('./routes/profileRoutes');  // Import profile routes
const authRoutes = require('./routes/authRoutes');  // Import auth routes
const upload = require('./routes/upload'); // Import upload routes
const adminRoutes = require('./routes/adminRoutes');  // Import admin routes
const studentProfileRoutes = require('./routes/studentProfile');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

console.log("MONGO_URI:", process.env.MONGO_URI);
connectDB();  // Only call this once

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use the auth routes for handling authentication-related requests
app.use('/api/auth', authRoutes);

// Use the admin routes
app.use('/api', adminRoutes);  // This makes /api/admin-profile available

// Use the upload routes
app.use('/api', upload); // This makes /api/upload available

app.use('/api/student', studentProfileRoutes); // Register the student profile route

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
*/