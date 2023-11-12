"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const network_helpers_1 = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const hardhat_1 = require("hardhat");
const chai_1 = require("chai");
describe("BitVectorTest", () => {
    async function deploy() {
        const [owner] = await hardhat_1.ethers.getSigners();
        const BitVectorLibTest = await hardhat_1.ethers.getContractFactory("BitVectorLibTest", { signer: owner });
        return await BitVectorLibTest.deploy();
    }
    describe("BitVector", () => {
        it("bit 0", async function () {
            const bitVectorTest = await (0, network_helpers_1.loadFixture)(deploy);
            await bitVectorTest.set(0);
            await bitVectorTest.set(3);
            console.log(await bitVectorTest.getWords());
            (0, chai_1.expect)(await bitVectorTest.isSet(0)).to.equal(true);
        });
        it("correctly reflects set bits", async function () {
            // 3 words (including a bit in the last word) should test all code
            // paths.
            const totalNumBits = 514;
            const bitVectorTest = await (0, network_helpers_1.loadFixture)(deploy);
            // Check that nothing has been set
            for (let i = 0; i < totalNumBits; ++i) {
                (0, chai_1.expect)(await bitVectorTest.isSet(i)).to.equal(false);
            }
            // Set every 3rd bitidx
            for (let i = 0; i < totalNumBits; ++i) {
                if (i % 3 == 0) {
                    await bitVectorTest.set(i);
                }
            }
            // Set the same bits again
            for (let i = 0; i < totalNumBits; ++i) {
                if (i % 3 == 0) {
                    await bitVectorTest.set(i);
                }
            }
            // Check the values that have been set
            for (let i = 0; i < totalNumBits; ++i) {
                const bit = await bitVectorTest.isSet(i);
                (0, chai_1.expect)(bit).to.equal(i % 3 == 0);
            }
        });
        it("correctly reflects bits set out of order", async function () {
            // 3 words (including a bit in the last word) should test all code
            // paths.
            const totalNumBits = 514;
            const bitVectorTest = await (0, network_helpers_1.loadFixture)(deploy);
            // Set every 3rd bitidx
            for (let i = totalNumBits - 1; i >= 0; --i) {
                if (i % 3 == 0) {
                    await bitVectorTest.set(i);
                }
            }
            // Check the values that have been set
            for (let i = 0; i < totalNumBits; ++i) {
                const bit = await bitVectorTest.isSet(i);
                (0, chai_1.expect)(bit).to.equal(i % 3 == 0);
            }
        });
    });
    describe("Uint16Vector", () => {
        it("correctly sets and resets", async function () {
            const totalNumEntries = 514n;
            const bitVectorTest = await (0, network_helpers_1.loadFixture)(deploy);
            // Set every 3rd entry
            for (let i = totalNumEntries - 1n; i >= 0n; --i) {
                if (i % 3n == 0n) {
                    await bitVectorTest.setUint16(i, i);
                }
            }
            // Check the values that have been set
            for (let i = 0n; i < totalNumEntries; ++i) {
                const expectedValue = i % 3n == 0n ? i : 0;
                const value = await bitVectorTest.getUint16(i);
                (0, chai_1.expect)(value).to.equal(expectedValue);
            }
            // Overwrite every 3rd entry
            for (let i = totalNumEntries - 1n; i >= 0n; --i) {
                if (i % 3n == 0n) {
                    await bitVectorTest.setUint16(i, i + 2n);
                }
            }
            // Check the values that have been overwritten
            for (let i = 0n; i < totalNumEntries; ++i) {
                const expectedValue = i % 3n == 0n ? i + 2n : 0n;
                const value = await bitVectorTest.getUint16(i);
                (0, chai_1.expect)(value).to.equal(expectedValue);
            }
        });
    });
});
//# sourceMappingURL=bitVectorTest.js.map