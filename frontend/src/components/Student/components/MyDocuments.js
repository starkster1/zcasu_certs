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

const MyDocuments = ({ instituteAddress }) => {
  const { account, connectWallet } = useWallet();
  const { registerCertificate, getCertificates } = useBlockchain();
  const [open, setOpen] = useState(false);
  const [certificate, setCertificate] = useState("");
  const [documents, setDocuments] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Ensure wallet is connected and load documents
  useEffect(() => {
    const init = async () => {
      if (!account) {
        await connectWallet();  // Prompt wallet connection if not connected
      } else {
        loadDocuments();
      }
    };
    init();
  }, [account, connectWallet]);

  const loadDocuments = async () => {
    if (!account) return;

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
      toast.error("Failed to load documents");
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

    const success = await registerCertificate(ipfsHash, instituteAddress);
    
    if (success) {
      toast.success("Certificate successfully registered on blockchain!");
      handleClose();
      loadDocuments();
    }
  };

  const getDoc = (hash) => {
    window.open(`https://gateway.pinata.cloud/ipfs/${hash}`, '_blank');
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
                  <h3 className="font-semibold">Document #{index + 1}</h3>
                  <p className="text-sm text-gray-600">Status: {doc.status}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(doc.timestamp * 1000).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button
                variant="contained"
                color="primary"
                onClick={() => getDoc(doc.hash)}
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
    </div>
  );
};

export default MyDocuments;



/*import React, { Component } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, LinearProgress, Typography, Avatar } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { green, red } from '@mui/material/colors';
import { uploadToIPFS } from '../../../utils/ipfs';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import 'react-toastify/dist/ReactToastify.css';
import ZCASUCertificate from '../../../contracts/ZCASUCertificate.json'; // Contract ABI

class MyDocuments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      certificate: "",
      documents: [],
      uploadProgress: 0,
      uploadError: "",
      isUploading: false,
    };
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false, uploadProgress: 0, uploadError: "", certificate: "" });
  };

  captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    this.uploadDocument(file);
  };

  uploadDocument = async (file) => {
    console.log("Uploading document to IPFS...");
    try {
      this.setState({ isUploading: true, uploadProgress: 0, uploadError: "" });

      const ipfsHash = await uploadToIPFS(file, (progress) => {
        console.log("Upload progress:", progress);
        this.setState({ uploadProgress: progress });
      });

      this.setState({ certificate: ipfsHash, isUploading: false });
      toast.success("Document uploaded to IPFS successfully!", { position: "top-right" });
      console.log("IPFS upload complete, hash:", ipfsHash);

      await this.newUpload(ipfsHash);

    } catch (error) {
      this.setState({ uploadError: "Failed to upload document to IPFS", isUploading: false });
      toast.error("Failed to upload document to IPFS. Please try again.", { position: "top-right" });
      console.error("IPFS upload failed:", error);
    }
  };

  newUpload = async (ipfsHash) => {
    // Hardcoded contract and institute addresses
    const contractAddress = "0x1b9025C7081dA1eAb6e150c03e50C893115B0C12"; // Replace with the actual contract address
    const instituteAddress = this.props.instituteAddress; // Assuming instituteAddress is still passed as a prop

    if (!window.ethereum || !contractAddress || !instituteAddress) {
      toast.error("Missing MetaMask or required address. Contact support.");
      console.error("MetaMask not available or contract address not provided.");
      return;
    }

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, ZCASUCertificate.abi, signer);

      // Assuming registration fee is predefined
      const registrationFee = ethers.parseEther("1.0"); // Replace with actual fee if dynamic

      // Register the student and upload the certificate
      const transaction = await contract.registerStudent(instituteAddress, { value: registrationFee });
      console.log("Student registration transaction:", transaction);

      const receipt = await transaction.wait();
      console.log("Transaction receipt:", receipt);

      toast.success("Student successfully registered and certificate uploaded.", { position: "top-right" });
    } catch (error) {
      toast.error("Failed to register student or upload certificate.", { position: "top-right" });
      console.error("Blockchain submission failed:", error);
    }
  };

  render() {
    return (
      <div className="my-documents-container">
        <h2 className="section-title">My Documents</h2>
        <p className="section-subtitle">(Click on the Document name to view)</p>

        {this.state.documents.length > 0 ? (
          this.state.documents.map((doc, index) => (
            <div className="document-card" key={index}>
              <div className="doc-info">
                <Avatar style={{ backgroundColor: doc.status === 'Pending' ? red[500] : green[500] }}>
                  <AssignmentIcon />
                </Avatar>
                <div className="doc-details">
                  <h3>Document #{index + 1}</h3>
                  <p>Status: {doc.status}</p>
                </div>
              </div>
              <Button className="view-btn" onClick={() => this.getDoc(doc.hash)}>VIEW</Button>
            </div>
          ))
        ) : (
          <p>No documents uploaded yet.</p>
        )}

        <Button className="add-doc-btn" onClick={this.handleClickOpen}>ADD NEW DOCUMENT</Button>

        <Dialog open={this.state.open} onClose={this.handleClose}>
          <DialogTitle>Add New Document</DialogTitle>
          <DialogContent>
            <DialogContentText>Upload a Document</DialogContentText>
            <input onChange={this.captureFile} type="file" />

            {this.state.isUploading && (
              <div style={{ marginTop: 20 }}>
                <Typography>Uploading: {this.state.uploadProgress}%</Typography>
                <LinearProgress variant="determinate" value={this.state.uploadProgress} />
              </div>
            )}

            {this.state.uploadError && (
              <Typography color="error" style={{ marginTop: 10 }}>{this.state.uploadError}</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">Cancel</Button>
            <Button onClick={() => this.newUpload(this.state.certificate)} color="primary" disabled={this.state.isUploading || !this.state.certificate}>Upload</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default MyDocuments;
*/








/*
import React from "react";
import { IoClose } from "react-icons/io5";
import { FaCheckCircle, FaClock } from "react-icons/fa";

const CertificateViewer = ({ onClose = () => {} }) => {
  const studentData = {
    fullName: "John Michael Smith",
    studentNumber: "2023-ABC-12345",
    program: "Bachelor of Science in Computer Science",
    level: "Undergraduate",
    school: "School of Computing and Technology",
    programDuration: "4 Years",
    certificateTitle: "Degree Certificate",
    issueDate: "2023-12-15",
    status: "verified",
    issuer: "University of Technology",
    certificateUrl: "https://ipfs.example.com/certificate/abc123"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 overflow-y-auto p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
     
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Certificate Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IoClose className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-8">
        
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Student Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{studentData.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Student Number</p>
                <p className="font-medium">{studentData.studentNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Program</p>
                <p className="font-medium">{studentData.program}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Level</p>
                <p className="font-medium">{studentData.level}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">School</p>
                <p className="font-medium">{studentData.school}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Program Duration</p>
                <p className="font-medium">{studentData.programDuration}</p>
              </div>
            </div>
          </div>

         
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Certificate Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Certificate Title</p>
                <p className="font-medium">{studentData.certificateTitle}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Issue Date</p>
                <p className="font-medium">{studentData.issueDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <div className="flex items-center space-x-2">
                  {studentData.status === "verified" ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <FaCheckCircle className="mr-2" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      <FaClock className="mr-2" />
                      Pending
                    </span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Issuer</p>
                <p className="font-medium">{studentData.issuer}</p>
              </div>
            </div>
          </div>

      
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Certificate Preview</h3>
            <div className="aspect-w-16 aspect-h-12 rounded-lg overflow-hidden border border-gray-200">
              <iframe
                src={studentData.certificateUrl}
                title="Certificate Preview"
                className="w-full h-full"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateViewer;


*/