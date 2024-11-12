import React from 'react';
import { Button } from '@mui/material';
import { Wallet } from 'lucide-react';
import { useWallet } from '../../../contexts/WalletContext';

const WalletButton = () => {
  const { account, isConnecting, connect, disconnect } = useWallet();

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Button
      variant="contained"
      color={account ? 'success' : 'primary'}
      onClick={account ? disconnect : connect}
      disabled={isConnecting}
      startIcon={<Wallet className="h-5 w-5" />}
      className="normal-case"
    >
      {isConnecting
        ? 'Connecting....'
        : account
        ? formatAddress(account)
        : 'Connect Wallet'}
    </Button>
  );
};

export default WalletButton;
