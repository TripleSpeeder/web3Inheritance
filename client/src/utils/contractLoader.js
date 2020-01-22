const supportedTokens = require('../supportedTokens')
const contract = require("@truffle/contract");
const ERC20Data = require("../contracts/ERC20Detailed")
const ERC20MockData = require("../contracts/ERC20Mock")

const instantiateContract = async (address, provider) => {
    let erc20Contract = contract(ERC20Data)
    erc20Contract.setProvider(provider)
    let contractInstance = await erc20Contract.at(address)
    let name = await contractInstance.name()
    let symbol = await contractInstance.symbol()
    let decimals = await contractInstance.decimals()
    return {
        name,
        symbol,
        decimals,
        contractInstance,
    }
}

module.exports = async (web3) =>
{
    let contracts = {}
    let networkId = await web3.eth.net.getId()
    let tokens = supportedTokens[networkId]
    if (!tokens || tokens.length === 0) {
        console.log(`No token contracts defined for network ${networkId}`)
        console.log(`Trying to load ERC20Mock`)
        let erc20MockContract = contract(ERC20MockData)
        erc20MockContract.setProvider(web3.currentProvider)
        try {
            let contractInstance = await erc20MockContract.deployed()
            let name = await contractInstance.name()
            let symbol = await contractInstance.symbol()
            let decimals = await contractInstance.decimals()
            let contractObj = {
                name,
                symbol,
                decimals,
                contractInstance
            }
            contracts[contractInstance.address] = contractObj
        }
        catch(error) {
            console.log(`Failed to load ERC20Mock: ${error}\nNo contracts available.`)
        }
    } else {
        console.log(`Loading ${Object.keys(tokens).length} contracts for ${networkId}:`)
        console.log(tokens)
        for (let token of tokens) {
            let contractObj = await instantiateContract(token.address, web3.currentProvider)
            contracts[token.address] = contractObj
        }
    }
    return(contracts)
}

