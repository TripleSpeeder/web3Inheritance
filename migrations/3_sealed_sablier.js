const SealedSablier = artifacts.require("SealedSablier")

module.exports = async function(_deployer, _network, _accounts) {
    // Get address of Sablier contract from existing SealedSablier instance
    let prevSealedSablierInstance = await SealedSablier.deployed()
    let SablierAddress = await prevSealedSablierInstance.Sablier()
    console.log(`Using Sablier contract on ${_network} at ${SablierAddress}`)
    await _deployer.deploy(SealedSablier, SablierAddress)
};
