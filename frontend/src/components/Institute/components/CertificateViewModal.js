import React, { useState, useEffect } from "react";
import crypto from "crypto-browserify";
import styles from "./CertificateViewModal.module.css";
import { useBlockchain } from "../../../hooks/useBlockchain";
import { toast } from "react-toastify";

const CertificateViewModal = ({ request, onClose, onActionComplete }) => {
  const [decryptedFileUrl, setDecryptedFileUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { verifyCertificate, revokeCertificate } = useBlockchain();
  const [isProcessing, setIsProcessing] = useState(false);
  

  useEffect(() => {
    const decryptFile = async () => {
      try {
        if (!request.ipfsHash || !request.encryptedKey || !request.iv) {
          throw new Error("Missing decryption parameters.");
        }

        if (request.metadata.mimeType !== "application/pdf") {
          throw new Error("Only PDF certificates are supported.");
        }

        const response = await fetch(
          `https://gateway.pinata.cloud/ipfs/${request.ipfsHash}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch file from IPFS.");
        }

        const encryptedData = await response.arrayBuffer();
        const symmetricKey = Buffer.from(request.encryptedKey, "base64");
        const iv = Buffer.from(request.iv, "base64");
        const decipher = crypto.createDecipheriv("aes-256-cbc", symmetricKey, iv);
        const decryptedData = Buffer.concat([
          decipher.update(Buffer.from(encryptedData)),
          decipher.final(),
        ]);

        const blob = new Blob([decryptedData], { type: "application/pdf" });
        setDecryptedFileUrl(URL.createObjectURL(blob));
        setIsLoading(false);
      } catch (err) {
        console.error("Error decrypting file:", err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    decryptFile();
  }, [request]);

  const updateDatabase = async (action) => {
    // Map frontend actions to backend schema enum values
    const validStatus = action === "approved" ? "Verified" : "Revoked";
  
    const response = await fetch("http://localhost:5000/api/update-request-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({ requestId: request._id, status: validStatus }),
    });
  
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to update status in the database.");
    }
  
    return data;
  };
  
  const handleApprove = async () => {
    try {
      setIsProcessing(true);
      toast.info("Approving certificate... Please wait.");
  
      // Interact with the blockchain
      const blockchainSuccess = await verifyCertificate(request.ipfsHash, true);
      if (!blockchainSuccess) {
        throw new Error("Blockchain transaction for approval failed.");
      }
  
      // Update the database
      await updateDatabase("approved"); // Sends "Verified" to the backend
  
      toast.success("Certificate successfully approved!");
      onActionComplete({ ...request, status: "Verified" }); // Notify parent
      onClose();
    } catch (error) {
      console.error("Error approving certificate:", error);
      toast.error(error.message || "Failed to approve certificate.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleReject = async () => {
    try {
      setIsProcessing(true);
      toast.info("Revoking certificate... Please wait.");
  
      // Interact with the blockchain
      const blockchainSuccess = await revokeCertificate(request.ipfsHash);
      if (!blockchainSuccess) {
        throw new Error("Blockchain transaction for rejection failed.");
      }
  
      // Update the database
      await updateDatabase("rejected"); // Sends "Revoked" to the backend
  
      toast.success("Certificate successfully revoked!");
      onActionComplete({ ...request, status: "Revoked" }); // Notify parent
      onClose();
    } catch (error) {
      console.error("Error rejecting certificate:", error);
      toast.error(error.message || "Failed to reject certificate.");
    } finally {
      setIsProcessing(false);
    }
  };
  



  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h2>Certificate Details</h2>
        <p>
          <strong>Student Number:</strong> {request.studentNumber}
        </p>
        <p>
          <strong>Institute:</strong> {request.institute}
        </p>
        {isLoading ? (
          <p>Decrypting and loading certificate...</p>
        ) : error ? (
          <p className={styles.error}>Error: {error}</p>
        ) : (
          <iframe
            src={decryptedFileUrl}
            className={styles.certificateViewer}
            title="Certificate Viewer"
          />
        )}
        <div className={styles.actions}>
          <button
            className={`${styles.button} ${styles.approveButton}`}
            onClick={handleApprove}
            disabled={isProcessing || isLoading}
          >
            {isProcessing && !isLoading ? "Processing..." : "Approve"}
          </button>
          <button
            className={`${styles.button} ${styles.rejectButton}`}
            onClick={handleReject}
            disabled={isProcessing || isLoading}
          >
            {isProcessing && !isLoading ? "Processing..." : "Reject"}
          </button>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default CertificateViewModal;
