require('dotenv').config()
const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      network_id: "*",
      host: "127.0.0.1",
      port: 8545
    },
    main: {
      network_id: "1",
      provider: function() {
        const private_key = process.env.PRIVATE_KEY
        if (private_key === undefined) {
          throw Error('Provide private key through .env!')
        }
        return new HDWalletProvider(private_key, "http://fullnode.dappnode:8545");
      },
    },
    ropsten: {
      network_id: '3',
      provider: function() {
        const private_key = process.env.PRIVATE_KEY
        if (private_key === undefined) {
          throw Error('Provide private key through .env!')
        }
        return new HDWalletProvider(private_key, "https://ropsten.infura.io/v3/6e94a46ee6204d4eae1285bb4c9cb639");
      }
    },
    kovan: {
      network_id: "42",
      provider: function() {
        const private_key = process.env.PRIVATE_KEY
        if (private_key === undefined) {
          throw Error('Provide private key through .env!')
        }
        return new HDWalletProvider(private_key, "https://kovan.infura.io/v3/6e94a46ee6204d4eae1285bb4c9cb639");
      }
    },
    rinkeby: {
      network_id: "4",
      provider: function() {
        const private_key = process.env.PRIVATE_KEY
        if (private_key === undefined) {
          throw Error('Provide private key through .env!')
        }
        return new HDWalletProvider(private_key, "https://rinkeby.infura.io/v3/6e94a46ee6204d4eae1285bb4c9cb639");
      }
    },
    goerli: {
      network_id: "5",
      gasLimit: "8000000",
      provider: function() {
        const private_key = process.env.PRIVATE_KEY
        if (private_key === undefined) {
          throw Error('Provide private key through .env!')
        }
        return new HDWalletProvider(private_key, "https://goerli.infura.io/v3/6e94a46ee6204d4eae1285bb4c9cb639");
      }
    }
  },
  compilers: {
    solc: {
      version: '0.5.11', // specific version required by Sablier/IERC1620.sol
    },
  }
};
