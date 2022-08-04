/* global ethers */
/* eslint prefer-const: "off" */
const fs = require("fs");
const { ethers } = require("hardhat");

const { tokenName } = require("./pairAddresses.json");
const { addresses } = require("./pairAddresses.json");
const { pricesToken0 } = require("./pairAddresses.json");
const { pricesToken1 } = require("./pairAddresses.json");
const nfPositionManagerAddress = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";
const nfPositionManagerABI = require('../test/abis/NonfungiblePositionManager.json');
const uniswapV3PoolABI = require('../test/abis/UniswapV3Pool.json');

const addressesMap = {};
const pools = {
  "500": "",
  "3000": "",
  "10000": ""
};

async function deployStakeContract (arrayOfPairAddresses) {
  const accounts = await ethers.getSigners()
  const signer = accounts[0]

  const Multicall = await ethers.getContractFactory('Multicall');
  const multicall = await Multicall.deploy();
  await multicall.deployed();
  console.log('💎 multicall:', multicall.address);

  const Multicall2 = await ethers.getContractFactory('Multicall2');
  const multicall2 = await Multicall2.deploy();
  await multicall2.deployed();
  console.log('💎 multicall2:', multicall2.address);

  const MockERC20 = await ethers.getContractFactory('MockERC20');
  const hbtToken = await MockERC20.deploy("Habitat", "HBT", signer.address, ethers.BigNumber.from('1000000000000000000000000'));
  await hbtToken.deployed();
  addressesMap.hbtERC20 = hbtToken.address;
  console.log('💎 HBT ERC20:', hbtToken.address);

  const MockVotingPowerHolder = await ethers.getContractFactory('MockVotingPowerHolder');
  const votingPowerHolder = await MockVotingPowerHolder.deploy();
  await votingPowerHolder.deployed();
  addressesMap.votingPowerHolder = votingPowerHolder.address;
  console.log('💎 VotingPowerHolder:', votingPowerHolder.address);

  const StakeContractERC20UniV3 = await ethers.getContractFactory('StakeContractERC20UniV3');
  const stakeContractERC20UniV3 = await StakeContractERC20UniV3.deploy(votingPowerHolder.address, nfPositionManagerAddress, hbtToken.address, arrayOfPairAddresses);
  await stakeContractERC20UniV3.deployed();
  addressesMap.stakeContractERC20UniV3 = stakeContractERC20UniV3.address;
  console.log('💎 StakeContractUniV3:', stakeContractERC20UniV3.address);

  await votingPowerHolder.setVPM(stakeContractERC20UniV3.address);
  const PositionValueTest = await ethers.getContractFactory('PositionValueTest');
  const positionValueTest = await PositionValueTest.deploy();
  await positionValueTest.deployed();
  addressesMap.positionValueTest = positionValueTest.address;
  console.log('💎 Position Value Test:', positionValueTest.address);

  // deploy pools
  let isHBTToken0;
  const nfPositionManager = new ethers.Contract(nfPositionManagerAddress, nfPositionManagerABI.abi, signer);

  addressesMap.pools = {};
  for (let i = 0; i < arrayOfPairAddresses.length; i++) {
    addressesMap.pools[tokenName[i]] = [];
    if (ethers.BigNumber.from(hbtToken.address).lt(ethers.BigNumber.from(arrayOfPairAddresses[i]))) {
      isHBTToken0 = true;
      for (const fee in pools) {
        const poolAddress = await nfPositionManager.callStatic.createAndInitializePoolIfNecessary(hbtToken.address, arrayOfPairAddresses[i], ethers.BigNumber.from(fee), ethers.BigNumber.from(pricesToken1[i]));
        addressesMap.pools[tokenName[i]].push({[fee]: poolAddress});
        await nfPositionManager.createAndInitializePoolIfNecessary(hbtToken.address, arrayOfPairAddresses[i], ethers.BigNumber.from(fee), ethers.BigNumber.from(pricesToken1[i]));
      }
    } else {
      isHBTToken0 = false;
      for (const fee in pools) {
        const poolAddress = await nfPositionManager.callStatic.createAndInitializePoolIfNecessary(arrayOfPairAddresses[i], hbtToken.address, ethers.BigNumber.from(fee), ethers.BigNumber.from(pricesToken0[i]));
        addressesMap.pools[tokenName[i]].push({[fee]: poolAddress});
        await nfPositionManager.createAndInitializePoolIfNecessary(arrayOfPairAddresses[i], hbtToken.address, ethers.BigNumber.from(fee), ethers.BigNumber.from(pricesToken0[i]));
      }
    }
  }
  await fs.promises.writeFile('./contracts/addressesMap.json', JSON.stringify(addressesMap));

  return [multicall, multicall2, hbtToken, votingPowerHolder, stakeContractERC20UniV3, positionValueTest, nfPositionManager];
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
