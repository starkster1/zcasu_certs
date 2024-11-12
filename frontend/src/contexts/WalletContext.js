// WalletContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { toast } from 'react-toastify';

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false); // Track connection status

  // 1. The connectWallet function handles the connection to MetaMask
  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('Please install MetaMask to use this feature');
      return;
    }

    try {
      setIsConnecting(true);

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];

      // Initialize provider and signer
      const provider = new Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Get network details
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      // Set wallet details in state
      setAccount(account);
      setChainId(chainId);
      setProvider(provider);
      setSigner(signer);
      setIsConnected(true); // Mark wallet as connected

      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  // 2. Disconnects the wallet by resetting state
  const disconnect = () => {
    setAccount(null);
    setChainId(null);
    setProvider(null);
    setSigner(null);
    setIsConnected(false); // Mark wallet as disconnected
    toast.info('Wallet disconnected');
  };

  // 3. Handles network switching
  const switchNetwork = async (targetChainId) => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }], // Hex representation
      });
    } catch (error) {
      if (error.code === 4902) {
        toast.error('Please add this network to your MetaMask');
      } else {
        toast.error('Failed to switch network');
      }
    }
  };

  // 4. Effect to handle account and network changes, ensuring UI stays up-to-date
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true); // Mark wallet as connected
        } else {
          disconnect();
        }
      });

      window.ethereum.on('chainChanged', (chainId) => {
        setChainId(Number(chainId));
      });

      window.ethereum.on('disconnect', () => {
        disconnect();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners();
      }
    };
  }, []);

  // 5. Return the context provider with wallet connection functions
  return (
    <WalletContext.Provider
      value={{
        account,
        chainId,
        provider,
        signer,
        isConnecting,
        isConnected,  // Provide the connection status
        connectWallet,
        disconnect,
        switchNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

// 6. Custom hook to use the Wallet context
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};






/*// WalletContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { toast } from 'react-toastify';

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // 1. The connectWallet function handles the connection to MetaMask
  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('Please install MetaMask to use this feature');
      return;
    }

    try {
      setIsConnecting(true);

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];

      // Initialize provider and signer
      const provider = new Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Get network details
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      // Set wallet details in state
      setAccount(account);
      setChainId(chainId);
      setProvider(provider);
      setSigner(signer);

      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  // 2. Disconnects the wallet by resetting state
  const disconnect = () => {
    setAccount(null);
    setChainId(null);
    setProvider(null);
    setSigner(null);
    toast.info('Wallet disconnected');
  };

  // 3. Handles network switching
  const switchNetwork = async (targetChainId) => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
    } catch (error) {
      if (error.code === 4902) {
        toast.error('Please add this network to your MetaMask');
      } else {
        toast.error('Failed to switch network');
      }
    }
  };

  // 4. Effect to handle account and network changes, ensuring UI stays up-to-date
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          disconnect();
        }
      });

      window.ethereum.on('chainChanged', (chainId) => {
        setChainId(Number(chainId));
      });

      window.ethereum.on('disconnect', () => {
        disconnect();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners();
      }
    };
  }, []);

  // 5. Return the context provider with wallet connection functions
  return (
    <WalletContext.Provider
      value={{
        account,
        chainId,
        provider,
        signer,
        isConnecting,
        connectWallet,
        disconnect,
        switchNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

// 6. Custom hook to use the Wallet context
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
*/