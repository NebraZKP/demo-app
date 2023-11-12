"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const chai_1 = require("chai");
const fs_1 = require("fs");
const utils_1 = require("../src/sdk/utils");
describe("Yul Tests", () => {
    describe("Deploy test Yul contract", () => {
        it("read and deploy binary contracts", async function () {
            const [deployer] = await hardhat_1.ethers.getSigners();
            const yul_address = await (0, utils_1.deployBinaryContract)(deployer, "test/data/test.bin");
            // Invoke via the YulTest contract.
            const YulTest = await hardhat_1.ethers.getContractFactory("YulTest");
            const yulTest = await YulTest.deploy();
            // Expect to receive a single uint(19).
            const data = await yulTest.callYul.staticCall(yul_address, "0x01");
            (0, chai_1.expect)(BigInt(data)).to.equal(19n);
            // Expect the yul code to revert
            await (0, chai_1.expect)(yulTest.callYul.staticCall(yul_address, "0x")).reverted;
            await (0, chai_1.expect)(yulTest.callYul(yul_address, "0x")).reverted;
        });
    });
    describe("Deploy verifier Yul contract", () => {
        it("read and deploy binary contracts", async function () {
            const [deployer] = await hardhat_1.ethers.getSigners();
            const yul_address = await (0, utils_1.deployBinaryContract)(deployer, "test/data/outer_2_2.verifier.bin");
            // Load the test calldata
            const calldata = (0, fs_1.readFileSync)("test/data/outer_2_2.proof.calldata");
            // Invoke via the YulTest contract.
            const YulTest = await hardhat_1.ethers.getContractFactory("YulTest");
            const yulTest = await YulTest.deploy();
            await yulTest.callYul.staticCall(yul_address, calldata);
            // Invalid calldata
            await (0, chai_1.expect)(yulTest.callYul.staticCall(yul_address, "0x")).reverted;
            await (0, chai_1.expect)(yulTest.callYul(yul_address, "0x")).reverted;
            calldata[0] = 7;
            await (0, chai_1.expect)(yulTest.callYul.staticCall(yul_address, calldata)).reverted;
            await (0, chai_1.expect)(yulTest.callYul(yul_address, calldata)).reverted;
        });
    });
});
//# sourceMappingURL=yulTests.js.map