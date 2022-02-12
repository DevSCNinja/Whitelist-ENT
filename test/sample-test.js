const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WhitelistERC20", async () => {
  let whiteListERC20;
  let owner;
  let addr1;
  let addr2;

  let owneraddress;

  before( async () => {
    [owner, addr1, addr2] = await ethers.getSigners();

    owneraddress = owner.address;

    const WhitelistERC20 = await ethers.getContractFactory("WhitelistERC20");
    whiteListERC20 = await WhitelistERC20.deploy("WLERC20", "WLE");
    await whiteListERC20.deployed();
  });


  it("ERC20 has been deployed", async function () {
    expect(await whiteListERC20.symbol()).to.equal("WLE");
    expect(await whiteListERC20.name()).to.equal("WLERC20");
  });

  it("Whitelist add & remove", async () => {
    // Add whitelist users
    await whiteListERC20.add(owneraddress);
    expect(await whiteListERC20.isWhitelisted(owneraddress)).to.equal(true);

    // Remove and check
    await whiteListERC20.remove(owneraddress);
    expect(await whiteListERC20.isWhitelisted(owneraddress)).to.equal(false);

  });

  it("ERC20 is ownable contract", async() => {
    // By anthoer users
    await expect(whiteListERC20.connect(addr1).add(owneraddress)).to.be.reverted;

    
    // Add whitelist users
    await whiteListERC20.add(owneraddress);
    expect(await whiteListERC20.isWhitelisted(owneraddress)).to.equal(true);
  });


  it("Minting by non-whitelisted user", async function () {
    // minting by non-whitelisted user
    await expect(whiteListERC20.connect(addr1).mint(2000)).to.be.reverted;
  });


  it("Minting by whitelisted user", async function () {
    // minting by whitelisted user
    
    await whiteListERC20.mint(2000);

    expect(await whiteListERC20.balanceOf(owneraddress)).to.equal(2000);
  });
});
