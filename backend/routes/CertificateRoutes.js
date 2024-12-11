const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const FormData = require("form-data");
const axios = require("axios");
const CertificateRequest = require("../models/CertificateRequest");

const router = express.Router();

// Multer setup for file upload
const upload = multer({ storage: multer.memoryStorage() });

// AES encryption for files
const encryptFileWithAES = (fileBuffer) => {
  const symmetricKey = crypto.randomBytes(32); // 256-bit AES key
  const iv = crypto.randomBytes(16);          // Initialization vector
  const cipher = crypto.createCipheriv("aes-256-cbc", symmetricKey, iv);
  const encryptedData = Buffer.concat([cipher.update(fileBuffer), cipher.final()]);
  return { encryptedData, symmetricKey, iv };
};

router.post("/certificate-requests", upload.single("file"), async (req, res) => {
  try {
    const { studentNumber, institute, metadata } = req.body;

    if (!req.file) return res.status(400).json({ message: "File is required." });
    if (!institute) return res.status(400).json({ message: "Institute address is required." });

    // Enforce PDF file uploads
    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Only PDF files are allowed for certificate uploads." });
    }

    let parsedMetadata;
    try {
      parsedMetadata = JSON.parse(metadata);
    } catch {
      return res.status(400).json({ message: "Invalid metadata format." });
    }

     // Add MIME type to metadata
     parsedMetadata.mimeType = req.file.mimetype;

    // Step 1: Encrypt file
    const { encryptedData, symmetricKey, iv } = encryptFileWithAES(req.file.buffer);

    // Step 2: Upload encrypted file to IPFS
    const formData = new FormData();
    formData.append("file", Buffer.from(encryptedData), {
      filename: `${req.file.originalname}-encrypted`,
      contentType: req.file.mimetype,
    });

    let ipfsHash;
    try {
      const ipfsResponse = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            pinata_api_key: "e4da6b59c2b33a9cb44b",
            pinata_secret_api_key: "ee4022572d95b88b82c6ca53806118aae97d9b554bb54ee9835fe36fa887316d",
          },
        }
      );
      ipfsHash = ipfsResponse.data.IpfsHash;
    } catch (error) {
      console.error("IPFS upload error:", error.response?.data || error.message);
      return res.status(500).json({ message: "Failed to upload file to IPFS." });
    }

    // Step 3: Save to database
    const newRequest = new CertificateRequest({
      studentNumber,
      institute,
      ipfsHash,
      encryptedKey: symmetricKey.toString("base64"),
      iv: iv.toString("base64"),
      metadata: parsedMetadata,
      status: "Pending",
    });

    await newRequest.save();
    res.status(201).json({
      message: "Certificate request submitted successfully.",
      requestId: newRequest._id,
      ipfsHash,
    });
  } catch (error) {
    console.error("Error in /certificate-requests:", error.message);
    res.status(500).json({ message: "Failed to process certificate request.", error: error.message });
  }
});


// Route: Get Certificate Requests by Status
router.get("/certificate-requests", async (req, res) => {
  try {
    const { status } = req.query;

    if (!status) {
      return res.status(400).json({ message: "Status query parameter is required." });
    }

    console.log("Fetching certificate requests with status:", status);

    const requests = await CertificateRequest.find({ status }).select(
      "_id studentNumber ipfsHash status institute timestamp metadata encryptedKey iv"
    );

    if (!requests.length) {
      return res.status(404).json({ message: "No certificate requests found for the given status." });
    }

    res.status(200).json({ requests });
  } catch (error) {
    console.error("Error fetching certificate requests:", error.message);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
});


// Route: Update Certificate Request Status
router.post("/update-request-status", async (req, res) => {
  try {
    const { requestId, status } = req.body;

    // Validate input
    if (!requestId || !status) {
      return res.status(400).json({ message: "Request ID and status are required." });
    }

    console.log(`Updating status for request ID: ${requestId} to: ${status}`);

    // Find the request by ID
    const request = await CertificateRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Certificate request not found." });
    }

    // Update the status
    request.status = status;

    if (status === "Verified") {
      request.verificationDate = new Date(); // Add verification timestamp
    }

    await request.save();

    console.log(`Status updated successfully for request ID: ${requestId}`);

    // Emit an event via Socket.IO if connected
    if (req.app.get("socketio")) {
      req.app.get("socketio").emit("certificate-status-updated", {
        requestId,
        status,
        verificationDate: request.verificationDate || null,
      });
    }

    // Return a success response
    res.status(200).json({ message: "Request status updated successfully.", request });
  } catch (error) {
    console.error("Error updating request status:", error.message);
    res.status(500).json({ message: "Failed to update request status.", error: error.message });
  }
});


module.exports = router;