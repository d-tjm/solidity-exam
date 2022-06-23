const hre = require("hardhat");
const {ethers} = hre;

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying ERC1155Token contract with the account:", deployer.address);

    const ERC1155Token = await ethers.getContractFactory("ERC1155Token");
    const erc1155Token = await ERC1155Token.deploy(deployer.address);

    await erc1155Token.deployed();

    console.log("ERC1155Token deployed to contract address:", erc1155Token.address);

    console.log("Deploying NftStaker contract with the account:", deployer.address)
    const NftStaker = await ethers.getContractFactory("NftStaker");
    const nftStaker = await NftStaker.deploy(erc1155Token.address, 60);

    await nftStaker.deployed();

    console.log("NftStaker deployed to contract address:", nftStaker.address);

    console.log("Calling setApprovalForAll in ERC1155Token contract");
    erc1155Token.setApprovalForAll(nftStaker.address, true);

    console.log("Verifying ERC1155Token contract:",erc1155Token.address);
    await hre.run("verify:verify", {
      address: erc1155Token.address,
      constructorArguments: [deployer.address]
    });

    console.log("Verifying NftStaker contract:",nftStaker.address);
    await hre.run("verify:verify", {
      address: nftStaker.address,
      constructorArguments: [erc1155Token.address,60]
    });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
