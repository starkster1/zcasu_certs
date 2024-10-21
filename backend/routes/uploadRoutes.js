// uploadRoutes.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const router = express.Router();

const apiKey = process.env.IPFS_PROJECT_ID;
const secretKey = process.env.IPFS_PROJECT_SECRET;

// Configure Multer for file uploads
const upload = multer();

// Proxy endpoint to upload to IPFS
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Create a new form and append the file buffer to it
    const form = new FormData();
    form.append('file', req.file.buffer, req.file.originalname);

    // Send the form data to Pinata
    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', form, {
      headers: {
        'pinata_api_key': apiKey,
        'pinata_secret_api_key': secretKey,
        ...form.getHeaders() // Include form headers
      }
    });

    // Send back the response from Pinata (IPFS hash)
    res.json(response.data);
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    res.status(500).send('Error uploading file');
  }
});

module.exports = router;
