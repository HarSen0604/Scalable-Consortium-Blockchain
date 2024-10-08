// Define mnemonic phrase for wallet access (should be securely managed)
const MNEMONIC = "penalty earth describe business hundred olympic duck save donate fall inspire fatigue";

// Define the project endpoint (Ethereum network or local node)
const PROJECT = "http://127.0.0.1:8545"; // Change this to your Ethereum node's URL

// Uncomment the line below if using environment variables
// require('dotenv').config();

// Import HDWalletProvider for managing wallet accounts with mnemonic
const HDWalletProvider = require('@truffle/hdwallet-provider');

// Export the configuration for Truffle
module.exports = {
    networks: {
        // Configuration for the development network
        development: {
            host: "127.0.0.1",     // Localhost (default: none)
            port: 8545,            // Standard Ethereum port (default: none)
            network_id: "5778",    // Any network ID (default: none)
            type: "fabric-evm",    // Specify type if using Hyperledger Fabric EVM
        },
        // Configuration for the Besu network
        besu: {
            // Function that returns a new instance of HDWalletProvider
            provider: () => new HDWalletProvider(MNEMONIC, PROJECT),
            network_id: "5778",    // Match any network ID
            gas: 4500000,          // Gas limit for transactions on the Besu network
            gasPrice: 1000000000,  // Gas price in wei (1 Gwei)
            timeoutBlocks: 50,     // Wait 50 blocks before considering transaction as failed
            skipDryRun: true       // Skip dry run before migrations for faster deployment
        }
    },

    // Mocha testing framework configuration
    mocha: {
        // timeout: 100000 // Specify timeout duration for tests (uncomment if needed)
    },

    // Compiler configuration for Solidity
    compilers: {
        solc: {
            version: "0.8.19"      // Fetch exact version from solc-bin (default: Truffle's version)
        }
    },

    // Database configuration for migrations (disabled in this case)
    db: {
        enabled: false // Disable the database feature
    }
};