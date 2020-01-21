const supportedTokens = {
    // main
    '1': [
            {
                name: 'DAI',
                address: '0x6b175474e89094c44da98b954eedeac495271d0f'
            },
            {
                name: 'USDC',
                address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
            },
            {
                name: 'cDAI',
                address: '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643'
            },
            {
                name: 'cUSDC',
                address: '0x39aa39c021dfbae8fac545936693ac917d5e7563'
            }
    ],
    // Ropsten
    '3': [
        {
            name:'TestnetDAI',
            address: '0x2D69aD895797C880abce92437788047BA0Eb7fF6'
        },
        {
            name: 'cDAI',
            address: '0x2b536482a01e620ee111747f8334b395a42a555e'
        },
        {
            name: 'cUSDC',
            address: '0x43a1363afb28235720fcbdf0c2dab7759091f7e0'
        }
    ],
    // kovan
    '42': [
        {
            name:'TestnetDAI',
            address: '0x7d669a64deb8a4a51eea755bb0e19fd39ce25ae9'
        },
        {
            name: 'DAI',
            address: '0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa',
        },
        {
            name: 'cDAI',
            address: '0xe7bc397dbd069fc7d0109c0636d06888bb50668c'
        },
        {
            name: 'cUSDC',
            address: '0xcfc9bb230f00bffdb560fce2428b4e05f3442e35'
        }
    ],
    // goerli
    '5': [
        {
            name:'TestnetDAI',
            address: '0xF2D1F94310823FE26cFa9c9B6fD152834b8E7849'
        },
        {
            name:'cDAI',
            address: '0xd9fd9e875c9c1d567825e431dd6ed4f0e51aa8bf'
        },
        {
            name: 'cUSDC',
            address: '0xd9ffe966a831089981bd1539503c9d3cb45e5aab'
        }
    ],
    // rinkeby
    '4': [
        {
            name:'TestnetDAI',
            address: '0xc3dbf84Abb494ce5199D5d4D815b10EC29529ff8'
        },
        {
            name:'cDAI',
            address: '0x6d7f0754ffeb405d23c51ce938289d4835be3b14'
        },
        {   name: 'cUSDC',
            address: '0x5b281a6dda0b271e91ae35de655ad301c976edb1'
        }
    ],
}

module.exports = supportedTokens
