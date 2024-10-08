MNEMONIC = "penalty earth describe business hundred olympic duck save donate fall inspire fatigue"
PROJECT = "http://127.0.0.1:8545"

// require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
	networks: {
		development: {
			host: "127.0.0.1",     // Localhost (default: none)
			port: 8545,            // Standard Ethereum port (default: none)
			network_id: "5778",    // Any network (default: none)
			type: "fabric-evm",
		},
		besu: {
			provider: () => new HDWalletProvider(MNEMONIC, PROJECT),
			network_id: "5778",    // Match any network id
			gas: 4500000,          // Gas limit for Besu
			gasPrice: 1000000000,  // Gas price in wei
			timeoutBlocks: 50,     // Wait 50 blocks before considering transaction as failed
			skipDryRun: true       // Skip dry run before migrations
		}
	},

	mocha: {
		// timeout: 100000
	},

	compilers: {
		solc: {
			version: "0.8.19"      // Fetch exact version from solc-bin (default: truffle's version)
		}
	},

	db: {
		enabled: false
	}
};