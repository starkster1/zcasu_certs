import React, { Component } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, LinearProgress, Typography, Avatar } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { green } from '@mui/material/colors';
import { uploadToIPFS } from '../../../utils/ipfs';  // IPFS utility

class MyDocuments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      certificate: "",
      documents: [],
      lastUploaderName: "",
      lastUploaderAddress: "",
      uploadProgress: 0,   // Track progress of file upload
      uploadError: "",     // Store any upload error
      isUploading: false,  // Track upload status
    };
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false, uploadProgress: 0, uploadError: "" });
  };

  captureFile = event => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.uploadDocument(Buffer(reader.result));
    };
  };

  uploadDocument = async (fileBuffer) => {
    try {
      this.setState({ isUploading: true, uploadProgress: 0, uploadError: "" });

      const ipfsHash = await uploadToIPFS(fileBuffer, this.updateProgress);  // Pass progress update function
      this.setState({ certificate: ipfsHash, isUploading: false });
    } catch (error) {
      this.setState({ uploadError: "Failed to upload document to IPFS", isUploading: false });
    }
  };

  // Function to update progress state
  updateProgress = (progress) => {
    this.setState({ uploadProgress: progress });
  };

  newUpload = async () => {
    const { accounts, contract } = this.props;

    await contract.methods.createUploadRequestbyUser(this.state.certificate).send({ from: accounts[0] });
    const uploadedDocs = await contract.methods.getCertificate(accounts[0]).call();

    this.setState({ documents: [uploadedDocs] });
    this.handleClose();
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
                <Avatar style={{ backgroundColor: green[500] }}>
                  <AssignmentIcon />
                </Avatar>
                <div className="doc-details">
                  <h3>Document #{index + 1}</h3>
                  <p>Uploaded by {this.state.lastUploaderName || 'Unknown'}</p>
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

            {/* Show progress bar during file upload */}
            {this.state.isUploading && (
              <div style={{ marginTop: 20 }}>
                <Typography>Uploading: {this.state.uploadProgress}%</Typography>
                <LinearProgress variant="determinate" value={this.state.uploadProgress} />
              </div>
            )}

            {/* Show error message if upload fails */}
            {this.state.uploadError && (
              <Typography color="error" style={{ marginTop: 10 }}>{this.state.uploadError}</Typography>
            )}

          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">Cancel</Button>
            <Button onClick={this.newUpload} color="primary" disabled={this.state.isUploading || !this.state.certificate}>Upload</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default MyDocuments;
