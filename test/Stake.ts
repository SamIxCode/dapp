import { copyFileSync } from "fs";
import { COMPILER_INDEXES } from "next/dist/shared/lib/constants";

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Stake", function () {
    describe("deployment", async function(){

  
        it("Should deploy the contract", async function () {
        const Stake = await ethers.getContractFactory("Stake");
        const stake = await Stake.deploy();

        expect(await stake.target).to.not.be.undefined;
})
  });


});
