const express = require('express');
const router = express.Router();
const CertificateRequest = require('../models/CertificateRequest');
const jwt = require('jsonwebtoken');  // Don't forget to require jwt if you haven't already!

// Define the authenticateToken function once
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[AUTH] Decoded JWT payload:', decoded);  // Log decoded token
    req.studentNumber = decoded.studentNumber;  // Set studentNumber from the token
    req.userRole = decoded.role;  // Set userRole from the token
    next();  // Proceed to the next middleware
  } catch (error) {
    console.error('[AUTH] Token verification failed:', error);
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

router.post('/certificate-requests', authenticateToken, async (req, res) => {
  console.log('Request received:', req.body);

  try {
    const { ipfsHash, institute, metadata } = req.body;
    const studentNumber = parseInt(req.studentNumber, 10);

    // Validate `studentNumber`
    if (!studentNumber || isNaN(studentNumber)) {
      return res.status(400).json({ message: 'Invalid or missing studentNumber.' });
    }

    // Validate `ipfsHash`
    if (!ipfsHash || typeof ipfsHash !== 'string') {
      return res.status(400).json({ message: 'Invalid IPFS hash.' });
    }

    // Validate `institute`
    if (!institute || typeof institute !== 'string') {
      return res.status(400).json({ message: 'Invalid institute address.' });
    }

    // Validate `metadata`
    if (!metadata || typeof metadata !== 'object') {
      return res.status(400).json({ message: 'Invalid metadata object.' });
    }

    // Check for existing certificate request
    const existingRequest = await CertificateRequest.findOne({ ipfsHash });
    if (existingRequest) {
      return res.status(400).json({ message: 'Certificate request already exists.' });
    }

    // Create and save new certificate request
    const newRequest = new CertificateRequest({
      studentNumber,
      institute,
      ipfsHash,
      metadata,
    });

    await newRequest.save();

    console.log('Certificate request created:', newRequest);

    // Emit notification if Socket.IO is available
    if (global.io) {
      global.io.emit('certificate-request-notification', {
        student: studentNumber,
        institute,
        ipfsHash,
        metadata,
        timestamp: newRequest.createdAt,
      });
    } else {
      console.warn('Socket.IO instance (global.io) not found. Event not emitted.');
    }

    // Send success response
    res.status(201).json({
      message: 'Certificate request submitted successfully.',
      request: newRequest,
    });
  } catch (error) {
    console.error('Error creating certificate request:', error.message);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
});


// routes/CertificateRoutes.js

// Get certificate requests by status
router.get('/certificate-requests', authenticateToken, async (req, res) => {
  try {
    const { status } = req.query;

    if (!status) {
      return res.status(400).json({ message: 'Status query parameter is required.' });
    }

    // Fetch certificate requests by status
    const requests = await CertificateRequest.find({ status }).select('studentNumber ipfsHash status institute timestamp metadat');

    if (!requests.length) {
      return res.status(404).json({ message: 'No certificate requests found for the given status.' });
    }

    res.status(200).json({ requests });
  } catch (error) {
    console.error('Error fetching certificate requests:', error.message);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
});

/*// Get certificate requests by status
router.get('/certificate-requests', authenticateToken, async (req, res) => {
  try {
    const { status } = req.query;

    if (!status) {
      return res.status(400).json({ message: 'Status query parameter is required.' });
    }

    // Filter certificate requests by status
    const requests = await CertificateRequest.find({ status });

    // Ensure the response includes `studentNumber`
    const enrichedRequests = requests.map((req) => ({
      _id: req._id,
      student: req.student, // Student number
      institute: req.institute,
      ipfsHash: req.ipfsHash,
      status: req.status,
      createdAt: req.timestamp,
    }));

    if (!enrichedRequests.length) {
      return res.status(404).json({ message: 'No certificate requests found for the given status.' });
    }

    res.status(200).json({ requests: enrichedRequests });
  } catch (error) {
    console.error('Error fetching certificate requests:', error.message);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
});*/

// Update request status route
router.post('/update-request-status', authenticateToken, async (req, res) => {
  try {
    const { requestId, status } = req.body;

    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const request = await CertificateRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Certificate request not found.' });
    }

    request.status = status;
    if (status === 'Verified') {
      request.verificationDate = new Date();
    }
    await request.save();

    // Emit notification if Socket.IO is available
    io.emit('certificate-status-updated', { requestId, status, verificationDate: request.verificationDate });

    res.status(200).json({ message: 'Request status updated successfully.', request });
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
