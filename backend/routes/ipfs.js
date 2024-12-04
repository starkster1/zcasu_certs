const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const router = express.Router();

// Multer setup for in-memory file storage
const upload = multer({ storage: multer.memoryStorage() });

const PINATA_API_KEY = 'e4da6b59c2b33a9cb44b';
const PINATA_SECRET_KEY = 'ee4022572d95b88b82c6ca53806118aae97d9b554bb54ee9835fe36fa887316d';

// Route: Upload to IPFS
router.post('/uploadToIPFS', upload.single('file'), async (req, res) => {
  try {
    // Step 1: Verify File is Received
    if (!req.file) {
      console.error('No file uploaded.');
      return res.status(400).json({ error: 'No file uploaded' });
    }
    console.log('File received:', {
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
    });

    // Step 2: Prepare FormData for Pinata API
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // Step 3: Call Pinata API
    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      maxBodyLength: Infinity,
      headers: {
        ...formData.getHeaders(),
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
      },
    });

    console.log('Pinata response:', response.data); // Debugging: Log entire Pinata response

    // Step 4: Return IPFS Hash to Frontend
    if (!response.data || !response.data.IpfsHash) {
      console.error('Pinata response is missing IpfsHash.');
      return res.status(500).json({ error: 'Failed to retrieve IpfsHash from Pinata response.' });
    }

    res.json({ IpfsHash: response.data.IpfsHash });
  } catch (error) {
    // Step 5: Log and Handle Errors
    console.error('Error uploading to IPFS:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to upload to IPFS' });
  }
});

module.exports = router;
