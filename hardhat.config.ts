require("dotenv").config();

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
};

export default hardhatSettings
