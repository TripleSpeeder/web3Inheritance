pragma solidity 0.5.11;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IERC1620.sol";

/**
    Workflow:
    1. User approves SealedSablier contract to spend desired amount of tokens
    2. User calls SealedSablier doIt() function. This function does in one transaction:
        a) transfer amount of tokens approved previously to itself
        b) approve Sablier contract to spend tokens that are now owned by SealedSablier contract
        b) calls createStream() on Sablier contract. Sablier contract does:
            a) create stream where SealedSablier contract is the sender (msg.sender from Sablier POV)
            b) transfer previously approved tokens from SealedSablier contract to Sablier

     Result:
       - A new stream for recipient is created, with the SealedSablier contract as sender
       - Since the user is not the Sender he can not cancel or modify the stream anymore

     Benefits:
       - No risk of losing funds in temporary wallet due to browser/system crash or similar
       - No need to have the user transfer both ETH (to pay gas) and Token into temporary wallet to create
         a stream

     Risk:
       - Sablier streams can be cancelled both by sender or recipient. When a stream is cancelled, remaining funds
         will be transferred back to the sender. In this scenario this means the funds will be sent back to the
         SealedSablier contract, where they will be locked forever.
         TODO: Think about possible fixes (maybe ERC20-approve original sender to transfer back canceled amounts?)
*/

contract SealedSablier {

    address public Sablier;

    constructor(address _Sablier) public {
        Sablier = _Sablier;
    }

    /**
     * @notice Creates a stream on Sablier on behalf of the real user.
     * @dev Throws if the contract is not allowed to transfer enough tokens from msg.sender.
     *  Throws if approval of tokens for Sablier contract fails
     *  See function "createStream" in Sablier.sol for more details
     * @param recipient The address towards which the money is streamed.
     * @param deposit The amount of money to be streamed.
     * @param tokenAddress The ERC20 token to use as streaming currency.
     * @param startTime The unix timestamp for when the stream starts.
     * @param stopTime The unix timestamp for when the stream stops.
     * @return The uint256 id of the newly created stream.
     */
    function createStream(address recipient, uint256 deposit, address tokenAddress, uint256 startTime, uint256 stopTime)
        public
        returns (uint256 streamId)
    {
        // Note - Not doing any input validation here, as this is done anyway in the Sablier contract

        // transfer tokens to be deposited to self. Will fail if not approved by msg.sender.
        require(
            IERC20(tokenAddress).transferFrom(msg.sender, address(this), deposit),
            "failed to transfer tokens to SealedSablier contract"
        );

        // approve Sablier to spend the tokens I just acquired
        require(IERC20(tokenAddress).approve(Sablier, deposit),
            "failed to approve tokens from SealedSablier contract to Sablier"
        );

        // create stream on Sablier contract and return the streamID
        streamId = IERC1620(Sablier).createStream(recipient, deposit, tokenAddress, startTime, stopTime);
    }
}
