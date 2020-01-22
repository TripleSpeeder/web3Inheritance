# web3 inheritance
## Introduction
This is my entry to the Gitcoin ["Take back the web"](https://gitcoin.co/hackathon/take-back-the-web) hackathon.
Bounty: https://gitcoin.co/issue/sablierhq/sablier/30/3874

## Bounty description:
From https://gitcoin.co/issue/sablierhq/sablier/30/3874:
> Leaving inheritance is a complicated process and many parents would rather not shower their kids with riches, but they would neither fancy burning the money.
>  
>  Sablier enables this alternative:
>  
>  1. Create a new web3 wallet
>  2. Throw your wealth in there
>  3. Use all money to create a stream with a long duration
>  4. Burn the private key

## Implementation
### Backend
I deviated from the original description, as i did not feel comfortable with
transfering substantial amounts of money to a temporary wallet. Instead i created
a thin proxy contract `SealedSablier.sol` for creating streams. 
#### Proxy contract workflow:
1. User approves SealedSablier contract to spend `deposit` amount of tokens
1. User executes `createStream` function of SealedSablier contract
1. within this function the SealedSablier contract does:
   1. transfer `deposit` tokens from user to itself
   1. approve the Sablier contract to spend `deposit` tokens from User
   1. execute `createStream` function of Sablier contract
#### Result
A new stream is created, with the proxy contract being the sender. As the user is
not the sender of the stream, he has no control over the stream. There is no way
for the user to cancel or modify it.
### Frontend
The frontend is built using truffle and React. 
The user can
- Create new streams
- View incoming streams
- Withdraw from incoming streams

### Contract addresses
SealedSablier.sol is deployed on:
- Ropsten: https://ropsten.etherscan.io/address/0xDa09cf787D16Ce8e3F6fb5aD237EAdE0D47C8C02
- Kovan: https://kovan.etherscan.io/address/0xd81F53b142424dF1E0Bf18E1b2A8933B4DC46801
- Rinkeby: https://rinkeby.etherscan.io/address/0xd81F53b142424dF1E0Bf18E1b2A8933B4DC46801
- Goerli: https://goerli.etherscan.io/address/0xA34bF8bd1ae6AC572e22A23ac9d3Da0D06C4d71f

## Development
For local development with e.g. ganache run `truffle migrate`. This will deploy
local instances of Sablier, CTokenManager, SealedSablier and ERC20Mock, so you
have everything available to play around.
