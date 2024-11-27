
//models/CertificateRequest.js
const mongoose = require('mongoose');

const certificateRequestSchema = new mongoose.Schema({
  
  studentNumber: {
    type: Number,
    required: true
  },
  ipfsHash: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Verified', 'Revoked'],
    default: 'Pending',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  verificationDate: {
    type: Date, // Stores when the certificate is verified
  },
  blockchainTxHash: {
    type: String, // Optional: Store blockchain transaction hash after verification
  },
  metadata: {
    documentType: String, // Type of document being uploaded
    description: String, // Description of the document
  },
});

module.exports = mongoose.model('CertificateRequest', certificateRequestSchema);
