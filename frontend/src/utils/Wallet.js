import React, { useState, useEffect } from "react";
import Web3 from "web3";
import MultiSigWalletABI from "./abi/MultiSigWallet.json";

function Wallet({ account }) {
  const [contract, setContract] = useState(null);
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Use Infura Sepolia network if Web3.givenProvider is not available, otherwise use local Ganache
        const web3Instance = new Web3(
          Web3.givenProvider || `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}` || "http://localhost:7545"
        );
        setWeb3(web3Instance);

        // Get the current network ID
        const networkId = await web3Instance.eth.net.getId();

        // Find the contract deployment address in the ABI for the current network
        const deployedNetwork = MultiSigWalletABI.networks[networkId];

        if (deployedNetwork) {
          const instance = new web3Instance.eth.Contract(
            MultiSigWalletABI.abi,
            deployedNetwork.address
          );
          setContract(instance);
        } else {
          console.error("Smart contract not deployed to the detected network.");
        }
      } catch (error) {
        console.error("Error initializing web3:", error);
      }
    };

    init();
  }, []);

  const submitTransaction = async () => {
    if (!contract || !web3) {
      console.error("Contract or Web3 instance not available.");
      return;
    }

    try {
      const receipt = await contract.methods.submitTransaction(
        "0xRecipientAddress",
        web3.utils.toWei("1", "ether")
      ).send({ from: account });

      console.log("Transaction successful with receipt:", receipt);
    } catch (error) {
      console.error("Error submitting transaction:", error);
    }
  };

  return (
    <button onClick={submitTransaction}>Submit Transaction</button>
  );
}

export default Wallet;
