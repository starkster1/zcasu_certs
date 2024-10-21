// GenerateJWTSecret.js

const crypto = require('crypto');

// Generate a 256-bit random secret key (32 bytes)
const secret = crypto.randomBytes(32).toString('hex');

console.log(`Generated JWT_SECRET: ${secret}`);
