import React, { useState, useEffect } from 'react';
import {Button,Dialog,DialogTitle,
  DialogContent, DialogContentText,DialogActions, LinearProgress, Typography, Avatar} from '@mui/material';
import crypto from 'crypto-browserify';
import { Buffer } from 'buffer';

import { toast } from 'react-toastify';
import { useWallet } from '../../../contexts/WalletContext';
import { useBlockchain } from '../../../hooks/useBlockchain';
import profImage from '../../../assets/prof.jpg';
import styles from './MyDocuments.module.css'; // Import the CSS module
import {FiAward} from "react-icons/fi";

const MyDocuments = ({ instituteAddress }) => {
  const { account, connectWallet } = useWallet();
  const { registerCertificate, getCertificates } = useBlockchain();
  const [open, setOpen] = useState(false);
  const [certificate, setCertificate] = useState("");
  const [documents, setDocuments] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!account) {
        await connectWallet(); 
      } 
      if (account) {
        loadDocuments();
      }
    };
    init();
  }, [account, connectWallet]);

  /*const encryptFileWithAES = async (file) => {
    const symmetricKey = crypto.randomBytes(32); // Generate a random 256-bit AES key
    const iv = crypto.randomBytes(16);           // Initialization vector
    const fileBuffer = await file.arrayBuffer();
    const cipher = crypto.createCipheriv('aes-256-cbc', symmetricKey, iv);
    const encryptedData = Buffer.concat([cipher.update(Buffer.from(fileBuffer)), cipher.final()]);
    return { encryptedData, symmetricKey, iv };
  };*/

  const decryptFileWithAES = async (encryptedData, symmetricKeyBase64, ivBase64) => {
    const symmetricKey = Buffer.from(symmetricKeyBase64, 'base64');
    const iv = Buffer.from(ivBase64, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-cbc', symmetricKey, iv);
    const decryptedData = Buffer.concat([decipher.update(Buffer.from(encryptedData)), decipher.final()]);
    return decryptedData;
  };


  const loadDocuments = async () => {
    try {
      const certificates = await getCertificates(account);
      const formattedDocs = certificates.map((cert) => ({
        hash: cert.ipfsHash,
        status: cert.isValid ? 'Verified' : 'Pending',
        timestamp: cert.timestamp,
        symmetricKey: cert.symmetricKey,
        iv: cert.iv
      }));
      setDocuments(formattedDocs);
    } catch (error) {
      toast.error("Failed to load documents.");
    }
  };

  const getDoc = (hash, symmetricKey, iv) => {
    symmetricKey && iv ? viewDecryptedDoc(hash, symmetricKey, iv) : window.open(`https://gateway.pinata.cloud/ipfs/${hash}`, '_blank');
  };


  const handleClickOpen = () => {
    if (!account) {
      toast.error("Please connect your wallet first");
      return;
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setUploadProgress(0);
    setUploadError("");
    setCertificate("");
  };

  const captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files?.[0];
    if (file) {
      uploadDocument(file);
    }
  };


  const uploadDocument = async (file) => {
    try {
      const allowedMimeType = "application/pdf"; // Only allow PDFs
  
      if (file.type !== allowedMimeType) {
        throw new Error("Only PDF files are allowed for certificate uploads.");
      }
  
      const studentNumber = localStorage.getItem("studentNumber");
      const token = localStorage.getItem("authToken");
  
      if (!studentNumber) throw new Error("Student number is missing.");
      if (!token) throw new Error("Authentication token is missing.");
  
      const metadata = {
        documentType: "Certificate",
        description: "Certificate approval",
      };
  
      const formData = new FormData();
      formData.append("file", file);
      formData.append("studentNumber", studentNumber);
      formData.append("institute", instituteAddress);
      formData.append("metadata", JSON.stringify(metadata));
  
      console.log("Submitting FormData to backend...");
      setIsUploading(true);
  
      const response = await fetch("http://localhost:5000/api/certificate-requests", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      setIsUploading(false);
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload document.");
      }
  
      const responseData = await response.json();
      console.log("Certificate Request Successful:", responseData);
      toast.success(`Request Submitted! IPFS Hash: ${responseData.ipfsHash}`);
      loadDocuments(); // Refresh documents list.
    } catch (error) {
      setIsUploading(false);
      console.error("Error during document upload:", error.message);
      toast.error(`Error: ${error.message}`);
    }
  };
  
  /*const uploadDocument = async (file) => {
    try {
      const studentNumber = localStorage.getItem("studentNumber");
      const token = localStorage.getItem("authToken");
  
      if (!studentNumber) throw new Error("Student number is missing.");
      if (!token) throw new Error("Authentication token is missing.");
  
      const metadata = {
        documentType: "Certificate",
        description: "Certificate approval",
      };
  
      const formData = new FormData();
      formData.append("file", file);
      formData.append("studentNumber", studentNumber);
      formData.append("institute", instituteAddress);
      formData.append("metadata", JSON.stringify(metadata));
  
      console.log("Submitting FormData to backend...");
      setIsUploading(true);
  
      const response = await fetch("http://localhost:5000/api/certificate-requests", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      setIsUploading(false);
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload document.");
      }
  
      const responseData = await response.json();
      console.log("Certificate Request Successful:", responseData);
      toast.success(`Request Submitted! IPFS Hash: ${responseData.ipfsHash}`);
      loadDocuments(); // Refresh documents list.
    } catch (error) {
      setIsUploading(false);
      console.error("Error during document upload:", error.message);
      toast.error(`Error: ${error.message}`);
    }
  };
  */
  
  const viewDecryptedDoc = async (hash, symmetricKeyBase64, ivBase64) => {
    try {
      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${hash}`);
      const encryptedData = await response.arrayBuffer();
      const decryptedData = await decryptFileWithAES(encryptedData, symmetricKeyBase64, ivBase64);
      const blob = new Blob([decryptedData]);
      window.open(URL.createObjectURL(blob), '_blank');
    } catch (error) {
      toast.error("Failed to decrypt or open the document.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-1">My Documents</h2>
          <p className="text-gray-500 mt-0">(Click on the Document name to view)</p>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 115,          // Adjust the outer container size as needed
            height: 115,
            borderRadius: '50%', // Keeps it circular
            backgroundColor: '#CFD8DC', // Light gray color for the border
            padding: 5,          // Controls the inner gap between the border and image
          }}
        >
          <img
            src={profImage} // Replace with your image source
            alt="User Profile"
            style={{
              width: '100%',        // Image should fill the container
              height: '100%',
              borderRadius: '50%',  // Keeps the image circular
              objectFit: 'cover',   // Ensures image covers the area without distortion
              padding: 5,           // Inner padding within the image to maintain gap from border
              backgroundColor: '#fff', // White background around the image
            }}
          />
        </div>
      </div>
      <div className="grid gap-4">
      {documents.length > 0 ? (
        documents.map((doc, index) => (
          <div key={index} className={styles.certificateCard}>
            <div className={styles.ribbon}></div> 
            <div className={styles.certificateContent}>
              <Avatar className={`${doc.status === 'Pending' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                <FiAward className="h-5 w-5" />
              </Avatar>
              <div>
                <h3 className="font-semibold">Certificate #{index + 1}</h3>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">Status: {doc.status}</p>
                  <p className="text-sm text-gray-600 text-right">
                    Uploader: {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'N/A'}
                  </p>
                </div>
                <p className="text-xs text-gray-600">
                  Upload Date: {new Date(Number(doc.timestamp) * 1000).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Button onClick={() => getDoc(doc.hash, doc.symmetricKey, doc.iv)}>VIEW</Button>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600 py-8">
          {account ? "No documents uploaded yet." : "Please connect your wallet to view documents."}
        </p>
      )}

      </div>


      <Button
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
        className="mt-6 w-full bg-blue-600 hover-bg-blue-700"
        disabled={!account}
      >
        ADD NEW DOCUMENT
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Document</DialogTitle>
        <DialogContent>
          <DialogContentText className="mb-4">
            Upload a Document to IPFS and register it on the blockchain
          </DialogContentText>
          <input
            type="file"
            onChange={captureFile}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {isUploading && (
            <div className="mt-4">
              <Typography>Uploading: {uploadProgress}%</Typography>
              <LinearProgress variant="determinate" value={uploadProgress} />
            </div>
          )}
          {uploadError && (
            <Typography color="error" className="mt-2">
              {uploadError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => uploadDocument(certificate)}
            color="primary"
            disabled={isUploading || !certificate}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default MyDocuments;