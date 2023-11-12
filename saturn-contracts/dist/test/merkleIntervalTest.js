"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const network_helpers_1 = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const hardhat_1 = require("hardhat");
const typechain_types_1 = require("../typechain-types");
const merkleUtils_1 = require("../src/sdk/merkleUtils");
/// Dummy hash function
function dummyHash(l, r) {
    return l + r;
}
function verifyMerkleInterval(offset, interval, proof) {
    const root = (0, merkleUtils_1.computeMerkleIntervalRoot)(dummyHash, 3, offset, interval, proof);
    (0, chai_1.expect)(root).eql("abcdefgh");
}
describe("Merkle intervals", () => {
    async function deployMerkleTest() {
        const [signer] = await hardhat_1.ethers.getSigners();
        const MerkleTest = new typechain_types_1.MerkleTest__factory(signer);
        const merkleTest = await MerkleTest.deploy();
        await merkleTest.waitForDeployment();
        return merkleTest;
    }
    // Configs to test "manually".  Represents every combination of odd/even
    // starting/finishing index, single entries, all entries, entries at the
    // edges.
    //
    //    |a|b|c|d|e|f|g|h|
    // 1   *
    // 2   * *
    // 3   * * *
    // 4     *
    // 5     * *
    // 6     * * *
    // 7       *
    // 8       * *
    // 9       * * *
    // 10                *
    // 11              * *
    // 12            * * *
    // 13  * * * * * * * *
    describe("computeMerkelIntervalRoot", () => {
        it("config 1", function () {
            //  |a|b|c|d|e|f|g|h|
            //   *
            verifyMerkleInterval(0, ["a"], ["b", "cd", "efgh"]);
        });
        it("config 2", function () {
            //  |a|b|c|d|e|f|g|h|
            //   * *
            verifyMerkleInterval(0, ["a", "b"], ["cd", "efgh"]);
        });
        it("config 3", function () {
            //  |a|b|c|d|e|f|g|h|
            //   * * *
            verifyMerkleInterval(0, ["a", "b", "c"], ["d", "efgh"]);
        });
        it("config 4", function () {
            //  |a|b|c|d|e|f|g|h|
            //     *
            verifyMerkleInterval(1, ["b"], ["a", "cd", "efgh"]);
        });
        it("config 5", function () {
            //  |a|b|c|d|e|f|g|h|
            //     * *
            verifyMerkleInterval(1, ["b", "c"], ["a", "d", "efgh"]);
        });
        it("config 6", function () {
            //  |a|b|c|d|e|f|g|h|
            //     * * *
            verifyMerkleInterval(1, ["b", "c", "d"], ["a", "efgh"]);
        });
        it("config 7", function () {
            //  |a|b|c|d|e|f|g|h|
            //       *
            verifyMerkleInterval(2, ["c"], ["d", "ab", "efgh"]);
        });
        it("config 8", function () {
            //  |a|b|c|d|e|f|g|h|
            //       * *
            verifyMerkleInterval(2, ["c", "d"], ["ab", "efgh"]);
        });
        it("config 9", function () {
            //  |a|b|c|d|e|f|g|h|
            //       * * *
            verifyMerkleInterval(2, ["c", "d", "e"], ["f", "ab", "gh"]);
        });
        it("config 10", function () {
            //  |a|b|c|d|e|f|g|h|
            //                 *
            verifyMerkleInterval(7, ["h"], ["g", "ef", "abcd"]);
        });
        it("config 11", function () {
            //  |a|b|c|d|e|f|g|h|
            //               * *
            verifyMerkleInterval(6, ["g", "h"], ["ef", "abcd"]);
        });
        it("config 12", function () {
            //  |a|b|c|d|e|f|g|h|
            //             * * *
            verifyMerkleInterval(5, ["f", "g", "h"], ["e", "abcd"]);
        });
        it("config 13", function () {
            //  |a|b|c|d|e|f|g|h|
            //   * * * * * * * *
            verifyMerkleInterval(0, ["a", "b", "c", "d", "e", "f", "g", "h"], []);
        });
    });
    describe("computeMerkelIntervalProof", () => {
        it("all possible configs", function () {
            // Using the leaf nodes:
            //
            //    |a|b|c|d|e|f|g|h|
            //
            // we take every possible interval, create a proof and check that the
            // correct root is generated.
            const leafNodes = ["a", "b", "c", "d", "e", "f", "g", "h"];
            const expectRoot = "abcdefgh";
            for (let offset = 0; offset < 8; ++offset) {
                for (let numEntries = 1; numEntries <= 8 - offset; ++numEntries) {
                    const { proof, root: proofRoot } = (0, merkleUtils_1.createMerkleIntervalProof)(dummyHash, leafNodes, offset, numEntries);
                    (0, chai_1.expect)(proofRoot).equal(expectRoot);
                    const interval = leafNodes.slice(offset, offset + numEntries);
                    const computedRoot = (0, merkleUtils_1.computeMerkleIntervalRoot)(dummyHash, 3, offset, interval, proof);
                    (0, chai_1.expect)(computedRoot).equal(expectRoot, `offset: ${offset}, numEntries: ${numEntries}, ` +
                        `interval: ${JSON.stringify(interval)}`);
                }
            }
        });
    });
    describe("computeMerkleRoot", () => {
        it("all possible configs", function () {
            // Using the leaf nodes:
            //
            //    |a|b|c|d|e|f|g|h|
            //
            // we take every possible interval, create a proof and check that the
            // correct root is generated.
            const leafNodes = ["a", "b", "c", "d", "e", "f", "g", "h"];
            const expectRoot = "abcdefgh";
            (0, chai_1.expect)((0, merkleUtils_1.computeMerkleRoot)(dummyHash, leafNodes)).eql(expectRoot);
            (0, chai_1.expect)((0, merkleUtils_1.computeMerkleRoot)(dummyHash, leafNodes.slice(0, 4))).eql(expectRoot.slice(0, 4));
        });
    });
    describe("computeMerkleProof", () => {
        it("all possible configs", function () {
            // Using the leaf nodes:
            //
            //    |a|b|c|d|e|f|g|h|
            //
            // we take every entry in turn and check the generated proof.
            const leafNodes = ["a", "b", "c", "d", "e", "f", "g", "h"];
            function getProof(idx) {
                return (0, merkleUtils_1.computeMerkleProof)(dummyHash, leafNodes, idx).proof;
            }
            (0, chai_1.expect)(getProof(0)).eql(["b", "cd", "efgh"]);
            (0, chai_1.expect)(getProof(1)).eql(["a", "cd", "efgh"]);
            (0, chai_1.expect)(getProof(2)).eql(["d", "ab", "efgh"]);
            (0, chai_1.expect)(getProof(3)).eql(["c", "ab", "efgh"]);
            (0, chai_1.expect)(getProof(4)).eql(["f", "gh", "abcd"]);
            (0, chai_1.expect)(getProof(5)).eql(["e", "gh", "abcd"]);
            (0, chai_1.expect)(getProof(6)).eql(["h", "ef", "abcd"]);
            (0, chai_1.expect)(getProof(7)).eql(["g", "ef", "abcd"]);
        });
    });
    describe("contract", () => {
        const leafNodes = [
            "0x1000000000000000000000000000000000000000000000000000000000000000",
            "0x2000000000000000000000000000000000000000000000000000000000000000",
            "0x3000000000000000000000000000000000000000000000000000000000000000",
            "0x4000000000000000000000000000000000000000000000000000000000000000",
            "0x5000000000000000000000000000000000000000000000000000000000000000",
            "0x6000000000000000000000000000000000000000000000000000000000000000",
            "0x7000000000000000000000000000000000000000000000000000000000000000",
            "0x8000000000000000000000000000000000000000000000000000000000000000",
        ];
        const expectRoot = (0, merkleUtils_1.evmHashFn)((0, merkleUtils_1.evmHashFn)((0, merkleUtils_1.evmHashFn)(leafNodes[0], leafNodes[1]), (0, merkleUtils_1.evmHashFn)(leafNodes[2], leafNodes[3])), (0, merkleUtils_1.evmHashFn)((0, merkleUtils_1.evmHashFn)(leafNodes[4], leafNodes[5]), (0, merkleUtils_1.evmHashFn)(leafNodes[6], leafNodes[7])));
        it("evmMerkleDepth", async function () {
            const merkleTest = await (0, network_helpers_1.loadFixture)(deployMerkleTest);
            (0, chai_1.expect)(await merkleTest.merkleDepth(4)).equals(2);
            (0, chai_1.expect)(await merkleTest.merkleDepth(5)).equals(3);
            (0, chai_1.expect)(await merkleTest.merkleDepth(6)).equals(3);
            (0, chai_1.expect)(await merkleTest.merkleDepth(7)).equals(3);
            (0, chai_1.expect)(await merkleTest.merkleDepth(8)).equals(3);
            (0, chai_1.expect)(await merkleTest.merkleDepth(255)).equals(8);
            (0, chai_1.expect)(await merkleTest.merkleDepth(256)).equals(8);
            (0, chai_1.expect)(await merkleTest.merkleDepth(257)).equals(9);
        });
        it("evmComputeMerkleRoot", async function () {
            const merkleTest = await (0, network_helpers_1.loadFixture)(deployMerkleTest);
            const computedRoot = (0, merkleUtils_1.computeMerkleRoot)(merkleUtils_1.evmHashFn, leafNodes);
            (0, chai_1.expect)(computedRoot).eql(expectRoot);
            const evmRoot = await merkleTest.computeMerkleRoot(leafNodes);
            (0, chai_1.expect)(evmRoot).eql(expectRoot);
        });
        it("evmVerifyMerkleProof", async function () {
            const merkleTest = await (0, network_helpers_1.loadFixture)(deployMerkleTest);
            const depth = Math.log2(leafNodes.length);
            // for (let i = 0; i < leafNodes.length; ++i) {
            for (let i = 0; i < 1; ++i) {
                const { proof } = (0, merkleUtils_1.computeMerkleProof)(merkleUtils_1.evmHashFn, leafNodes, i);
                const verified = merkleTest.verifyMerkleProof(expectRoot, leafNodes[i], depth, i, proof);
                const verifiedInvalidIdx = merkleTest.verifyMerkleProof(expectRoot, leafNodes[i], depth, (i + 1) % leafNodes.length, proof);
                // Swap the first 2 entries of the proof
                const tmp = proof[0];
                proof[0] = proof[1];
                proof[1] = tmp;
                const verifiedInvalidProof = merkleTest.verifyMerkleProof(expectRoot, leafNodes[i], depth, (i + 1) % leafNodes.length, proof);
                (0, chai_1.expect)(await verified).equal(true);
                (0, chai_1.expect)(await verifiedInvalidIdx).equal(false);
                (0, chai_1.expect)(await verifiedInvalidProof).equal(false);
            }
        });
        it("evmHashFn", async function () {
            const merkleTest = await (0, network_helpers_1.loadFixture)(deployMerkleTest);
            const l = hardhat_1.ethers.hexlify(hardhat_1.ethers.randomBytes(32));
            const r = hardhat_1.ethers.hexlify(hardhat_1.ethers.randomBytes(32));
            const expected = await merkleTest.hash(l, r);
            const actual = (0, merkleUtils_1.evmHashFn)(l, r);
            (0, chai_1.expect)(actual).equal(expected);
            console.log(`hash(${l}, ${r})=${expected}`);
        });
        it("evmHashFn all possible configs", async function () {
            const merkleTest = await (0, network_helpers_1.loadFixture)(deployMerkleTest);
            // Using the leaf nodes:
            //
            //    |0x10..00|0x20..00|0x30..00|...|0x80..00|
            //
            // we take every possible interval, create a proof and check that the
            // correct root is generated.
            for (let offset = 0; offset < 8; ++offset) {
                for (let numEntries = 1; numEntries <= 8 - offset; ++numEntries) {
                    const { proof, root: proofRoot } = (0, merkleUtils_1.createMerkleIntervalProof)(merkleUtils_1.evmHashFn, leafNodes, offset, numEntries);
                    (0, chai_1.expect)(proofRoot).equal(expectRoot);
                    // Typescript verification function
                    const interval = leafNodes.slice(offset, offset + numEntries);
                    const computedRootTs = (0, merkleUtils_1.computeMerkleIntervalRoot)(merkleUtils_1.evmHashFn, 3, offset, interval, proof);
                    (0, chai_1.expect)(computedRootTs).equal(expectRoot, `(ts) offset: ${offset}, numEntries: ${numEntries}, ` +
                        `interval: ${JSON.stringify(interval)}`);
                    // Solidity verification function
                    const computedRootSol = await merkleTest.computeMerkleIntervalRoot(3, offset, interval, proof);
                    (0, chai_1.expect)(computedRootSol).equal(expectRoot, `(sol) offset: ${offset}, numEntries: ${numEntries}, ` +
                        `interval: ${JSON.stringify(interval)}`);
                }
            }
        });
    });
});
//# sourceMappingURL=merkleIntervalTest.js.map