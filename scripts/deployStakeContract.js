/* global ethers */
/* eslint prefer-const: "off" */
const fs = require("fs");
const { ethers } = require("hardhat");

const { addresses } = require("./pairAddresses.json");
const nfPositionManagerAddress = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

const addressesMap = {};

async function deployStakeContract (arrayOfPairAddresses) {
  const accounts = await ethers.getSigners()
  const signer = accounts[0]

  const MockERC20 = await ethers.getContractFactory('MockERC20');
  const hbtToken = await MockERC20.deploy("Habitat", "HBT", signer.address, ethers.BigNumber.from('1000000000000000000000000'));
  await hbtToken.deployed();
  addressesMap.hbtERC20 = hbtToken.address;
  const MockVotingPowerHolder = await ethers.getContractFactory('MockVotingPowerHolder');
  const votingPowerHolder = await MockVotingPowerHolder.deploy();
  await votingPowerHolder.deployed();
  addressesMap.votingPowerHolder = votingPowerHolder.address;
  const StakeContractERC20UniV3 = await ethers.getContractFactory('StakeContractERC20UniV3');
  const stakeContractERC20UniV3 = await StakeContractERC20UniV3.deploy(votingPowerHolder.address, nfPositionManagerAddress, hbtToken.address, arrayOfPairAddresses);
  await stakeContractERC20UniV3.deployed();
  addressesMap.stakeContractERC20UniV3 = stakeContractERC20UniV3.address;
  await votingPowerHolder.setVPM(stakeContractERC20UniV3.address);
  const PositionValueTest = await ethers.getContractFactory('PositionValueTest');
  const positionValueTest = await PositionValueTest.deploy();
  await positionValueTest.deployed();
  addressesMap.positionValueTest = positionValueTest.address;
  await fs.promises.writeFile('./contracts/addressesMap.json', JSON.stringify(addressesMap));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  deployStakeContract(addresses)
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error)
      process.exit(1)
    })
}

exports.deployStakeContract = deployStakeContract
