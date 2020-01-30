pragma solidity 0.5.11;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IERC1620.sol";

/**
    Workflow:
    1. User approves SealedSablier contract to spend desired amount of tokens
    2. User calls SealedSablier createStream() function. This function does in one transaction:
        a) transfer amount of tokens approved previously to itself
        b) approve Sablier contract to spend tokens that are now owned by SealedSablier contract
        c) Also approve msg.sender to spend tokens (See below why this is necessary)
        d) calls createStream() on Sablier contract. Sablier contract does:
            a) create stream where SealedSablier contract is the sender
            b) transfer previously approved tokens from SealedSablier contract to Sablier

     Result:
       - A new stream for recipient is created, with the SealedSablier contract as sender
       - Since the user is not the Sender he can not cancel or modify the stream anymore

     Benefits:
       - No risk of losing funds in temporary wallet due to browser/system crash or similar
       - No need to have the user transfer both ETH (to pay gas) and Token into temporary wallet to create
         a stream

     Risk:
       - Sablier streams can be cancelled both by sender or recipient. When a stream is cancelled,
         remaining funds will be transferred back to the sender.
         In this scenario the creator can not cancel the stream, but the receiver could still do it.
         This means the funds will be sent back to the SealedSablier contract, where they will be
         locked forever.
         To enable the stream creator to salvage these returned funds I'm approving the sender to spend
         any funds that end up in this contract - See "Escape hatch" notice below.
*/

contract SealedSablier {

    address public Sablier;

    /**
     * @notice Emits when a sealed stream is successfully created.
     */
    event CreateSealedStream(
        uint256 indexed streamId,
        address indexed sender,
        address indexed recipient,
        uint256 deposit,
        address tokenAddress,
        uint256 startTime,
        uint256 stopTime
    );

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

        // "Escape hatch" - We need to prevent locking funds forever in case recipient cancels stream and funds
        // end up in this contract:
        // Approve sender to transfer tokens owned by contract. Setting approval to MAX_UINT (~uint256(0)), as
        // in worst case there might be multiple streams cancelled, so we don't know the total amount that might
        // need rescue! Could instead use "increaseApproval" if it would be supported by all ERC20 contracts...
        require(IERC20(tokenAddress).approve(msg.sender, ~uint256(0)),
            "failed to approve tokens from SealedSablier contract to Creator"
        );

        // create stream on Sablier contract and return the streamID
        streamId = IERC1620(Sablier).createStream(recipient, deposit, tokenAddress, startTime, stopTime);
        // log event so UI can identify streams created by this contract and enable to search for streams by
        // sender or recipient
        emit CreateSealedStream(streamId, msg.sender, recipient, deposit, tokenAddress, startTime, stopTime);
    }
}
