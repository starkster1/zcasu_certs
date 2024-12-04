
const mongoose = require('mongoose');

const certificateRequestSchema = new mongoose.Schema({
  studentNumber: {
    type: Number,
    required: true,
  },
  institute: {
    type: String,
    required: true,
  },
  ipfsHash: {
    type: String,
    required: true,
    unique: true,
  },
  encryptedKey: {
    type: String,
    required: true,
  },
  iv: {
    type: String,
    required: true,
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
    type: Date,
  },
  blockchainTxHash: {
    type: String,
  },
  metadata: {
    documentType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true, // Ensures mimeType is always included
    },
  },
});

module.exports = mongoose.model('CertificateRequest', certificateRequestSchema);




/*const mongoose = require('mongoose');

const certificateRequestSchema = new mongoose.Schema({
  studentNumber: {
    type: Number,
    required: true,
  },
  institute: {
    type: String,
    required: true,
  },
  ipfsHash: {
    type: String,
    required: true,
    unique: true,
  },
  encryptedKey: {
    type: String,
    required: true,
  },
  iv: {
    type: String,
    required: true,
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
    type: Date,
  },
  blockchainTxHash: {
    type: String,
  },
  metadata: {
    documentType: String,
    description: String,
  },
});

module.exports = mongoose.model('CertificateRequest', certificateRequestSchema);*/
