// script to create a blank account to test with
const { default: Micronaut } = require("../dist/index");
const dotenv = require("dotenv");
const open = require("open");
dotenv.config();
const Micronaut = new Micronaut({
  BASE_SERVER: "https://testnet-algorand.api.purestake.io/ps2",
  LEDGER: "TestNet",
  PORT: "",
  API_TOKEN: { "X-API-Key": process.env.PURESTAKE_API_TOKEN },
});

console.log("Creating an account on TestNet.");
let wallet = Micronaut.createWallet();
console.log("ADDRESS:");
console.log(wallet.address);
console.log("MNEMONIC:");
console.log(wallet.mnemonic);

open("https://bank.testnet.algorand.network/");
