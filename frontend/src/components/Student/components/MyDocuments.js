import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  LinearProgress,
  Typography,
  Avatar
} from '@mui/material';
import { uploadToIPFS } from '../../../utils/ipfs';
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

  const loadDocuments = async () => {
    if (!account) {
      toast.error("Please connect your wallet to view documents.");
      return;
    }
    try {
      const certificates = await getCertificates(account); 
      const formattedDocs = certificates.map((cert) => ({
        hash: cert.ipfsHash,
        status: cert.isValid ? 'Verified' : 'Pending',
        timestamp: Number(cert.timestamp)
      }));
      setDocuments(formattedDocs);
    } catch (error) {
      console.error("Error loading documents:", error);
      toast.error("Failed to load documents.");
    }
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
    if (!account) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setUploadError("");

      const ipfsHash = await uploadToIPFS(file, (progress) => {
        setUploadProgress(progress);
      });

      setCertificate(ipfsHash);
      setIsUploading(false);
      toast.success("Document uploaded to IPFS successfully!");
      await newUpload(ipfsHash);
    } catch (error) {
      setUploadError("Failed to upload document to IPFS");
      setIsUploading(false);
      toast.error("Failed to upload document to IPFS. Please try again.");
      console.error("IPFS upload failed:", error);
    }
  };
  const newUpload = async (ipfsHash) => {
    if (!account) {
      toast.error("Please connect your wallet first");
      return;
    }
  
    const studentNumber = localStorage.getItem('studentNumber');
    if (!studentNumber) {
      toast.error("Missing studentNumber. Please log in again.");
      return;
    }
  
    const payload = {
      studentNumber,
      institute: instituteAddress,
      ipfsHash,
      metadata: {
        documentType: "Certificate", // Example: Static or dynamic value
        description: "Uploaded by student for approval",
      },
    };
  
    console.log('Submitting certificate request:', payload);
  
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authorization token is missing. Please log in again.');
      }
  
      // Send the certificate request to the server
      const response = await fetch('http://localhost:5000/api/certificate-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error("Response error:", data);
        throw new Error(data.message || 'Failed to create certificate request.');
      }
  
      console.log('Certificate request created successfully:', data);
      toast.success("Certificate request successfully sent for approval!");
  
      // Register the certificate on the blockchain
      const success = await registerCertificate(ipfsHash, instituteAddress);
      if (success) {
        toast.success("Certificate successfully registered on the blockchain!");
      } else {
        throw new Error("Blockchain registration failed.");
      }
  
      // Reload documents and close the dialog
      handleClose();
      loadDocuments();
    } catch (error) {
      console.error("Error creating certificate request:", error.message);
      toast.error(`Failed to create certificate request. ${error.message}`);
    }
  };
  
  const getDoc = (hash) => {
    window.open(`https://gateway.pinata.cloud/ipfs/${hash}`, '_blank');
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
                    Upload Date: {new Date(doc.timestamp * 1000).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button
                variant="contained"
                color="primary"
                onClick={() => getDoc(doc.hash)}
                className={styles.viewButton}
              >
                VIEW
              </Button>
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
            onClick={() => newUpload(certificate)}
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


/*
import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  LinearProgress, 
  Typography, 
  Avatar 
} from '@mui/material';
import { FileText } from 'lucide-react';
import { uploadToIPFS } from '../../../utils/ipfs';
import { toast } from 'react-toastify';
import { useWallet } from '../../../contexts/WalletContext';
import { useBlockchain } from '../../../hooks/useBlockchain';
import CertificateViewer from './CertificateViewer';

const MyDocuments = ({ instituteAddress }) => {
  const { account, connectWallet } = useWallet();
  const { registerCertificate, getCertificates } = useBlockchain();
  const [open, setOpen] = useState(false);
  const [certificate, setCertificate] = useState("");
  const [documents, setDocuments] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Ensure wallet is connected and load documents
  useEffect(() => {
    const init = async () => {
      if (!account) {
        await connectWallet(); // Ensure wallet is connected
      } 
      if (account) {
        loadDocuments();
      }
    };
    init();
  }, [account, connectWallet]);

  const loadDocuments = async () => {
    if (!account) {
      toast.error("Please connect your wallet to view documents.");
      return;
    }
    try {
      const certificates = await getCertificates(account); // Fetch certificates
      const formattedDocs = certificates.map((cert) => ({
        hash: cert.ipfsHash,
        status: cert.isValid ? 'Verified' : 'Pending',
        timestamp: Number(cert.timestamp),
        certificateUrl: `https://gateway.pinata.cloud/ipfs/${cert.ipfsHash}`,
      }));

      setDocuments(formattedDocs); // Update state
    } catch (error) {
      console.error("Error loading documents:", error);
      toast.error("Failed to load documents.");
    }
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
    if (!account) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setUploadError("");

      const ipfsHash = await uploadToIPFS(file, (progress) => {
        setUploadProgress(progress);
      });

      setCertificate(ipfsHash);
      setIsUploading(false);
      toast.success("Document uploaded to IPFS successfully!");
      await newUpload(ipfsHash); // Register document on blockchain
    } catch (error) {
      setUploadError("Failed to upload document to IPFS");
      setIsUploading(false);
      toast.error("Failed to upload document to IPFS. Please try again.");
      console.error("IPFS upload failed:", error);
    }
  };

  const newUpload = async (ipfsHash) => {
    if (!account) {
      toast.error("Please connect your wallet first");
      return;
    }
    const success = await registerCertificate(ipfsHash, instituteAddress);
    if (success) {
      toast.success("Certificate successfully registered on blockchain!");
      handleClose();
      loadDocuments();
    }
  };

  const handleView = (doc) => {
    setSelectedDocument({
      ...doc,
      fullName: "John Michael Smith", // Placeholder data for student information
      studentNumber: "2023-ABC-12345",
      program: "Bachelor of Science in Computer Science",
      level: "Undergraduate",
      school: "School of Computing and Technology",
      programDuration: "4 Years",
      certificateTitle: "Degree Certificate",
      issueDate: new Date(doc.timestamp * 1000).toLocaleDateString(),
      issuer: "University of Technology",
    });
  };

  const handleCloseViewer = () => {
    setSelectedDocument(null); // Close modal by setting selected document to null
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">My Documents</h2>
        <p className="text-gray-600">(Click on the Document name to view)</p>
      </div>

      <div className="grid gap-4">
        {documents.length > 0 ? (
          documents.map((doc, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className={`${doc.status === 'Pending' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                  <FileText className="h-5 w-5" />
                </Avatar>
                <div>
                  <h3 className="font-semibold">Certificate #{index + 1}</h3>
                  <p className="text-sm text-gray-600">Status: {doc.status}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(doc.timestamp * 1000).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleView(doc)} // Open modal with document details
                className="bg-blue-600 hover:bg-blue-700"
              >
                VIEW
              </Button>
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
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700"
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
            onClick={() => newUpload(certificate)}
            color="primary"
            disabled={isUploading || !certificate}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {selectedDocument && (
        <CertificateViewer studentData={selectedDocument} onClose={handleCloseViewer} />
      )}
    </div>
  );
};

export default MyDocuments;


*/