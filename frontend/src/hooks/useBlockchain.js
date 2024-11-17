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

  // Register the user as a student if not already registered
  const registerAsStudent = async () => {
    try {
      const contract = await getContract();
      if (!contract) throw new Error("Please connect your wallet first");
  
      const isRegistered = await contract.isRegisteredStudent();
      if (!isRegistered) {
        const tx = await contract.registerAsStudent();
        await tx.wait(); // Wait until transaction is mined
        toast.info("Registered as a student");
        return true;
      } else {
        toast.info("Already registered as a student");
        return true;
      }
    } catch (error) {
      console.error("Failed to register as student:", error);
      toast.error(error.message || "Failed to register as student");
      return false;
    }
  };

  // Register certificate with IPFS hash
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
    registerAsStudent,
    issueCertificate,
    verifyCertificate,
    revokeCertificate,
    registerCertificate,
    getCertificates,
    getCertificateDetails,
  };
};



/*import { useCallback } from 'react';
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


  // Register the user as a student if not already registered
  const registerAsStudent = async () => {
    try {
      const contract = await getContract();
      if (!contract) throw new Error("Please connect your wallet first");
  
      const isRegistered = await contract.isRegisteredStudent();
      if (!isRegistered) {
        await contract.registerAsStudent();
        toast.info("Registered as a student");
        return true; // Return true if registration succeeded
      } else {
        toast.info("Already registered as a student");
        return true; // Return true if already registered
      }
    } catch (error) {
      console.error("Failed to register as student:", error);
      toast.error(error.message || "Failed to register as student");
      return false; // Return false if registration failed
    }
  };
  

  // Register certificate with IPFS hash
  const registerCertificate = async (ipfsHash, instituteAddress) => {
    try {
      const contract = await getContract();
      if (!contract) throw new Error('Please connect your wallet first');
  
      console.log('Registering certificate with:', { ipfsHash, instituteAddress });
      const tx = await contract.registerCertificate(ipfsHash, instituteAddress);
  
      toast.info('Registering certificate... Please wait for confirmation');
      await tx.wait();
      toast.success('Certificate successfully registered on blockchain');
      return true;
    } catch (error) {
      console.error('Failed to register certificate:', error);
      toast.error(error.message || 'Failed to register certificate');
      return false;
    }
  };
  

  // Other existing methods (issueCertificate, verifyCertificate, etc.)
  const issueCertificate = async (ipfsHash) => {
    try {
      const contract = await getContract();
      if (!contract) throw new Error('Please connect your wallet first');

      const tx = await contract.issueCertificate(ipfsHash);
      toast.info('Issuing certificate... Please wait for confirmation');
      await tx.wait();

      return true;
    } catch (error) {
      console.error('Failed to issue certificate:', error);
      toast.error(error.message || 'Failed to issue certificate');
      return false;
    }
  };

  const verifyCertificate = async (ipfsHash, isValid) => {
    try {
      const contract = await getContract();
      if (!contract) throw new Error('Please connect your wallet first');

      const tx = await contract.verifyCertificate(ipfsHash, isValid);
      toast.info('Verifying certificate... Please wait for confirmation');
      await tx.wait();

      toast.success(`Certificate has been ${isValid ? 'verified' : 'invalidated'}`);
      return true;
    } catch (error) {
      console.error('Failed to verify certificate:', error);
      toast.error(error.message || 'Failed to verify certificate');
      return false;
    }
  };

  const revokeCertificate = async (ipfsHash) => {
    try {
      const contract = await getContract();
      if (!contract) throw new Error('Please connect your wallet first');

      const tx = await contract.revokeCertificate(ipfsHash);
      toast.info('Revoking certificate... Please wait for confirmation');
      await tx.wait();

      toast.success('Certificate has been revoked');
      return true;
    } catch (error) {
      console.error('Failed to revoke certificate:', error);
      toast.error(error.message || 'Failed to revoke certificate');
      return false;
    }
  };

  const getCertificates = async (address) => {
    try {
      const contract = await getContract();
      if (!contract) throw new Error('Please connect your wallet first');

      const certificates = await contract.getCertificates(address);
      return certificates;
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
      toast.error('Failed to fetch certificates');
      return [];
    }
  };

  const getCertificateDetails = async (ipfsHash) => {
    try {
      const contract = await getContract();
      if (!contract) throw new Error('Please connect your wallet first');

      const certificateDetails = await contract.getCertificateDetails(ipfsHash);
      return certificateDetails;
    } catch (error) {
      console.error('Failed to fetch certificate details:', error);
      toast.error('Failed to fetch certificate details');
      return null;
    }
  };

  

  return {
    registerAsStudent,
    issueCertificate,
    verifyCertificate,
    revokeCertificate,
    registerCertificate,
    getCertificates,
    getCertificateDetails,
  };
};*/