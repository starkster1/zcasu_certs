const multer = require('multer');
const express = require('express');
const router = express.Router();

// Multer configuration for memory storage and file size limits
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

// Middleware to check authorization header
const checkAuth = (req, res, next) => {
  const authToken = req.headers.authorization?.split(' ')[1]; // Supports "Bearer <token>"
  if (!authToken) {
    console.error("[Authorization Error] Missing auth token.");
    return res.status(401).json({ error: "Unauthorized. Missing auth token." });
  }
  next();
};

router.post('/upload', checkAuth, upload.single('file'), async (req, res) => {
  try {
    console.log("[Upload Route] Request received");
    console.log("[Headers]:", req.headers);

    if (!req.file) {
      console.error("[Error] No file uploaded.");
      return res.status(400).json({ error: "No file uploaded." });
    }
    console.log("[File Details]:", req.file);

    // Simulate success response for debugging
    res.status(200).json({ message: "File received successfully" });
  } catch (error) {
    console.error("[Backend Error]:", error.stack);
    res.status(500).json({ error: "Internal server error occurred", details: error.message });
  }
});

module.exports = router;
