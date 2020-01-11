const path = require("path");

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
    },
    kovan: {
      network_id: "42",
    },
    rinkeby: {
      network_id: "4",
    }
  },
  compilers: {
    solc: {
      version: '0.5.11', // specific version required by Sablier/IERC1620.sol
    },
  }
};
