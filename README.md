# 0xhabitat FE

> This project is temporary, it actually uses libraries that are under development. Big thanks to the useDapp team for the `usedapp-generate-hooks` script.

The main scope of this project is to test some *generators* libraries. Briefly they are used to automatically generate usable smart contracts interfaces in javascript/typescript environments.


## How it works
Currently the library:
1. takes as input an address of a smart contract
2. it extracts the metadata.json file from the bytecode of that address
    ```bash
    yarn fetch:metadata 0x1EFFEbE8B0bc20f2Dc504AA16dC76FF1AB2297A3
    ```
3. it generates the typechain's factories from the metadata.json file
    ```bash
    yarn generate:typechain
    ```
4. it generates the useDapp hooks from the typechain's factories
    ```bash
    yarn generate:usedapp
    ```
All of these commands are automated by running
```bash
yarn add:usedapp 0x1EFFEbE8B0bc20f2Dc504AA16dC76FF1AB2297A3
```

## Development
To run local optimism mainnet fork node and deploy stake contract use this commands:
- in separate terminal:
```
npx hardhat node
```
- in another terminal:
```
npx hardhat run --network localhost scripts/deployStakeContract.js
```
To use contracts make requests to http://127.0.0.1:8545/ and contract addresses can be found in ```./contracts/addressesMap.json```
