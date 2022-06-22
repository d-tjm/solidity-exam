const { expect } = require('chai');
const { ethers } = require('hardhat');

describe("ERC1155Token", function() {
    let owner;
    let erc1155TokenContract;

    before(async function() {
        const signers = await ethers.getSigners();
        owner = signers[0];

        const ERC1155Token = await ethers.getContractFactory("ERC1155Token");
        const erc1155Token = await ERC1155Token.deploy(owner.address);

        erc1155TokenContract = await erc1155Token.deployed();
    })
    it("Should be able to mint nft with specific uri", async function() {
        await erc1155TokenContract.mint("https://uri.com");

        const lastTokenId = await erc1155TokenContract.tokenId();

        const [tokenId] = await erc1155TokenContract.tokens(lastTokenId);

        expect(tokenId).to.equal(0);
    }) 
    it("Should be able to update treasury", async function() {
        const newTreasuryAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

        await erc1155TokenContract.setTreasury(newTreasuryAddress);

        expect(await erc1155TokenContract.treasury()).to.equal(newTreasuryAddress);
    })
    it("Should return the uri of specific token id", async function() {
        expect(await erc1155TokenContract.uri(0)).to.equal("https://uri.com");
    })
    it("Should be able to change url of each minted token", async function() {
        await erc1155TokenContract.setTokenUri(0, "https://newUri.com");

        expect(await erc1155TokenContract.uri(0)).to.equal("https://newUri.com");
    })
    it("Should be able to mint multiple nfts", async function() {
        let tokenId = await erc1155TokenContract.tokenId();
        await erc1155TokenContract.mintBatch("ttps://uri.com", 5);

        expect(await await erc1155TokenContract.tokenId()).to.equal(Number(tokenId)+5);

    })
})