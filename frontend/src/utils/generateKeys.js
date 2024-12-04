// utils/generateKeys.js
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Directory to save keys
const keysDir = path.resolve(__dirname, '../keys');

// Ensure the keys directory exists
if (!fs.existsSync(keysDir)) {
  fs.mkdirSync(keysDir);
}

// Generate RSA key pair
const generateKeyPair = () => {
  try {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048, // 2048-bit key size for security
      publicKeyEncoding: {
        type: 'spki', // Recommended format for public keys
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8', // Recommended format for private keys
        format: 'pem',
      },
    });

    // Save the public key
    const publicKeyPath = path.join(keysDir, 'university_public.pem');
    fs.writeFileSync(publicKeyPath, publicKey);
    console.log(`Public key saved at: ${publicKeyPath}`);

    // Save the private key
    const privateKeyPath = path.join(keysDir, 'university_private.pem');
    fs.writeFileSync(privateKeyPath, privateKey);
    console.log(`Private key saved at: ${privateKeyPath}`);

    console.log('RSA key pair generated successfully.');
  } catch (error) {
    console.error('Error generating RSA key pair:', error.message);
  }
};

generateKeyPair();
