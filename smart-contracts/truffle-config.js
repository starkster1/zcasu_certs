const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config(); // To use environment variables from .env file

module.exports = {
  networks: {
    // For local development with Ganache
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Standard Ethereum port for Ganache
      network_id: "*",       // Match any network id
    },

    // Sepolia Test Networkj
    sepolia: {
      provider: () => new HDWalletProvider(
        process.env.MNEMONIC, // Mnemonic phrase for wallet
        `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
      ),
      network_id: 11155111,   // Sepolia's network id
      gas: 5500000,           // Gas limit
      confirmations: 2,       // # of confs to wait between deployments
      timeoutBlocks: 200,     // # of blocks before a deployment times out
      skipDryRun: true        // Skip dry run before migrations
    },
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.0",       // Fetch exact version from solc-bin
      settings: {             // See the solidity docs for advice about optimization and evmVersion
       optimizer: {
         enabled: false,
         runs: 200
       },
       evmVersion: "istanbul"
      }
    }
  }
};
