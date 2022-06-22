const { expect } = require('chai');
const { ethers } = require('hardhat');

describe("NftStaker", function() {
    let nftStakerContract;
    let parentNftContract;
    let owner;

    before(async function() {
        const signers = await ethers.getSigners();
        owner = signers[0];

        // Deploy parent nft contract
        const ParentNft = await ethers.getContractFactory("ERC1155Token");
        const parentNft = await ParentNft.deploy(owner.address);

        parentNftContract = await parentNft.deployed();

        await parentNft.mint("https://uri.com");

        // Deploy nftstaker contract
        const NftStaker = await ethers.getContractFactory("NftStaker");
        const nftStaker = await NftStaker.deploy(parentNftContract.address, 1);

        nftStakerContract = await nftStaker.deployed();

        // Set approval for nft staker from parent nft
        await parentNftContract.setApprovalForAll(nftStakerContract.address, true);
    })
    it("Should be able to stake nft", async function() {
        await nftStakerContract.stake(0, 1);
        
        const [tokenId] = await nftStakerContract.stakes(owner.address);

        expect(tokenId).to.equal(0);
    })
    it("Should return current staked nft", async function() {
        const [tokenId,amount] = await nftStakerContract.stakes(owner.address);

        expect(amount).to.equal(1)
    })
    it("Should should be able to unstake", async function() {
        setTimeout(async function() {
            await nftStakerContract.unstake();

            const [,amount] = await nftStakerContract.stakes(owner.address);

            expect(amount).to.equal(0)
        }, 1000)
    })
})