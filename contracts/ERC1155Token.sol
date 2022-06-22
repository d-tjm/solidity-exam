// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC1155Token is ERC1155, Ownable {
    address public treasury;
    uint256 public tokenId;

    struct Token {
        uint256 id;
        string uri;
    }

    mapping(uint256 => Token) public tokens;

    constructor(address _treasury) ERC1155("") {
        treasury = _treasury;
    }

    function setTreasury(address _treasury) public onlyOwner {
        treasury = _treasury;
    }

    function mintBatch(string memory _uri, uint8 _amount) public onlyOwner {
        require(tokenId < 100, "Limit");

        for (uint256 i; i < _amount; i++) {
            _mint(treasury, tokenId, 1, "");
            tokens[tokenId] = Token({id: i + 1, uri: _uri});

            tokenId += 1;
        }
    }

    function mint(string memory _uri) public onlyOwner {
        require(tokenId < 100, "Limit");

        _mint(treasury, tokenId, 1, "");
        tokens[tokenId] = Token({id: tokenId + 1, uri: _uri});

        tokenId += 1;
    }

    function setTokenUri(uint256 _tokenId, string memory _uri)
        public
        onlyOwner
    {
        tokens[_tokenId].uri = _uri;
    }

    function uri(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        return tokens[_tokenId].uri;
    }
}
