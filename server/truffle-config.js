// Mnemonic phrase for wallet generation (replace with your actual mnemonic)
const MNEMONIC = "absurd glass pilot caution repeat bubble become general place real fork pair";

// Project URL for the Ethereum network (local Ganache instance)
const PROJECT = "http://127.0.0.1:7545";

// Uncomment the line below to use environment variables from a .env file
// require('dotenv').config();

const HDWalletProvider = require('@truffle/hdwallet-provider');

/**
 * Truffle configuration for the project.
 * This configuration includes network settings, compiler settings, and other options.
 */
module.exports = {
	networks: {
		/**
		 * Development network configuration.
		 * This connects to a local Ethereum node.
		 */
		development: {
			host: "127.0.0.1",     // Host address for the Ethereum node
			port: 7545,            // Port on which the node is listening (default for Ganache)
			network_id: "5777",    // Network ID to connect (Ganache default)
			type: "fabric-evm",    // Type of blockchain (in this case, Hyperledger Fabric EVM)
		},
		/**
		 * Besu network configuration.
		 * This connects to an Ethereum node using a wallet provider.
		 */
		besu: {
			// Create a new HDWalletProvider instance with the given mnemonic and project URL
			provider: () => new HDWalletProvider(MNEMONIC, PROJECT),
			network_id: "5777",    // Match any network ID (should correspond to your node's ID)
			gas: 4500000,          // Gas limit for transactions on the Besu network
			gasPrice: 1000000000,  // Gas price in wei (1 Gwei)
			timeoutBlocks: 50,     // Number of blocks to wait before considering a transaction as failed
			skipDryRun: true       // Skip the dry run before migrations (saves time)
		}
	},

	// Mocha testing framework options
	mocha: {
		// timeout: 100000 // Uncomment to set a custom timeout for tests
	},

	// Compiler configuration
	compilers: {
		solc: {
			version: "0.8.19"      // Specific version of the Solidity compiler to use
		}
	},

	// Database configuration for Truffle
	db: {
		enabled: false           // Disable the Truffle DB (if you don't need it)
	}
};