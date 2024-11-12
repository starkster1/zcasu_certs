import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import ZCASUCertificate from "../../../contracts/ZCASUCertificate.json";
import styles from "./CreateMultiSigWallet.module.css";

const CreateMultiSigWallet = ({ contractAddress }) => {
  const [instituteAddress, setInstituteAddress] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [registrationFee, setRegistrationFee] = useState(null);
  const [isAgreed, setIsAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        if (!contractAddress || !ethers.isAddress(contractAddress)) {
          throw new Error("Invalid or missing contract address.");
        }

        // Check for MetaMask
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          await provider.send("eth_requestAccounts", []); // Request account access

          // Use the connected account as the signer
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(contractAddress, ZCASUCertificate.abi, signer);

          // Fetch registration fee
          try {
            const fee = await contract.registrationFee();
            setRegistrationFee(ethers.formatEther(fee));
          } catch (error) {
            console.error("Failed to fetch registration fee:", error);
            setErrorMessage("Failed to retrieve registration fee.");
            return;
          }

          // Fetch institute address
          try {
            const instAddress = await contract.institute();
            setInstituteAddress(instAddress);
          } catch (error) {
            console.error("Failed to fetch institute address:", error);
            setErrorMessage("Failed to retrieve institute address.");
            return;
          }

          // Set user address from signer
          const userAddr = await signer.getAddress();
          setUserAddress(userAddr);

          // Check if the user is already registered
          try {
            const registered = await contract.isStudentRegistered(userAddr);
            setIsRegistered(registered);
          } catch (error) {
            console.error("Failed to check registration status:", error);
            setErrorMessage("Failed to check registration status.");
          }
        } else {
          throw new Error("MetaMask is not installed.");
        }

      } catch (error) {
        console.error("Error initializing:", error);
        setErrorMessage("Error initializing wallet data. Check the contract address and connection.");
      }
    };

    init();
  }, [contractAddress]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAgreed) {
      alert("Please agree to the Terms and Conditions.");
      return;
    }
  
    try {
      setIsLoading(true);
      setErrorMessage("");
  
      // Check MetaMask connection
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, ZCASUCertificate.abi, signer);
  
        // Confirm registrationFee is set before proceeding
        if (!registrationFee) {
          setErrorMessage("Registration fee not set. Please try again later.");
          setIsLoading(false);
          return;
        }
  
        const tx = await contract.createNewMultiSigbyUser(instituteAddress, {
          value: ethers.parseEther(registrationFee),
        });
  
        console.log("Transaction sent:", tx.hash);
        const receipt = await tx.wait(); // Await confirmation
        console.log("Transaction confirmed!", receipt);
  
        // Check if transaction was successful
        if (receipt.status === 1) {
          alert("MultiSig Wallet created successfully!");
          setIsRegistered(true);
        } else {
          setErrorMessage("Transaction failed. Please try again.");
        }
      } else {
        throw new Error("MetaMask is not installed.");
      }
    } catch (error) {
      console.error("Error creating MultiSig Wallet:", error);
      setErrorMessage("Failed to create MultiSig Wallet. Check gas limit, fee, and wallet balance.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create New MultiSig Wallet!</h1>

      {/* Registration Status */}
      <p className={styles.status}>
        Registration Status: {isRegistered ? "Registered" : "Not Registered"}
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label className={styles.label}>Institute Address:</label>
          <input type="text" value={instituteAddress} disabled className={styles.input} />
        </div>

        <div>
          <label className={styles.label}>Your Address:</label>
          <input type="text" value={userAddress} disabled className={styles.input} />
        </div>

        <div>
          <label className={styles.label}>Registration Fee:</label>
          <input
            type="text"
            value={registrationFee ? `${registrationFee} ETH` : "Loading..."}
            disabled
            className={styles.input}
          />
        </div>

        <div className={styles.checkboxContainer}>
          <input
            type="checkbox"
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
            className={styles.checkbox}
          />
          <span className={styles.checkboxLabel}>
            I have read and agree to all the <a href="#" className={styles.link}>Terms and Conditions</a>.
          </span>
        </div>

        <button
          type="submit"
          className={styles.button}
          disabled={isLoading || !isAgreed || isRegistered}
        >
          {isLoading ? "Creating Wallet..." : "GO!"}
        </button>

        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      </form>
    </div>
  );
};

export default CreateMultiSigWallet;
