import React, { useState, useEffect } from 'react';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, LinearProgress, Typography, Avatar
} from '@mui/material';
import crypto from 'crypto-browserify';
import { Buffer } from 'buffer';
import { toast } from 'react-toastify';
import { useWallet } from '../../../contexts/WalletContext';
import { useBlockchain } from '../../../hooks/useBlockchain';
import profImage from '../../../assets/prof.jpg';
import './MyDocuments.css'; // Import the CSS module
import CertificateCard from './CertificateCard'; // Import the new component

const MyDocuments = ({ instituteAddress }) => {
  const { account, connectWallet } = useWallet();
  const { registerCertificate, getCertificates, getCertificateDetails } = useBlockchain();
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

  const decryptFileWithAES = async (encryptedData, symmetricKeyBase64, ivBase64) => {
    const symmetricKey = Buffer.from(symmetricKeyBase64, 'base64');
    const iv = Buffer.from(ivBase64, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-cbc', symmetricKey, iv);
    const decryptedData = Buffer.concat([decipher.update(Buffer.from(encryptedData)), decipher.final()]);
    return decryptedData;
  };

  const loadDocuments = async () => {
    if (!account) {
      toast.error("Please connect your wallet to view documents.");
      return;
    }
    try {
      const certificates = await getCertificates(account);
      const updatedDocs = await Promise.all(
        certificates.map(async (cert) => {
          try {
            const details = await getCertificateDetails(cert.ipfsHash);
            return {
              hash: cert.ipfsHash,
              status: details.isRevoked
                ? 'Revoked'
                : details.isValid
                  ? 'Verified'
                  : 'Pending',
              timestamp: Number(cert.timestamp),
            };
          } catch (error) {
            console.error(`Error fetching details for certificate ${cert.ipfsHash}:`, error);
            return {
              hash: cert.ipfsHash,
              status: 'Unknown',
              timestamp: Number(cert.timestamp)
            };
          }
        })
      );
      setDocuments(updatedDocs);
    } catch (error) {
      console.error("Error loading documents:", error);
      toast.error("Failed to load documents.");
    }
  };

  const getDoc = (hash, symmetricKey, iv) => {
    symmetricKey && iv ? viewDecryptedDoc(hash, symmetricKey, iv) : window.open(`https://gateway.pinata.cloud/ipfs/${hash}`, '_blank');
  };

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
      const allowedMimeType = "application/pdf";
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
      const { ipfsHash } = responseData;

      const success = await registerCertificate(ipfsHash, instituteAddress);
      if (success) {
        toast.success("Certificate successfully registered on the blockchain!");
        handleClose();
      } else {
        throw new Error("Blockchain registration failed.");
      }

      toast.success(`Request Submitted! IPFS Hash: ${ipfsHash}`);
      loadDocuments();
    } catch (error) {
      setIsUploading(false);
      console.error("Error during document upload:", error.message);
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-1">My Documents</h2>
          <p className="text-gray-500 mt-0">(Click on the Document name to view)</p>
        </div>
        <div className="image-container">
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 115,
      height: 115,
      borderRadius: '50%',
      backgroundColor: '#CFD8DC',
      padding: 5,
    }}
  >
    <img
      src={profImage}
      alt="User Profile"
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        objectFit: 'cover',
        backgroundColor: '#fff',
      }}
    />
  </div>
</div>


      </div>
      <div className="grid gap-4">
        {documents.length > 0 ? (
          documents.map((doc, index) => (
            <CertificateCard
              key={index}
              index={index}
              doc={doc}
              account={account}
              onView={() => getDoc(doc.hash, doc.symmetricKey, doc.iv)}
            />
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
