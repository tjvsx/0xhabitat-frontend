import { promises } from "fs";
import { ethers } from "ethers";
const { decode } = require("cbor-x");
const cborDecode = decode;
const axios = require('axios').default;
const bs58 = require("bs58");

function fromHexString(hexString: string) {
  const hexMatch = hexString.match(/.{1,2}/g) || [];
  return new Uint8Array(hexMatch.map((byte) => parseInt(byte, 16)));
}

async function getMetadataFromAddress(address: string) {
  const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
  const bytecode = await provider.getCode(address);
  const ipfsHashLength = parseInt(
    `${bytecode.substr(bytecode.length - 4)}`,
    16
  );
  const cborEncoded = bytecode.substring(
    bytecode.length - 4 - ipfsHashLength * 2,
    bytecode.length - 4
  );
  const contractMetadata = cborDecode(fromHexString(cborEncoded));
  const toHexString = (bytes: any[]) =>
    bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");

  /* const { create } = await import("ipfs-http-client");
  console.log(create)
  const node = create();

  const stream = node.cat(bs58.encode(contractMetadata.ipfs));

  let data = "";

  for await (const chunk of stream) {
    // chunks of data are returned as a Buffer, convert it back to a string
    data += chunk.toString();
  } */
  console.log(bs58.encode(contractMetadata.ipfs))
  let contractMetadataJSON: any
  try {
    const req = await axios(`https://ipfs.io/ipfs/${bs58.encode(contractMetadata.ipfs)}`);
    contractMetadataJSON = req.data
  } catch(e) {
    console.log('Cannot get metadata for this contract')
    process.exit()
  }
  
  const name = Object.values(
    contractMetadataJSON.settings.compilationTarget
  )[0];

  const abi = contractMetadataJSON.output.abi;

  return {
    name,
    abi,
    output: contractMetadataJSON.output,
  };
}

async function getMetadata(address: string) {
  const { name, output } = await getMetadataFromAddress(address);
  await promises.writeFile(`./metadata/${name}.json`, JSON.stringify(output));
}

var args = process.argv.slice(2);
getMetadata(args[0]);
