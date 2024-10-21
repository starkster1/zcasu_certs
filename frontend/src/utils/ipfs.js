import axios from 'axios';

// Function to upload file to Pinata IPFS
export const uploadToIPFS = async (fileBuffer) => {
  // Use the full backend URL for the upload API endpoint
  const url = 'http://localhost:5000/api/upload';

  const data = new FormData();
  data.append('file', fileBuffer);

  try {
    // Make the API request to your backend
    const response = await axios.post(url, data, {
      maxBodyLength: 'Infinity', // Handle large files
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Pinata IPFS Result:', response.data);
    return response.data.IpfsHash; // Return IPFS hash from Pinata response
  } catch (error) {
    console.error('Pinata IPFS Upload Failed:', error);
    throw error;
  }
};
