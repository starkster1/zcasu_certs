export const connectToMetaMask = async () => {
  if (typeof window.ethereum !== 'undefined') { 
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Ensure account is unlocked
      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Listen for account changes
      window.ethereum.on('accountsChanged', (newAccounts) => {
        if (newAccounts.length === 0) {
          console.log("Please connect to MetaMask.");
        } else {
          window.location.reload(); // Reload on account change
        }
      });

      return accounts[0]; // Return the first account
    } catch (error) {
      throw new Error(error.message || 'An error occurred during MetaMask connection');
    }
  } else {
    throw new Error('MetaMask is not installed');
  }
};
