const axios = require('axios');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const FormData = require('form-data');
const upload = multer();

router.post('/upload', upload.single('file'), async (req, res) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  // Check that the file was received
  if (!req.file) {
    console.error("No file uploaded in the request.");
    return res.status(400).json({ error: "No file uploaded." });
  }

  // Set up form data for Pinata
  const fileBuffer = req.file.buffer;
  const data = new FormData();
  data.append('file', fileBuffer, { filename: 'uploadedDocument' });

  try {
    const response = await axios.post(url, data, {
      maxBodyLength: 'Infinity',
      headers: {
        ...data.getHeaders(),
        'pinata_api_key': process.env.PINATA_API_KEY,
        'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY,
      },
    });
    console.log("IPFS upload successful, hash:", response.data.IpfsHash);
    res.json({ IpfsHash: response.data.IpfsHash });
  } catch (error) {
    console.error("Error uploading to IPFS:", error.message);
    res.status(500).json({ error: 'Failed to upload to IPFS' });
  }
});

module.exports = router;
