import { useCallback } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { useWallet } from '../contexts/WalletContext';
import contractAddress from '../contracts/contract-address.json';
import ZCASUCertificate from '../contracts/ZCASUCertificate.json';

export const useBlockchain = () => {
  const { signer, connectWallet } = useWallet();

  const getContract = useCallback(async () => {
    if (!signer) {
      await connectWallet();
      return null;
    }

    return new ethers.Contract(
      contractAddress.ZCASUCertificate,
      ZCASUCertificate.abi,
      signer
    );
  }, [signer, connectWallet]);
  

   // Register certificate with IPFS hash (encrypted file)
  const registerCertificate = async (ipfsHash, instituteAddress) => {
    try {
      const contract = await getContract();
      if (!contract) throw new Error("Please connect your wallet first");

      console.log("Registering certificate with:", { ipfsHash, instituteAddress });
      const tx = await contract.registerCertificate(ipfsHash, instituteAddress);

      toast.info("Registering certificate... Please wait for confirmation");
      await tx.wait();
      toast.success("Certificate successfully registered on blockchain");
      return true;
    } catch (error) {
      console.error("Failed to register certificate:", error);
      toast.error(error.message || "Failed to register certificate");
      return false;
    }
  };

  // Issue a certificate
  const issueCertificate = async (ipfsHash) => {
    try {
      const contract = await getContract();
      if (!contract) throw new Error("Please connect your wallet first");

      const tx = await contract.issueCertificate(ipfsHash);
      toast.info("Issuing certificate... Please wait for confirmation");
      await tx.wait();
      toast.success("Certificate successfully issued");
      return true;
    } catch (error) {
      console.error("Failed to issue certificate:", error);
      toast.error(error.message || "Failed to issue certificate");
      return false;
    }
  };

  // Verify a certificate
  const verifyCertificate = async (ipfsHash, isValid) => {
    try {
      const contract = await getContract();
      if (!contract) throw new Error("Please connect your wallet first");

      const tx = await contract.verifyCertificate(ipfsHash, isValid);
      toast.info("Verifying certificate... Please wait for confirmation");
      await tx.wait();
      toast.success(`Certificate has been ${isValid ? "verified" : "invalidated"}`);
      return true;
    } catch (error) {
      console.error("Failed to verify certificate:", error);
      toast.error(error.message || "Failed to verify certificate");
      return false;
    }
  };

  // Revoke a certificate
  const revokeCertificate = async (ipfsHash) => {
    try {
      const contract = await getContract();
      if (!contract) throw new Error("Please connect your wallet first");

      const tx = await contract.revokeCertificate(ipfsHash);
      toast.info("Revoking certificate... Please wait for confirmation");
      await tx.wait();
      toast.success("Certificate has been revoked");
      return true;
    } catch (error) {
      console.error("Failed to revoke certificate:", error);
      toast.error(error.message || "Failed to revoke certificate");
      return false;
    }
  };

  // Get certificates for a student
  const getCertificates = async (address) => {
    try {
      const contract = await getContract();
      if (!contract) throw new Error("Please connect your wallet first");

      const certificates = await contract.getCertificates(address);
      return certificates;
    } catch (error) {
      console.error("Failed to fetch certificates:", error);
      toast.error("Failed to fetch certificates");
      return [];
    }
  };

  // Get certificate details by IPFS hash
  const getCertificateDetails = async (ipfsHash) => {
    try {
      const contract = await getContract();
      if (!contract) throw new Error("Please connect your wallet first");

      const certificateDetails = await contract.getCertificateDetails(ipfsHash);
      return certificateDetails;
    } catch (error) {
      console.error("Failed to fetch certificate details:", error);
      toast.error("Failed to fetch certificate details");
      return null;
    }
  };

  
  return {
    issueCertificate,
    verifyCertificate,
    revokeCertificate,
    registerCertificate,
    getCertificates,
    getCertificateDetails,
  };
};
