const axios = require('axios');

const PINATA_API_KEY = 'e4da6b59c2b33a9cb44b';
const PINATA_SECRET_KEY = 'ee4022572d95b88b82c6ca53806118aae97d9b554bb54ee9835fe36fa887316d';

const uploadToIPFS = async (file, onProgress) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      maxBodyLength: Infinity,
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        if (onProgress) onProgress(percentCompleted);
      },
    });

    return response.data.IpfsHash;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload to IPFS');
  }
};

module.exports = { uploadToIPFS };
