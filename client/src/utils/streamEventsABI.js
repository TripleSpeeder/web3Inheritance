module.exports = {
    /* Constants to find & decode CreateStream event from IERC1620:
        event CreateStream(
            uint256 indexed streamId,
            address indexed sender,
            address indexed recipient,
            uint256 deposit,
            address tokenAddress,
            uint256 startTime,
            uint256 stopTime
        );

        To calculate topicHash:
        web3.utils.keccak256("CreateStream(uint256,address,address,uint256,address,uint256,uint256)")
     */
    topicHash: '0x7b01d409597969366dc268d7f957a990d1ca3d3449baf8fb45db67351aecfe78',
    eventABI: [
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
}