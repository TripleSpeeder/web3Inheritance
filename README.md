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
1. User approves SealedSablier contract to spend desired amount of tokens
1. User calls SealedSablier createStream() function. This function does in one transaction:
    1. transfer amount of tokens approved previously to itself
    1. approve Sablier contract to spend tokens that are now owned by SealedSablier contract
    1. also approve msg.sender to spend tokens (See below why this is necessary)
    1. calls createStream() on Sablier contract. Sablier contract does:
       1. create stream where SealedSablier contract is the sender
       1. transfer previously approved tokens from SealedSablier contract to Sablier

#### Result:
 - A new stream for recipient is created, with the SealedSablier contract as sender
 - Since the user is not the Sender he can not cancel or modify the stream anymore

##### Benefits:
 - No risk of losing funds in temporary wallet due to browser/system crash or similar
 - No need to have the user transfer both ETH (to pay gas) and Token into temporary 
 wallet to create a stream

##### Risk:
Sablier streams can be cancelled both by sender or recipient. When a stream is cancelled,
remaining funds will be transferred back to the sender.

In this scenario the creator can not cancel the stream, but the receiver could still do it.
This means the funds will be sent back to the SealedSablier contract, where they will be
locked forever.

To enable the stream creator to salvage these returned funds SealedSablier is approving the
sender to spend any funds that end up in this contract - See "Escape hatch" notice in SealedSablier.sol.

However this approach still will fail if streams created by different senders with the same token
get cancelled - In this case each sender will able to to transfer *all* tokens, including the cancelled tokens
from other sender's streams!

Possibly a better way to fullfill the requirement of creating unchangeable heritage streams would be to add
a "seal" method to the original Sablier contract, which effectively locks the stream so no one can
cancel it. 
 
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
