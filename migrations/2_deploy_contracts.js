const SealedSablier = artifacts.require("./SealedSablier.sol")
const ERC20Mock = artifacts.require("./ERC20Mock.sol")
const contract = require("@truffle/contract");
const SablierData = require("../client/src/contracts/Sablier");
const CTokenManagerData = require("../client/src/contracts/CTokenManager")

const SablierAdresses = {
  main: '0xA4fc358455Febe425536fd1878bE67FfDBDEC59a',
  kovan: '0xc04Ad234E01327b24a831e3718DBFcbE245904CC',
  rinkeby: '0xc04Ad234E01327b24a831e3718DBFcbE245904CC',
  goerli: '0xc04Ad234E01327b24a831e3718DBFcbE245904CC',
  ropsten: '0xc04Ad234E01327b24a831e3718DBFcbE245904CC'
}

/* global web3 */

module.exports = async function(deployer, network, accounts) {

  let SablierAddress
  if (network === 'development') {
    /* On development network deploy all contracts SealedSablier is depending on */
    // CTokenManager
    let CTokenManagerContract = contract(CTokenManagerData)
    CTokenManagerContract.setProvider(web3.currentProvider)
    console.log(`Creating new instance of CTokenManager contract`)
    let CTokenManagerInstance = await CTokenManagerContract.new({from: accounts[0]})
    // Sablier
    let SablierContract = contract(SablierData);
    SablierContract.setProvider(web3.currentProvider)
    console.log(`Creating new instance of Sablier contract`)
    let SablierInstance = await SablierContract.new(CTokenManagerInstance.address, {from: accounts[0]})
    SablierAddress = SablierInstance.address
    // Test erc20 contract
    await deployer.deploy(ERC20Mock, 'mocktest', 'MTST', 18)

  } else {
    // handle -fork extension of network name for migration dry-run
    let networkName = network.split('-')[0]

    SablierAddress = SablierAdresses[networkName]
    console.log(`Using Sablier contract on ${networkName} at ${SablierAddress}`)
  }
  await deployer.deploy(SealedSablier, SablierAddress)
}
