import { useCallback } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { useWallet } from '../contexts/WalletContext';
import contractAddresses from '../contracts/contract-address.json';
import ZCASUCertificate from '../contracts/ZCASUCertificate.json';

export const useBlockchain = () => {
  const { signer, connect } = useWallet();

  const getContract = useCallback(async () => {
    if (!signer) {
      await connect();
      return null;
    }

    return new ethers.Contract(
      contractAddresses.ZCASUCertificate,
      ZCASUCertificate.abi,
      signer
    );
  }, [signer, connect]);


  // Register the user as a student if not already registered
  const registerAsStudent = async () => {
    try {
      const contract = await getContract();
      if (!contract) throw new Error('Please connect your wallet first');

      const isRegistered = await contract.isRegisteredStudent();
      if (!isRegistered) {
        await contract.registerAsStudent();
        toast.info('Registered as a student');
      } else {
        toast.info('Already registered as a student');
      }
    } catch (error) {
      console.error('Failed to register as student:', error);
      toast.error(error.message || 'Failed to register as student');
    }
  };

  // Register certificate with IPFS hash
  const registerCertificate = async (ipfsHash, instituteAddress) => {
    try {
      const contract = await getContract();
      if (!contract) throw new Error('Please connect your wallet first');

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
    registerCertificate,  // Make sure this is returned
    getCertificates,
    getCertificateDetails,
  };
};





/*import { useCallback } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { useWallet } from '../contexts/WalletContext';
import contractAddresses from '../contracts/contract-address.json';
import ZCASUCertificate from '../contracts/ZCASUCertificate.json';

export const useBlockchain = () => {
  const { signer, connect } = useWallet();

  const getContract = useCallback(async () => {
    if (!signer) {
      await connect();
      return null;
    }

    return new ethers.Contract(
      contractAddresses.ZCASUCertificate,
      ZCASUCertificate.abi,
      signer
    );
  }, [signer, connect]);

  // Register the user as a student if not already registered
  const registerAsStudent = async () => {
    try {
      const contract = await getContract();
      if (!contract) throw new Error('Please connect your wallet first');

      const isRegistered = await contract.isRegisteredStudent();
      if (!isRegistered) {
        await contract.registerAsStudent();
        toast.info('Registered as a student');
      } else {
        toast.info('Already registered as a student');
      }
    } catch (error) {
      console.error('Failed to register as student:', error);
      toast.error(error.message || 'Failed to register as student');
    }
  };

  // Issue a certificate with the provided IPFS hash
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

  // Verify a certificate by its IPFS hash
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

  // Revoke a certificate by its IPFS hash
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

  // Get all certificates for a student
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

  // Get details of a specific certificate by IPFS hash
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
    getCertificates,
    getCertificateDetails,
  };
};*/
