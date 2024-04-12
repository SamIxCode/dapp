import { HardhatUserConfig } from "hardhat/config";
require("@nomicfoundation/hardhat-toolbox");

require('dotenv').config()


const config: HardhatUserConfig = {
  solidity: "0.8.24",
networks: {
  sepolia:{
    url: process.env?.SEPOLIA_INFURA!,
    accounts:[process.env?.WALLET_PK!]
  }
}
};

export default config;
