const SealedSablierContract = artifacts.require("./SealedSablier.sol");
const ERC20Mock = artifacts.require("./ERC20Mock.sol")


/* global web3 */
contract("SealeadSablier", function(accounts) {

  let sealedSablier, erc20mock
  const sender = accounts[1]
  const receiver = accounts[2]

  // Constants to find & decode CreateStream event
  const topicHash = web3.utils.keccak256("CreateStream(uint256,address,address,uint256,address,uint256,uint256)")
  const eventABI = [
    {
      "indexed": true,
      "internalType": "uint256",
      "name": "streamId",
      "type": "uint256"
    },
    {
      "indexed": true,
      "internalType": "address",
      "name": "sender",
      "type": "address"
    },
    {
      "indexed": true,
      "internalType": "address",
      "name": "recipient",
      "type": "address"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "deposit",
      "type": "uint256"
    },
    {
      "indexed": false,
      "internalType": "address",
      "name": "tokenAddress",
      "type": "address"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "startTime",
      "type": "uint256"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "stopTime",
      "type": "uint256"
    }
  ]

  before('Get SealedSablier instance', async function() {
    sealedSablier = await SealedSablierContract.deployed()
    erc20mock = await ERC20Mock.deployed()
  })

  it("...should create a stream of 100 tokens", async () => {
    let BN = web3.utils.BN
    let tokens = new BN('100')

    // calculate amount based on tokens and decimals
    let decimals = await erc20mock.decimals()
    let multi = new BN(10).pow(decimals)
    let amount = tokens.mul(multi)

    // startTime: Now + 5 minutes
    let startTime = new BN(Date.now() + (5*60))
    // duration: 30 days
    let timedelta = new BN(60*60*24*30)
    let stopTime = startTime.add(timedelta)

    // Sablier requires amount to be multiple of timedelta. So round down amount if necessary.
    let remainder = amount.mod(timedelta)
    amount = amount.sub(remainder)

    // mint required amount to sender
    await erc20mock.mint(sender, amount)

    // grant approval to sealedSablier contract to spend tokens
    await erc20mock.approve(sealedSablier.address, amount, {from: sender})

    // create stream
    // Parameters: address recipient, uint256 deposit, address tokenAddress, uint256 startTime, uint256 stopTime
    let result = await sealedSablier.createStream(receiver, amount, erc20mock.address, startTime, stopTime, {from: sender})

    // Get CreateStream event to verify results. Since the event is not created by SealedSablier, but by the
    // external "Sablier" contract, we have to manually look for it by topicHash in tx.rawLogs
    let event = result.receipt.rawLogs.find(log => {
      return (log.topics[0] === topicHash)
    });
    // skip event.topics[0] while decoding as it contains the topicHash
    let decoded = web3.eth.abi.decodeLog(eventABI, event.data, event.topics.slice(1))
    // console.log(decoded)
    assert.deepEqual(decoded.streamId, '1', "Should be the very first stream created")
    assert.deepEqual(decoded.sender, sealedSablier.address, "Sender should be SealedSablier contract")
    assert.deepEqual(decoded.recipient, receiver, "Wrong recipient")
    assert.deepEqual(decoded.deposit, amount.toString(), "Deposited amount wrong")
    assert.deepEqual(decoded.tokenAddress, erc20mock.address, "Wrong token address")
    assert.deepEqual(decoded.startTime, startTime.toString())
    assert.deepEqual(decoded.stopTime, stopTime.toString())

    // SealedSablier contract should not have any balance after stream is created
    let contractBalance = await erc20mock.balanceOf(sealedSablier.address)
    assert(contractBalance.isZero())
    // SealedSablier contract should not have any allowance left to spend sender funds after stream is created
    let contractAllowance = await erc20mock.allowance(sender, sealedSablier.address)
    assert(contractAllowance.isZero())
    // Sender should have allowance to spend unlimited amount of tokens from SealedSablier ("Escape hatch")
    let senderAllowance = await erc20mock.allowance(sealedSablier.address, sender)
    let UINT_MAX = new BN(2).pow(new BN(256)).subn(1)
    assert(senderAllowance.eq(UINT_MAX))
  });
});
