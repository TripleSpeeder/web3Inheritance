const SealedSablier = artifacts.require("./SealedSablier.sol")
// const ERC20Mock = artifacts.require("./ERC20Mock.sol")
const contract = require("@truffle/contract");
const SablierData = require("../client/src/contracts/Sablier");
const CTokenManagerData = require("../client/src/contracts/CTokenManager")
const ERC20MockData = require("../client/src/contracts/ERC20Mock")

const SablierAdresses = {
  main: '0xA4fc358455Febe425536fd1878bE67FfDBDEC59a',
  kovan: '0xc04Ad234E01327b24a831e3718DBFcbE245904CC',
  rinkeby: '0xc04Ad234E01327b24a831e3718DBFcbE245904CC',
  goerli: '0xc04Ad234E01327b24a831e3718DBFcbE245904CC',
}

const CTokenManagerAddresses = {
  main: '0x342A6596F50b4Db7c3246C0F4eFb1f06843d7405',
  kovan: '0xEE5dfDf2e98FdC572786b9E5649cB8Cc93D47a19',
  rinkeby: '0xEE5dfDf2e98FdC572786b9E5649cB8Cc93D47a19',
  goerli: '0xEE5dfDf2e98FdC572786b9E5649cB8Cc93D47a19',
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

    // A few Mock ERC20 contracts that allow minting for anyone
    let ERC20MockContract = contract(ERC20MockData)
    ERC20MockContract.setProvider(web3.currentProvider)
    console.log(`Creating ERC20Mock contracts`)
    let erc20Mock1 = await ERC20MockContract.new('test1', 'TST1', 18, {from: accounts[0]})
    let erc20Mock2 = await ERC20MockContract.new('test2', 'TST2', 12, {from: accounts[0]})
    let erc20Mock3 = await ERC20MockContract.new('test3', 'TST3', 4, {from: accounts[0]})
    console.log(`\t-> test1 (18 decimals) at ${erc20Mock1.address}`)
    console.log(`\t-> test2 (12 decimals) at ${erc20Mock2.address}`)
    console.log(`\t-> test3 (4 decimals) at ${erc20Mock3.address}`)
  } else {
    SablierAddress = SablierAdresses[network]
    console.log(`Using Sablier contract on ${network} at ${SablierAddress}`)
  }
  await deployer.deploy(SealedSablier, SablierAddress)
}
