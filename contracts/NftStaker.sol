// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract NftStaker {
    ERC1155 parentNft;
    uint256 duration;

    struct Stake {
        uint256 tokenId;
        uint8 amount;
        uint256 block;
        uint256 timestamp;
    }

    mapping(address => Stake) public stakes;

    constructor(ERC1155 _parentNft, uint256 _duration) {
        duration = _duration;
        parentNft = _parentNft;
    }

    function stake(uint256 _tokenId, uint8 _amount) public {
        // require(stakes[msg.sender].amount != 0, "Not allowed");

        stakes[msg.sender] = Stake({
            tokenId: _tokenId,
            amount: _amount,
            block: block.number,
            timestamp: block.timestamp
        });

        parentNft.safeTransferFrom(
            msg.sender,
            address(this),
            _tokenId,
            _amount,
            "0x00"
        );
    }

    function unstake() public {
        require(stakes[msg.sender].amount != 0, "No stake");
        require(
            (stakes[msg.sender].timestamp + duration) < block.timestamp,
            "Not yet"
        );

        Stake memory userStake = stakes[msg.sender];
        delete stakes[msg.sender];

        uint256 reward = _computeReward(userStake);
        require(address(this).balance > reward, "No funds");

        parentNft.safeTransferFrom(
            address(this),
            msg.sender,
            userStake.tokenId,
            userStake.amount,
            "0x00"
        );
        payable(msg.sender).transfer(reward);
    }

    function _computeReward(Stake memory _userStake)
        private
        view
        returns (uint256)
    {
        uint256 blockDiff = block.number - _userStake.block;
        uint256 reward = blockDiff * 0.001 ether;

        return reward;
    }

    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public virtual returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function receiveFunds() external payable {}
}
