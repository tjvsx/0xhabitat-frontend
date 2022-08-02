require("dotenv").config();
import '@nomiclabs/hardhat-waffle';
import 'hardhat-abi-exporter';

// This adds support for typescript paths mappings
import 'tsconfig-paths/register';

const hardhatSettings = {
  solidity: "0.8.15",
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: "http://localhost:8545",
    },
    hardhat: {
      forking: {
        url: process.env.ALCHEMY_RINKEBY_URL,
      }
    },
  },
  abiExporter: {
    path: './test/abis',
    runOnCompile: true,
    clear: true,
    flat: true,
    only: [
      'StakeContractERC20UniV3',
      'MockERC20',
      'MockVotingPowerHolder',
      'PositionValueTest'
    ],
    spacing: 2,
    pretty: false,
  },
};

export default hardhatSettings
