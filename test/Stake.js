const { expect } = require("chai")
const { ethers } = require("hardhat")


describe("Stake", function () {
    let staker1, staker2, staker;
    beforeEach(async function() {
        [staker1,staker2]  = await ethers.getSigners();
        const Staker = await ethers.getContractFactory("Stake");
        staker =  await Staker.deploy();
        await staker.waitForDeployment();
        
    })


    describe("deployed with correct values", function() {
        it("staker should have 0 balance", async function(){
            expect(await staker.balanceOf(staker1.address)).to.equal(0)
            expect(await staker.balanceOf(staker2.address)).to.equal(0)
        })
    })

});