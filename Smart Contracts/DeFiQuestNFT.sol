// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DeFiQuestNFT is ERC721URIStorage, Ownable {
    uint256 public tokenCount;

    constructor(
        address initialOwner
    ) ERC721("DeFiQuestNFT", "DQN") Ownable(initialOwner) {}

    function mintBadge(
        address to,
        string memory badgeUri
    ) public onlyOwner returns (uint256) {
        tokenCount++;
        uint256 newTokenId = tokenCount;
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, badgeUri);
        return newTokenId;
    }
}
