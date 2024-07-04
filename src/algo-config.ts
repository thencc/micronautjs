import type { MicronautConfig } from "./MicronautTypes";

export const testnetConfig: MicronautConfig["nodeConfig"] = {
  LEDGER: "testnet",
  BASE_SERVER: "https://testnet-api.algonode.cloud",
  INDEX_SERVER: "https://testnet-idx.algonode.cloud",
  API_TOKEN: "",
  PORT: "", // 443
};
export const mainnetConfig: MicronautConfig["nodeConfig"] = {
  LEDGER: "mainnet",
  BASE_SERVER: "https://mainnet-api.algonode.cloud",
  INDEX_SERVER: "https://mainnet-idx.algonode.cloud",
  API_TOKEN: "",
  PORT: "",
};
export const defaultNodeConfig = testnetConfig;
