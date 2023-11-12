"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deploySaturnDummyVerifier = exports.deploySaturnWithVerifier = exports.dummyProofData = void 0;
const network_helpers_1 = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const chai_1 = require("chai");
const hardhat_1 = require("hardhat");
const utils_1 = require("../src/sdk/utils");
const fs_1 = require("fs");
const ethers_1 = require("ethers");
const application_1 = require("../src/sdk/application");
const utils_2 = require("../src/sdk/utils");
const saturn_1 = require("../src/sdk/saturn");
const merkleUtils_1 = require("../src/sdk/merkleUtils");
const keccak256_1 = require("@ethersproject/keccak256");
const submission_4 = require("../src/sdk/submission");
const typechain_types_1 = require("../typechain-types");
// eslint-disable-next-line
BigInt.prototype.toJSON = function () {
    return this.toString();
};
function appVKMakeInvalid(vk) {
    const vk_invalid = application_1.VerifyingKey.from_json(vk); // clone
    vk_invalid.alpha[1] = vk_invalid.alpha[0];
    return vk_invalid;
}
/// proofIDs are expected to be encoded as "0x" followed by 64
function dummyProofData(proofIDs) {
    // Compute final digest
    const proofIDsPreimage = "0x" +
        proofIDs
            .map((x) => {
            if (x.length != 66 || !x.toString().startsWith("0x")) {
                throw "invalid bytes32 string";
            }
            return x.slice(2);
        })
            .join("");
    const finalDigest = (0, keccak256_1.keccak256)(proofIDsPreimage);
    const finalDigestHex = finalDigest.slice(2); // remove 0x
    (0, chai_1.expect)(finalDigestHex.length).equals(64);
    // Decompose into field elements, padded to 32 bytes so they occupy the
    // correct amount of space in the binary calldata hex.
    const finalDigest_l = "0".repeat(32) + finalDigestHex.slice(32);
    const finalDigest_r = "0".repeat(32) + finalDigestHex.slice(0, 32);
    // console.log("finalDigest_l: " + finalDigest_l);
    // console.log("finalDigest_r: " + finalDigest_r);
    // Create dummy calldata.  12 (non-zero) uint256 values, followed by the
    // field elements.
    let calldata = "0x";
    for (let i = 0; i < 12; i++) {
        calldata +=
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    }
    calldata += finalDigest_l;
    calldata += finalDigest_r;
    return calldata;
}
exports.dummyProofData = dummyProofData;
// Dummy proofs and PIs
const pf_a = new application_1.Proof(["1", "2"], [
    ["3", "4"],
    ["5", "6"],
], ["7", "8"]);
const pi_a = [1n, 0n, 0n];
const pf_b = new application_1.Proof(["1", "2"], [
    ["3", "4"],
    ["5", "6"],
], ["7", "9"]);
const pi_b = [2n, 0n, 0n];
const pf_c = new application_1.Proof(["1", "2"], [
    ["3", "4"],
    ["5", "6"],
], ["7", "9"]);
const pi_c = [3n, 0n, 0n];
const pf_d = pf_c;
const pi_d = [3n, 0n, 0n];
const pf_e = pf_c;
const pi_e = [3n, 0n, 0n];
const pf_f = pf_c;
const pi_f = [3n, 0n, 0n];
// Saturn tests
async function deploySaturnWithVerifier(verifier) {
    const [owner, worker, user1, user2] = await hardhat_1.ethers.getSigners();
    const saturnDesc = await (0, saturn_1.deploySaturn)(owner, verifier || "test/data/outer_2_2.verifier.bin", undefined, owner.address, worker.address, undefined);
    const saturn = (0, saturn_1.saturnInstanceFromDescriptor)(saturnDesc, owner);
    return { saturn, owner, worker, user1, user2 };
}
exports.deploySaturnWithVerifier = deploySaturnWithVerifier;
async function deploySaturnDummyVerifier() {
    return deploySaturnWithVerifier("test/data/test.bin");
}
exports.deploySaturnDummyVerifier = deploySaturnDummyVerifier;
// Saturn tests
describe("Saturn", async () => {
    const vk = (0, utils_1.loadAppVK)("../circuits/src/tests/data/vk.json");
    const vk_invalid = appVKMakeInvalid(vk);
    describe("Compute ProofId", () => {
        // Test vector:
        //
        //   keccak([
        //     uint256(0x1),
        //     uint256(0x2),
        //     uint256(0x3),
        //     uint256(0x100000000000000000000000000000000),
        //     uint256(
        //       0x200000000000000000000000000000000000000000000000000000000000000)'
        //   ]) = 0x227ba65a7f156e2a72f88325abe99b31b0c5bd09eec1499eb48617aaa2d33fb7
        //
        // generated with Python code of the form:
        //
        //   from web3 import Web3
        //   public_inputs = [1, 2, 3, pow(2,128), pow(2, 253)]
        //   bytes = [x.to_bytes(32, byteorder="big") for x in public_inputs]
        //   full_data = b''.join(bytes)
        //   print(Web3.keccak(full_data))
        const vk_hash = "0x1";
        const PIs = [
            "0x2",
            "0x3",
            "0x100000000000000000000000000000000",
            "0x2000000000000000000000000000000000000000000000000000000000000000",
        ];
        const vk_hash_bigint = BigInt(vk_hash);
        const PIs_bigint = PIs.map((x) => BigInt(x));
        it("should match test vector 0", async () => {
            const { saturn } = await (0, network_helpers_1.loadFixture)(deploySaturnWithVerifier);
            const pid = await saturn.proofReceiver.computeProofId(vk_hash, PIs.slice(0, 0));
            (0, chai_1.expect)(pid).equals("0xb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6");
            (0, chai_1.expect)(pid).equals((0, utils_2.computeProofId)(vk_hash_bigint, PIs_bigint.slice(0, 0)));
        });
        it("should match test vector 1", async () => {
            const { saturn } = await (0, network_helpers_1.loadFixture)(deploySaturnWithVerifier);
            const pid = await saturn.proofReceiver.computeProofId(vk_hash, PIs.slice(0, 1));
            (0, chai_1.expect)(pid).equals("0xe90b7bceb6e7df5418fb78d8ee546e97c83a08bbccc01a0644d599ccd2a7c2e0");
            (0, chai_1.expect)(pid).equals((0, utils_2.computeProofId)(vk_hash_bigint, PIs_bigint.slice(0, 1)));
        });
        it("should match test vector 2", async () => {
            const { saturn } = await (0, network_helpers_1.loadFixture)(deploySaturnWithVerifier);
            const pid = await saturn.proofReceiver.computeProofId(vk_hash, PIs.slice(0, 2));
            (0, chai_1.expect)(pid).equals("0x6e0c627900b24bd432fe7b1f713f1b0744091a646a9fe4a65a18dfed21f2949c");
            (0, chai_1.expect)(pid).equals((0, utils_2.computeProofId)(vk_hash_bigint, PIs_bigint.slice(0, 2)));
        });
        it("should match test vector 3", async () => {
            const { saturn } = await (0, network_helpers_1.loadFixture)(deploySaturnWithVerifier);
            const pid = await saturn.proofReceiver.computeProofId(vk_hash, PIs.slice(0, 3));
            (0, chai_1.expect)(pid).equals("0x39235ab0d413c40e063cdebb9c8c3f1407bf5622597831333acb1f64f052216b");
            (0, chai_1.expect)(pid).equals((0, utils_2.computeProofId)(vk_hash_bigint, PIs_bigint.slice(0, 3)));
        });
        it("should match test vector 4", async () => {
            const { saturn } = await (0, network_helpers_1.loadFixture)(deploySaturnWithVerifier);
            const pid = await saturn.proofReceiver.computeProofId(vk_hash, PIs.slice(0, 4));
            (0, chai_1.expect)(pid).equals("0x227ba65a7f156e2a72f88325abe99b31b0c5bd09eec1499eb48617aaa2d33fb7");
            (0, chai_1.expect)(pid).equals((0, utils_2.computeProofId)(vk_hash_bigint, PIs_bigint.slice(0, 4)));
        });
    });
    describe("Decompose digest", () => {
        it("should decompose in the expected way", async () => {
            const { saturn } = await (0, network_helpers_1.loadFixture)(deploySaturnWithVerifier);
            const digest = "0x0123456789abcdef123456789abcdef023456789abcdef013456789abcdef012";
            const expect_l = 0x23456789abcdef013456789abcdef012n;
            const expect_h = 0x0123456789abcdef123456789abcdef0n;
            const [l, h] = await saturn.proofReceiver.digestAsFieldElements(digest);
            (0, chai_1.expect)(l).equals(expect_l);
            (0, chai_1.expect)(h).equals(expect_h);
        });
        it("should decompose the test vector in the expected way", async () => {
            const { saturn } = await (0, network_helpers_1.loadFixture)(deploySaturnWithVerifier);
            const digest = "0x227ba65a7f156e2a72f88325abe99b31b0c5bd09eec1499eb48617aaa2d33fb7";
            const expect_l = 0xb0c5bd09eec1499eb48617aaa2d33fb7n;
            const expect_h = 0x227ba65a7f156e2a72f88325abe99b31n;
            const [l, h] = await saturn.proofReceiver.digestAsFieldElements(digest);
            (0, chai_1.expect)(l).equals(expect_l);
            (0, chai_1.expect)(h).equals(expect_h);
        });
    });
    /// Test vectors from `circuits::tests::batch_verifier::components`
    describe("Compute CircuitId", () => {
        it("decomposeFq", async () => {
            const { saturn } = await (0, network_helpers_1.loadFixture)(deploySaturnWithVerifier);
            const components = await saturn.proofReceiver.decomposeFq(0x2d4d9aa7e302d9df41749d5507949d05dbea33fbb16c643b22f599a2be6df2e2n);
            const expected = [
                0x0000000000000000000000000000000000000000006c643b22f599a2be6df2e2n,
                0x0000000000000000000000000000000000000000009d5507949d05dbea33fbb1n,
                0x000000000000000000000000000000000000000000002d4d9aa7e302d9df4174n,
            ];
            (0, chai_1.expect)(components).to.eql(expected);
        });
        it("compute vkHash", async () => {
            // Test data generated by the circuits crate:
            //
            // $ cargo test --release vk_hash_test -- --show-output
            const { saturn } = await (0, network_helpers_1.loadFixture)(deploySaturnWithVerifier);
            const vk_hash = await saturn.proofReceiver.computeCircuitId(vk.solidity());
            (0, chai_1.expect)(vk_hash).equals(0x035fa17f86ab0b923a22c2d1edeab66944f9a2ca5b3f578cf90a1dc0c99dcd70n);
        });
    });
    describe("Simple Contract Operations", () => {
        it("register VK", async () => {
            const { saturn } = await (0, network_helpers_1.loadFixture)(deploySaturnWithVerifier);
            const { proofReceiver: proofReceiver } = saturn;
            const circuitId = await proofReceiver.computeCircuitId(vk.solidity());
            // Register vk and vk_invalid in order.  Check events from vk.
            const tx = await proofReceiver.registerVK(vk);
            await proofReceiver.registerVK(vk_invalid);
            {
                const receipt = await tx.wait();
                const parsedLogs = proofReceiver.interface.parseLog(receipt?.logs[0]);
                const event_vk = application_1.VerifyingKey.from_solidity(parsedLogs?.args.vk);
                (0, chai_1.expect)(JSON.stringify(event_vk)).eql(JSON.stringify(vk));
                (0, chai_1.expect)(JSON.stringify(event_vk)).eql(JSON.stringify(vk));
                (0, chai_1.expect)(parsedLogs?.args.circuitId).eql(circuitId);
            }
            // Query the contract state on the proof receiver
            const circuitIds = await proofReceiver.getCircuitIds();
            (0, chai_1.expect)(circuitIds.length).equals(2);
            const [vk_sol_0, vk_sol_1] = await Promise.all([
                proofReceiver.getVK(circuitIds[0]),
                proofReceiver.getVK(circuitIds[1]),
            ]);
            // TODO: Once we deserialize these struct, check all entries.
            (0, chai_1.expect)(application_1.VerifyingKey.from_solidity(vk_sol_0)).to.eql(vk);
            (0, chai_1.expect)(application_1.VerifyingKey.from_solidity(vk_sol_1)).to.eql(vk_invalid);
        });
        it("submitAndVerifyProof", async () => {
            const { saturn, worker } = await (0, network_helpers_1.loadFixture)(deploySaturnDummyVerifier);
            const { proofReceiver: proofReceiver, verifier: verifier } = saturn;
            // Register vk and vk_invalid in order.
            await proofReceiver.registerVK(vk);
            await proofReceiver.registerVK(vk_invalid);
            const circuitIds = await proofReceiver.getCircuitIds();
            // Convention pid_<pf>_<cid>
            const pid_a_c0 = await proofReceiver.computeProofId(circuitIds[0], pi_a);
            (0, chai_1.expect)(pid_a_c0).equals((0, utils_2.computeProofId)(circuitIds[0], pi_a));
            // const pid_b_c0 = computeProofId(circuitIds[0], pi_b);
            const pid_c_c0 = (0, utils_2.computeProofId)(circuitIds[0], pi_c);
            (0, chai_1.expect)(pid_c_c0).equals((0, utils_2.computeProofId)(circuitIds[0], pi_c));
            const height_1 = await hardhat_1.ethers.provider.getBlockNumber();
            const options = { value: await proofReceiver.estimateFee(1) };
            // Submit proof for cid[0]
            (0, chai_1.expect)(await proofReceiver.nextSubmissionIdx()).eql(1n);
            const sid_a_c0 = await proofReceiver.submit.staticCall([circuitIds[0]], [pf_a.solidity()], [pi_a], options);
            const sid_b_c0 = await proofReceiver.submit.staticCall([circuitIds[0]], [pf_a.solidity()], [pi_b], options);
            (0, chai_1.expect)(sid_a_c0).not.eql(sid_b_c0);
            (0, chai_1.expect)(sid_a_c0).eql(pid_a_c0);
            const submitTx = await proofReceiver.submit([circuitIds[0]], [pf_a.solidity()], [pi_a], options);
            // Check event emitted from submitProof
            {
                const receipt = await submitTx.wait();
                const parsedLogs = proofReceiver.interface.parseLog(receipt?.logs[0]);
                (0, chai_1.expect)(parsedLogs?.args.circuitId).eql(circuitIds[0]);
                (0, chai_1.expect)(parsedLogs?.args.proofId).eql(pid_a_c0);
                (0, chai_1.expect)(parsedLogs?.args.submissionIdx).eql(1n);
                (0, chai_1.expect)(parsedLogs?.args.proofIdx).eql(1n);
                const logProof = application_1.Proof.from_solidity(parsedLogs?.args.proof);
                (0, chai_1.expect)(JSON.stringify(logProof)).eql(JSON.stringify(pf_a));
                (0, chai_1.expect)(JSON.stringify(parsedLogs?.args.publicInputs)).eql((0, utils_1.JSONstringify)(pi_a));
            }
            // Check records for the submission
            (0, chai_1.expect)(await proofReceiver.nextSubmissionIdx()).eql(2n);
            const [submissionIdx, submissionBlockNumber] = await proofReceiver.getSubmissionIdxAndHeight(pid_a_c0);
            (0, chai_1.expect)(submissionIdx).equals(1n);
            (0, chai_1.expect)(submissionBlockNumber).greaterThan(0n);
            // Next proof idx should be 2
            (0, chai_1.expect)(await proofReceiver.nextSubmissionIdx()).eql(2n);
            // Submit the same proof, different CID
            const submit2Tx = await (0, saturn_1.submitProof)(proofReceiver, circuitIds[1], pf_a, pi_a);
            const pid_a_c1 = await proofReceiver.computeProofId(circuitIds[1], pi_a);
            (0, chai_1.expect)(pid_a_c1).equals((0, utils_2.computeProofId)(circuitIds[1], pi_a));
            const height_2 = await hardhat_1.ethers.provider.getBlockNumber();
            (0, chai_1.expect)(height_2).not.equal(height_1);
            {
                const receipt = await submit2Tx.wait();
                const parsedLogs = proofReceiver.interface.parseLog(receipt?.logs[0]);
                (0, chai_1.expect)(parsedLogs?.args.circuitId).eql(circuitIds[1]);
                (0, chai_1.expect)(parsedLogs?.args.proofId).eql(pid_a_c1);
                (0, chai_1.expect)(parsedLogs?.args.submissionIdx).eql(2n);
                (0, chai_1.expect)(parsedLogs?.args.proofIdx).eql(2n);
                const logProof = application_1.Proof.from_solidity(parsedLogs?.args.proof);
                (0, chai_1.expect)(JSON.stringify(logProof)).eql(JSON.stringify(pf_a));
                (0, chai_1.expect)(JSON.stringify(parsedLogs?.args.publicInputs)).eql((0, utils_1.JSONstringify)(pi_a));
            }
            // New proof idx should be 3
            (0, chai_1.expect)(await proofReceiver.nextSubmissionIdx()).eql(3n);
            // Same proof, same CID - should be rejected.  Proof idx should still be
            // 3.
            await (0, chai_1.expect)((0, saturn_1.submitProof)(proofReceiver, circuitIds[0], pf_a, pi_a)).to.be
                .reverted;
            (0, chai_1.expect)(await proofReceiver.nextSubmissionIdx()).eql(3n);
            // 2 more proofs (pf_b, pf_c) with cid[0], so we should have
            // proofIndices:
            //
            //  idx 2: pid_b
            //  idx 3: pid_c
            await (0, saturn_1.submitProof)(proofReceiver, circuitIds[0], pf_b, pi_b);
            await (0, saturn_1.submitProof)(proofReceiver, circuitIds[0], pf_c, pi_c);
            const height_3 = await hardhat_1.ethers.provider.getBlockNumber();
            (0, chai_1.expect)(height_3).greaterThan(height_2);
            // nextSubmissionIdx should now be 5
            (0, chai_1.expect)(await proofReceiver.nextSubmissionIdx()).eql(5n);
            // Verify:
            //   proof_a (cid[0])
            //   proof_a (cid[1])
            //   (skip proof_b)
            //   proof_c (cid[0])
            console.log("circuitIds[0]: " + circuitIds[0]);
            console.log("circuitIds[1]: " + circuitIds[1]);
            console.log("[pid_a_c0, pid_a_c1, pid_c_c0]: " + [pid_a_c0, pid_a_c1, pid_c_c0]);
            const vapTx = await verifier
                .connect(worker)
                .verifyAggregatedProof(dummyProofData([pid_a_c0, pid_a_c1, pid_c_c0]), [pid_a_c0, pid_a_c1, pid_c_c0], []);
            const vapReceipt = await vapTx.wait();
            console.log("verifyAggregatedProof cost (dummy verifier): " + vapReceipt?.gasUsed);
            // To recap, we submitted 3 proofs:
            //
            //   [
            //     pid_a_c0 (idx: 1), *
            //     pid_a_c1 (idx: 2), *
            //     pid_b_c0 (idx: 3), (skipped)
            //     pid_c_c0 (idx: 4), *
            //   ]
            //
            // A batch containing [pid_a_c0, pid_a_c1, pid_b_c0] was verified, so
            // only the proofs marked * should be verified.
            (0, chai_1.expect)(await verifier.nextSubmissionIdxToVerify()).equals(5n);
            (0, chai_1.expect)(await verifier.lastVerifiedSubmissionHeight()).equals(height_3);
            const [a_c0_valid, a_c1_valid, b_c0_valid, c_c0_valid] = await Promise.all([
                verifier.getFunction(saturn_1.isVerifiedSingle)(circuitIds[0], pi_a),
                verifier.getFunction(saturn_1.isVerifiedSingle)(circuitIds[1], pi_a),
                verifier.getFunction(saturn_1.isVerifiedSingle)(circuitIds[0], pi_b),
                verifier.getFunction(saturn_1.isVerifiedSingle)(circuitIds[0], pi_c),
            ]);
            (0, chai_1.expect)(a_c0_valid).is.true;
            (0, chai_1.expect)(a_c1_valid).is.true;
            (0, chai_1.expect)(b_c0_valid).is.false;
            (0, chai_1.expect)(c_c0_valid).is.true;
        });
        it("testFeeModel", async () => {
            const { saturn, owner, worker, user1 } = await (0, network_helpers_1.loadFixture)(deploySaturnDummyVerifier);
            const { proofReceiver, verifier, feeModel } = saturn;
            // We check the initial balance of the fee model contract. It
            // should be zero before accepting any proof submissions.
            const feeModelAddress = await feeModel.getAddress();
            (0, chai_1.expect)(await hardhat_1.ethers.provider.getBalance(feeModelAddress)).equals(0n);
            // Register vk
            await proofReceiver.registerVK(vk);
            const circuitIds = await proofReceiver.getCircuitIds();
            // Dummy proofs and PIs, and the corresponding proof IDs
            const pid_a_c0 = (0, utils_2.computeProofId)(circuitIds[0], pi_a);
            const pid_b_c0 = (0, utils_2.computeProofId)(circuitIds[0], pi_b);
            const pid_c_c0 = (0, utils_2.computeProofId)(circuitIds[0], pi_c);
            // fee charged per proof. When calling submitProof,
            // it's called with this value automatically
            const value = await proofReceiver.estimateFee(1);
            const options = { value };
            // When no fee is paid the submission should be rejected. This should
            // also happen when the amount paid is not enough.
            await (0, chai_1.expect)((0, saturn_1.submitProof)(proofReceiver, circuitIds[0], pf_a, pi_a, { value: 0 })).to.be.reverted;
            await (0, chai_1.expect)((0, saturn_1.submitProof)(proofReceiver, circuitIds[0], pf_a, pi_a, {
                value: value / 2n,
            })).to.be.reverted;
            await (0, chai_1.expect)((0, saturn_1.submitProof)(proofReceiver, circuitIds[0], pf_a, pi_a, {
                value: value - 1n,
            })).to.be.reverted;
            // Submit two proofs for cid[0]
            await (0, saturn_1.submitProof)(proofReceiver, circuitIds[0], pf_a, pi_a, options);
            await (0, saturn_1.submitProof)(proofReceiver, circuitIds[0], pf_b, pi_b, options);
            // After the submissions, the balance of the fee model
            // contract should equal the fee paid
            const feeModelBalance = await hardhat_1.ethers.provider.getBalance(feeModelAddress);
            (0, chai_1.expect)(feeModelBalance).equals(2n * value);
            // The total fee due should be zero because
            // it hasn't been allocated yet
            (0, chai_1.expect)(await feeModel.feeAllocated(worker)).equals(0n);
            // Now the verifier allocates the aggregator fee. The fee due must
            // now equal the balance.
            await verifier.allocateAggregatorFee();
            const feeDue = await feeModel.feeAllocated(worker);
            (0, chai_1.expect)(feeDue).equals(2n * value);
            // After allocation, we change the fixed fee to be thrice as much
            // and submit the third proof. The balance should change accordingly,
            // but not the allocated fee.
            const saturnFixedFee = typechain_types_1.SaturnFixedFee__factory.connect(feeModelAddress, owner);
            // Let's check that a user can't change the fee
            await (0, chai_1.expect)(saturnFixedFee.connect(user1).changeFee(3n * value)).to.be
                .reverted;
            // Now we change it from the owner address
            await saturnFixedFee.changeFee(3n * value);
            await (0, saturn_1.submitProof)(proofReceiver, circuitIds[0], pf_c, pi_c, {
                value: 3n * value,
            });
            const newFeeModelBalance = await hardhat_1.ethers.provider.getBalance(feeModelAddress);
            (0, chai_1.expect)(newFeeModelBalance).equals(feeModelBalance + 3n * value);
            (0, chai_1.expect)(await feeModel.feeAllocated(worker)).equals(feeDue);
            // The verifier tries to claim the fee and it fails because
            // it hasn't verified the submitted proofs yet.
            await (0, chai_1.expect)(verifier.connect(worker).claimAggregatorFee()).to.be
                .reverted;
            // Now it verifies one proof, but it still shouldn't be enough
            // to claim the allocated fee (which will be unlocked upon verifying
            // two proofs).
            await verifier
                .connect(worker)
                .verifyAggregatedProof(dummyProofData([pid_a_c0]), [pid_a_c0], []);
            await (0, chai_1.expect)(verifier.connect(worker).claimAggregatorFee()).to.be
                .reverted;
            // Now it verifies the second
            await verifier
                .connect(worker)
                .verifyAggregatedProof(dummyProofData([pid_b_c0]), [pid_b_c0], []);
            // If the worker claims it, it will succeed. Let's check the worker
            // received the funds.
            const workerBalanceBeforeClaim = await hardhat_1.ethers.provider.getBalance(worker);
            const claimTx = await verifier.connect(worker).claimAggregatorFee();
            const claimTxReceipt = await claimTx.wait();
            const claimTxCost = claimTxReceipt.gasUsed * claimTxReceipt.gasPrice;
            (0, chai_1.expect)(await hardhat_1.ethers.provider.getBalance(worker)).equals(workerBalanceBeforeClaim - claimTxCost + feeDue);
            // And that the due balance is reset to zero.
            (0, chai_1.expect)(await feeModel.feeAllocated(worker)).equals(0n);
            // but it still holds the funds corresponding to the third proof
            (0, chai_1.expect)(await hardhat_1.ethers.provider.getBalance(feeModelAddress)).equals(newFeeModelBalance - feeDue);
            // finally, we allocate funds for the third proof, verify it and claim the
            // remaining funds
            await verifier.allocateAggregatorFee();
            (0, chai_1.expect)(await feeModel.feeAllocated(worker)).equals(3n * value);
            await verifier
                .connect(worker)
                .verifyAggregatedProof(dummyProofData([pid_c_c0]), [pid_c_c0], []);
            await verifier.connect(worker).claimAggregatorFee();
            (0, chai_1.expect)(await feeModel.feeAllocated(worker)).equals(0n);
            (0, chai_1.expect)(await hardhat_1.ethers.provider.getBalance(feeModel)).equals(0n);
        });
    });
    describe("Complex Submissions", () => {
        /// Submit 3 submissions (all against cid_a):
        ///   1: [ pf_a ]
        ///   2: [ pf_b, pf_c, pf_d ]  (Merkle depth 2, not full)
        ///   3: [ pf_e, pf_f ]        (Merkle depth 2, full)
        async function makeSubmissions(saturn) {
            const { proofReceiver } = saturn;
            const [, cid_a] = await Promise.all([
                proofReceiver.registerVK(vk),
                proofReceiver.computeCircuitId(vk.solidity()),
            ]);
            // Submissions
            const submission_1 = submission_4.Submission.fromCircuitIdsProofsAndInputs([
                { circuit_id: cid_a, proof: pf_a, inputs: pi_a },
            ]);
            const submission_2 = submission_4.Submission.fromCircuitIdsProofsAndInputs([
                { circuit_id: cid_a, proof: pf_b, inputs: pi_b },
                { circuit_id: cid_a, proof: pf_c, inputs: pi_c },
                { circuit_id: cid_a, proof: pf_d, inputs: pi_d },
            ]);
            const submission_3 = submission_4.Submission.fromCircuitIdsProofsAndInputs([
                { circuit_id: cid_a, proof: pf_e, inputs: pi_e },
                { circuit_id: cid_a, proof: pf_f, inputs: pi_f },
            ]);
            return [submission_1, submission_2, submission_3, cid_a];
        }
        async function deployAndSubmit() {
            const deployResult = await deploySaturnDummyVerifier();
            const { saturn } = deployResult;
            const [s1, s2, s3, cid_a] = await makeSubmissions(saturn);
            const { proofReceiver } = saturn;
            // Submit 1
            const s1_tx = await (0, saturn_1.submitProof)(proofReceiver, s1.circuitIds[0], s1.proofs[0], s1.inputs[0]);
            // Submit 2
            const s2_tx = await (0, saturn_1.submitProofs)(proofReceiver, s2.circuitIds, s2.proofs, s2.inputs);
            // Submit 3
            const s3_tx = await (0, saturn_1.submitProofs)(proofReceiver, s3.circuitIds, s3.proofs, s3.inputs);
            return { ...deployResult, s1, s2, s3, s1_tx, s2_tx, s3_tx, cid_a };
        }
        it("submitMultipleRaw", async () => {
            const { saturn } = await (0, network_helpers_1.loadFixture)(deploySaturnDummyVerifier);
            const { proofReceiver: proofReceiver } = saturn;
            const [, , cid_a] = await Promise.all([
                proofReceiver.registerVK(vk),
                proofReceiver.registerVK(vk_invalid),
                proofReceiver.computeCircuitId(vk.solidity()),
                proofReceiver.computeCircuitId(vk_invalid.solidity()),
            ]);
            // Submit (all against cid_a):
            // 1: [ pf_a ]
            // 2: [ pf_b, pf_c, pf_d ]  (Merkle depth 2, not full)
            // 3: [ pf_e, pf_f ]        (Merkle depth 2, full)
            /* const submit_1 = */ await (0, saturn_1.submitProof)(proofReceiver, cid_a, pf_a, pi_a);
            /* const submit_2 = */ await (0, saturn_1.submitProofs)(proofReceiver, [cid_a, cid_a, cid_a], [pf_b, pf_c, pf_d], [pi_b, pi_c, pi_d]);
            /* const submit_3 = */ await (0, saturn_1.submitProofs)(proofReceiver, [cid_a, cid_a], [pf_e, pf_f], [pi_e, pi_f]);
            // Compute the expected submission indices
            const pid_a = (0, utils_2.computeProofId)(cid_a, pi_a);
            const pid_b = (0, utils_2.computeProofId)(cid_a, pi_b);
            const pid_c = (0, utils_2.computeProofId)(cid_a, pi_c);
            const pid_d = (0, utils_2.computeProofId)(cid_a, pi_d);
            const pid_e = (0, utils_2.computeProofId)(cid_a, pi_e);
            const pid_f = (0, utils_2.computeProofId)(cid_a, pi_f);
            const sid_1 = pid_a;
            const sid_2 = (0, merkleUtils_1.computeMerkleRoot)(merkleUtils_1.evmHashFn, [
                pid_b,
                pid_c,
                pid_d,
                submission_4.ZERO_BYTES32,
            ]);
            const sid_3 = (0, merkleUtils_1.computeMerkleRoot)(merkleUtils_1.evmHashFn, [pid_e, pid_f]);
            (0, chai_1.expect)(await proofReceiver.nextSubmissionIdx()).equals(4);
            (0, chai_1.expect)(await proofReceiver.getSubmissionIdx(sid_1)).equals(1);
            (0, chai_1.expect)(await proofReceiver.getSubmissionIdx(sid_2)).equals(2);
            (0, chai_1.expect)(await proofReceiver.getSubmissionIdx(sid_3)).equals(3);
            (0, chai_1.expect)(await proofReceiver.getSubmissionIdxAndNumProofs(sid_1)).eql([
                1n,
                1n,
            ]);
            (0, chai_1.expect)(await proofReceiver.getSubmissionIdxAndNumProofs(sid_2)).eql([
                2n,
                3n,
            ]);
            (0, chai_1.expect)(await proofReceiver.getSubmissionIdxAndNumProofs(sid_3)).eql([
                3n,
                2n,
            ]);
        });
        it("submissionInterface", async () => {
            const { saturn } = await (0, network_helpers_1.loadFixture)(deploySaturnDummyVerifier);
            const { proofReceiver: proofReceiver } = saturn;
            // Compute the expected submission indices
            const cid_a = await proofReceiver.computeCircuitId(vk.solidity());
            const pid_a = (0, utils_2.computeProofId)(cid_a, pi_a);
            const pid_b = (0, utils_2.computeProofId)(cid_a, pi_b);
            const pid_c = (0, utils_2.computeProofId)(cid_a, pi_c);
            const pid_d = (0, utils_2.computeProofId)(cid_a, pi_d);
            const pid_e = (0, utils_2.computeProofId)(cid_a, pi_e);
            const pid_f = (0, utils_2.computeProofId)(cid_a, pi_f);
            const [s1, s2, s3] = await makeSubmissions(saturn);
            // Check the submission structures and their methods
            (0, chai_1.expect)(s1.getProofIds()).eql([pid_a]);
            (0, chai_1.expect)(s1.getSubmissionId()).eql(pid_a);
            // Submission 1 doesn't require ProofReferences
            (0, chai_1.expect)(s1.computeProofReference(0)).is.undefined;
            // Submission 1 doesn't require a SubmissionProof
            (0, chai_1.expect)(s1.computeSubmissionProof(0, 1)).is.undefined;
            (0, chai_1.expect)(s2.getProofIds()).eql([pid_b, pid_c, pid_d]);
            (0, chai_1.expect)(s2.getSubmissionId()).eql((0, merkleUtils_1.computeMerkleRoot)(merkleUtils_1.evmHashFn, [pid_b, pid_c, pid_d, submission_4.ZERO_BYTES32]));
            // Submission 2 requires ProofReferences
            (0, chai_1.expect)(s2.computeProofReference(0)).is.not.undefined;
            (0, chai_1.expect)(s2.computeProofReference(1)).is.not.undefined;
            (0, chai_1.expect)(s2.computeProofReference(2)).is.not.undefined;
            // Submission 2 requires SubmissionProofs
            (0, chai_1.expect)(s2.computeSubmissionProof(0, 3)).is.not.undefined;
            (0, chai_1.expect)(s3.getProofIds()).eql([pid_e, pid_f]);
            (0, chai_1.expect)(s3.getSubmissionId()).eql((0, merkleUtils_1.computeMerkleRoot)(merkleUtils_1.evmHashFn, [pid_e, pid_f]));
            // Submission 3 requires ProofReferences
            (0, chai_1.expect)(s3.computeProofReference(0)).is.not.undefined;
            (0, chai_1.expect)(s3.computeProofReference(1)).is.not.undefined;
            // Submission 3 requires SubmissionProofs
            (0, chai_1.expect)(s3.computeSubmissionProof(0, 2)).is.not.undefined;
        });
        it("submitMultipleCheckReceipts", async () => {
            const { saturn, s1, s2, s3, s1_tx, s2_tx, s3_tx } = await (0, network_helpers_1.loadFixture)(deployAndSubmit);
            const { proofReceiver } = saturn;
            // Recover submissions from the tx and check they matches the original.
            const s1_chain = submission_4.Submission.fromTransactionReceipt(proofReceiver, (await s1_tx.wait()));
            (0, chai_1.expect)(s1_chain.getProofIds()).eql(s1.getProofIds());
            const s2_chain = submission_4.Submission.fromTransactionReceipt(proofReceiver, (await s2_tx.wait()));
            (0, chai_1.expect)(s2_chain.getProofIds()).eql(s2.getProofIds());
            const s3_chain = submission_4.Submission.fromTransactionReceipt(proofReceiver, (await s3_tx.wait()));
            (0, chai_1.expect)(s3_chain.getProofIds()).eql(s3.getProofIds());
        });
        it("submitMultipleAndVerifyAll", async () => {
            const { saturn, worker, s1, s2, s3, cid_a } = await (0, network_helpers_1.loadFixture)(deployAndSubmit);
            const { verifier } = saturn;
            // Submissions
            const s3_height = await hardhat_1.ethers.provider.getBlockNumber();
            // Verify submissions 1, 2, 3
            const aggBatch = Array.prototype.concat(s1.getProofIds(), s2.getProofIds(), s3.getProofIds());
            console.log("aggBatch: " + (0, utils_1.JSONstringify)(aggBatch));
            const calldata = dummyProofData(aggBatch);
            const verifyAggTx = await verifier
                .connect(worker)
                .verifyAggregatedProof(calldata, aggBatch, [
                s2.computeSubmissionProof(0, 3).solidity(),
                s3.computeSubmissionProof(0, 2).solidity(),
            ]);
            (0, chai_1.expect)(await verifier.nextSubmissionIdxToVerify()).eql(4n);
            // Check ProofVerified events emitted
            {
                const verifyAggReceipt = await verifyAggTx.wait();
                const parsedPIDs = verifyAggReceipt.logs.map((log) => {
                    return verifier.interface.parseLog(log).args
                        .proofId;
                });
                (0, chai_1.expect)(parsedPIDs).eql(aggBatch);
            }
            // Check last verified index, last verified height, etc
            (0, chai_1.expect)(await verifier.lastVerifiedSubmissionHeight()).equals(s3_height);
            // Get proof references
            const proof_ref_b = s2.computeProofReference(0);
            const proof_ref_c = s2.computeProofReference(1);
            const proof_ref_d = s2.computeProofReference(2);
            const proof_ref_e = s3.computeProofReference(0);
            const proof_ref_f = s3.computeProofReference(1);
            // Check verified status
            const isVerifiedSingleFn = verifier.getFunction(saturn_1.isVerifiedSingle);
            const isVerifiedMultiFn = verifier.getFunction(saturn_1.isVerifiedMulti);
            const a_verified = await isVerifiedSingleFn(cid_a, pi_a);
            const b_verified = await isVerifiedMultiFn(cid_a, pi_b, proof_ref_b);
            const c_verified = await isVerifiedMultiFn(cid_a, pi_c, proof_ref_c);
            const d_verified = await isVerifiedMultiFn(cid_a, pi_d, proof_ref_d);
            const e_verified = await isVerifiedMultiFn(cid_a, pi_e, proof_ref_e);
            const f_verified = await isVerifiedMultiFn(cid_a, pi_f, proof_ref_f);
            const invalid_verified = await isVerifiedMultiFn(cid_a, pi_b, proof_ref_c);
            (0, chai_1.expect)(a_verified).is.true;
            (0, chai_1.expect)(b_verified).is.true;
            (0, chai_1.expect)(c_verified).is.true;
            (0, chai_1.expect)(d_verified).is.true;
            (0, chai_1.expect)(e_verified).is.true;
            (0, chai_1.expect)(f_verified).is.true;
            (0, chai_1.expect)(invalid_verified).is.false;
        });
        it("submitMultipleAndVerifySubsetsCaseA", async () => {
            const { saturn, worker, s1, s2, s3, cid_a } = await (0, network_helpers_1.loadFixture)(deployAndSubmit);
            const { verifier } = saturn;
            // Submit 3 submissions (all against cid_a):
            //
            //   1: [ pf_a ]
            //   2: [ pf_b, pf_c, pf_d ]  (Merkle depth 2, not full)
            //   3: [ pf_e, pf_f ]        (Merkle depth 2, full)
            const [pid_a, pid_b, pid_c, pid_d] = Array.prototype.concat(s1.getProofIds(), s2.getProofIds());
            // Verify subsets:
            //
            //   agg1: [ pf_a, pf_b ]
            //   agg2: [ pf_c, pf_d ]
            const agg1 = [pid_a, pid_b];
            const calldata1 = dummyProofData(agg1);
            const pf2_1 = s2.computeSubmissionProof(0, 1); // proof for pf_b only
            await verifier
                .connect(worker)
                .verifyAggregatedProof(calldata1, agg1, [pf2_1.solidity()]);
            // Check the SaturnVerifier state.
            {
                (0, chai_1.expect)(await verifier.nextSubmissionIdxToVerify()).eql(2n);
                (0, chai_1.expect)(await verifier.getNumVerifiedForSubmissionIdx(1)).eql(1n);
                (0, chai_1.expect)(await verifier.getNumVerifiedForSubmissionIdx(2)).eql(1n);
                (0, chai_1.expect)(await verifier.getNumVerifiedForSubmissionIdx(3)).eql(0n);
            }
            const agg2 = [pid_c, pid_d];
            const calldata2 = dummyProofData(agg2);
            const pf2_2 = s2.computeSubmissionProof(1, 2); // proof for pf_c, pf_d
            await verifier
                .connect(worker)
                .verifyAggregatedProof(calldata2, agg2, [pf2_2.solidity()]);
            // Check the SaturnVerifier state.
            {
                (0, chai_1.expect)(await verifier.nextSubmissionIdxToVerify()).eql(3n);
                (0, chai_1.expect)(await verifier.getNumVerifiedForSubmissionIdx(1)).eql(1n);
                (0, chai_1.expect)(await verifier.getNumVerifiedForSubmissionIdx(2)).eql(3n);
                (0, chai_1.expect)(await verifier.getNumVerifiedForSubmissionIdx(3)).eql(0n);
            }
            // Check verified status
            const isVerifiedSingleFn = verifier.getFunction(saturn_1.isVerifiedSingle);
            const isVerifiedMultiFn = verifier.getFunction(saturn_1.isVerifiedMulti);
            const a_verified = await isVerifiedSingleFn(cid_a, pi_a);
            const b_verified = await isVerifiedMultiFn(cid_a, pi_b, s2.computeProofReference(0));
            const c_verified = await isVerifiedMultiFn(cid_a, pi_c, s2.computeProofReference(1));
            const d_verified = await isVerifiedMultiFn(cid_a, pi_d, s2.computeProofReference(2));
            const e_verified = await isVerifiedMultiFn(cid_a, pi_e, s3.computeProofReference(0));
            const f_verified = await isVerifiedMultiFn(cid_a, pi_f, s3.computeProofReference(1));
            (0, chai_1.expect)(a_verified).is.true;
            (0, chai_1.expect)(b_verified).is.true;
            (0, chai_1.expect)(c_verified).is.true;
            (0, chai_1.expect)(d_verified).is.true;
            (0, chai_1.expect)(e_verified).is.false;
            (0, chai_1.expect)(f_verified).is.false;
        });
        it("submitMultipleAndVerifySubsetsCaseB", async () => {
            const { saturn, worker, s1, s2, s3, cid_a } = await (0, network_helpers_1.loadFixture)(deployAndSubmit);
            const { verifier } = saturn;
            // Submit 3 submissions (all against cid_a):
            //
            //   1: [ pf_a ]
            //   2: [ pf_b, pf_c, pf_d ]  (Merkle depth 2, not full)
            //   3: [ pf_e, pf_f ]        (Merkle depth 2, full)
            const [pid_a, pid_b, pid_c] = Array.prototype.concat(s1.getProofIds(), s2.getProofIds());
            // Case B:
            //
            //   agg1: [ pf_a, pf_b ]
            //   agg2: [ pf_c ]
            //   agg3: [ pf_d ]
            // Submit agg1: [ pf_a, pf_b ]
            {
                const agg1 = [pid_a, pid_b];
                const calldata1 = dummyProofData(agg1);
                const pf2_1 = s2.computeSubmissionProof(0, 1); // proof for pf_b only
                await verifier
                    .connect(worker)
                    .verifyAggregatedProof(calldata1, agg1, [pf2_1.solidity()]);
            }
            // Check the SaturnVerifier state.
            {
                (0, chai_1.expect)(await verifier.nextSubmissionIdxToVerify()).eql(2n);
                (0, chai_1.expect)(await verifier.getNumVerifiedForSubmissionIdx(1)).eql(1n);
                (0, chai_1.expect)(await verifier.getNumVerifiedForSubmissionIdx(2)).eql(1n);
                (0, chai_1.expect)(await verifier.getNumVerifiedForSubmissionIdx(3)).eql(0n);
            }
            // Submit agg2: [ pf_c ]
            {
                const agg2 = [pid_c];
                const calldata2 = dummyProofData(agg2);
                const pf2_2 = s2.computeSubmissionProof(1, 1); // proof for pf_c
                await verifier
                    .connect(worker)
                    .verifyAggregatedProof(calldata2, agg2, [pf2_2.solidity()]);
            }
            // Check the SaturnVerifier state.
            {
                (0, chai_1.expect)(await verifier.nextSubmissionIdxToVerify()).eql(2n);
                (0, chai_1.expect)(await verifier.getNumVerifiedForSubmissionIdx(1)).eql(1n);
                (0, chai_1.expect)(await verifier.getNumVerifiedForSubmissionIdx(2)).eql(2n);
                (0, chai_1.expect)(await verifier.getNumVerifiedForSubmissionIdx(3)).eql(0n);
            }
            // Submit agg3: [ pf_d ]
            {
                const agg3 = [pid_c];
                const calldata3 = dummyProofData(agg3);
                const pf2_3 = s2.computeSubmissionProof(2, 1); // proof for pf_d
                await verifier
                    .connect(worker)
                    .verifyAggregatedProof(calldata3, agg3, [pf2_3.solidity()]);
            }
            // Check the SaturnVerifier state.
            {
                (0, chai_1.expect)(await verifier.nextSubmissionIdxToVerify()).eql(3n);
                (0, chai_1.expect)(await verifier.getNumVerifiedForSubmissionIdx(1)).eql(1n);
                (0, chai_1.expect)(await verifier.getNumVerifiedForSubmissionIdx(2)).eql(3n);
                (0, chai_1.expect)(await verifier.getNumVerifiedForSubmissionIdx(3)).eql(0n);
            }
            // Check verified status
            const isVerifiedSingleFn = verifier.getFunction(saturn_1.isVerifiedSingle);
            const isVerifiedMultiFn = verifier.getFunction(saturn_1.isVerifiedMulti);
            const a_verified = await isVerifiedSingleFn(cid_a, pi_a);
            const b_verified = await isVerifiedMultiFn(cid_a, pi_b, s2.computeProofReference(0));
            const c_verified = await isVerifiedMultiFn(cid_a, pi_c, s2.computeProofReference(1));
            const d_verified = await isVerifiedMultiFn(cid_a, pi_d, s2.computeProofReference(2));
            const e_verified = await isVerifiedMultiFn(cid_a, pi_e, s3.computeProofReference(0));
            const f_verified = await isVerifiedMultiFn(cid_a, pi_f, s3.computeProofReference(1));
            (0, chai_1.expect)(a_verified).is.true;
            (0, chai_1.expect)(b_verified).is.true;
            (0, chai_1.expect)(c_verified).is.true;
            (0, chai_1.expect)(d_verified).is.true;
            (0, chai_1.expect)(e_verified).is.false;
            (0, chai_1.expect)(f_verified).is.false;
        });
        it("submitMultipleAndVerifySubsetsCaseC", async () => {
            const { saturn, worker, s1, s2, s3, cid_a } = await (0, network_helpers_1.loadFixture)(deployAndSubmit);
            const { verifier } = saturn;
            // Submit 3 submissions (all against cid_a):
            //
            //   1: [ pf_a ]
            //   2: [ pf_b, pf_c, pf_d ]  (Merkle depth 2, not full)
            //   3: [ pf_e, pf_f ]        (Merkle depth 2, full)
            const [pid_a, pid_b, pid_c, pid_d, pid_e, pid_f] = Array.prototype.concat(s1.getProofIds(), s2.getProofIds(), s3.getProofIds());
            // Case C:
            //
            //   agg1: [ pf_a, pf_b ]
            //   agg2: [ pf_c, pf_d, pf_e, pf_f ]
            const agg1 = [pid_a, pid_b];
            const calldata1 = dummyProofData(agg1);
            const pf2_1 = s2.computeSubmissionProof(0, 1); // proof for pf_b only
            await verifier
                .connect(worker)
                .verifyAggregatedProof(calldata1, agg1, [pf2_1.solidity()]);
            const agg2 = [pid_c, pid_d, pid_e, pid_f];
            const calldata2 = dummyProofData(agg2);
            const pf2_2 = s2.computeSubmissionProof(1, 2); // proof for pf_c, pf_d
            const pf3_1 = s3.computeSubmissionProof(0, 2); // proof for pf_e, pf_f
            await verifier
                .connect(worker)
                .verifyAggregatedProof(calldata2, agg2, [
                pf2_2.solidity(),
                pf3_1.solidity(),
            ]);
            (0, chai_1.expect)(await verifier.nextSubmissionIdxToVerify()).eql(4n);
            // Check verified status
            const isVerifiedSingleFn = verifier.getFunction(saturn_1.isVerifiedSingle);
            const isVerifiedMultiFn = verifier.getFunction(saturn_1.isVerifiedMulti);
            const a_verified = await isVerifiedSingleFn(cid_a, pi_a);
            const b_verified = await isVerifiedMultiFn(cid_a, pi_b, s2.computeProofReference(0));
            const c_verified = await isVerifiedMultiFn(cid_a, pi_c, s2.computeProofReference(1));
            const d_verified = await isVerifiedMultiFn(cid_a, pi_d, s2.computeProofReference(2));
            const e_verified = await isVerifiedMultiFn(cid_a, pi_e, s3.computeProofReference(0));
            const f_verified = await isVerifiedMultiFn(cid_a, pi_f, s3.computeProofReference(1));
            (0, chai_1.expect)(a_verified).is.true;
            (0, chai_1.expect)(b_verified).is.true;
            (0, chai_1.expect)(c_verified).is.true;
            (0, chai_1.expect)(d_verified).is.true;
            (0, chai_1.expect)(e_verified).is.true;
            (0, chai_1.expect)(f_verified).is.true;
        });
        it("submitMultipleAndVerifySubsetsCaseD", async () => {
            const { saturn, worker, s1, s2, s3, cid_a } = await (0, network_helpers_1.loadFixture)(deployAndSubmit);
            const { verifier } = saturn;
            // Submit 3 submissions (all against cid_a):
            //
            //   1: [ pf_a ]
            //   2: [ pf_b, pf_c, pf_d ]  (Merkle depth 2, not full)
            //   3: [ pf_e, pf_f ]        (Merkle depth 2, full)
            const [pid_a, pid_e, pid_f] = Array.prototype.concat(s1.getProofIds(), s3.getProofIds());
            // Case C:
            //
            //   agg1: [ pf_a, pf_e, pf_f ] (Skip submission 2)
            const agg1 = [pid_a, pid_e, pid_f];
            const calldata1 = dummyProofData(agg1);
            const pf3_1 = s3.computeSubmissionProof(0, 2); // proof for pf_e, pf_f
            await verifier
                .connect(worker)
                .verifyAggregatedProof(calldata1, agg1, [pf3_1.solidity()]);
            (0, chai_1.expect)(await verifier.nextSubmissionIdxToVerify()).eql(4n);
            // Check verified status
            const isVerifiedSingleFn = verifier.getFunction(saturn_1.isVerifiedSingle);
            const isVerifiedMultiFn = verifier.getFunction(saturn_1.isVerifiedMulti);
            const a_verified = await isVerifiedSingleFn(cid_a, pi_a);
            const b_verified = await isVerifiedMultiFn(cid_a, pi_b, s2.computeProofReference(0));
            const c_verified = await isVerifiedMultiFn(cid_a, pi_c, s2.computeProofReference(1));
            const d_verified = await isVerifiedMultiFn(cid_a, pi_d, s2.computeProofReference(2));
            const e_verified = await isVerifiedMultiFn(cid_a, pi_e, s3.computeProofReference(0));
            const f_verified = await isVerifiedMultiFn(cid_a, pi_f, s3.computeProofReference(1));
            (0, chai_1.expect)(a_verified).is.true;
            (0, chai_1.expect)(b_verified).is.false;
            (0, chai_1.expect)(c_verified).is.false;
            (0, chai_1.expect)(d_verified).is.false;
            (0, chai_1.expect)(e_verified).is.true;
            (0, chai_1.expect)(f_verified).is.true;
        });
        it("submit and verify 32 proofs (gas costs)", async () => {
            const AGG_BATCH_SIZE = 32;
            // Submit 32 proofs as submissions of the given size.
            async function deployAndSubmit(submissionSize) {
                const { saturn, worker } = await (0, network_helpers_1.loadFixture)(deploySaturnDummyVerifier);
                const { proofReceiver } = saturn;
                const [, cid_a] = await Promise.all([
                    proofReceiver.registerVK(vk),
                    proofReceiver.computeCircuitId(vk.solidity()),
                ]);
                // Num submissions:
                const numSubmissions = (AGG_BATCH_SIZE / submissionSize) | 0;
                (0, chai_1.expect)(numSubmissions * submissionSize).eql(AGG_BATCH_SIZE);
                let proofIdx = 0;
                const submissions = [];
                for (let submissionIdx = 0; submissionIdx < numSubmissions; ++submissionIdx) {
                    // Submission of n proofs:
                    const submissionParams = [];
                    for (let i = 0; i < submissionSize; ++i) {
                        submissionParams.push({
                            circuit_id: cid_a,
                            proof: pf_a,
                            inputs: [BigInt(proofIdx++)],
                        });
                    }
                    const submission = submission_4.Submission.fromCircuitIdsProofsAndInputs(submissionParams);
                    {
                        const submitTx = await (0, saturn_1.submitProofs)(proofReceiver, submission.circuitIds, submission.proofs, submission.inputs);
                        if (submissionIdx == 0) {
                            const submitReceipt = await submitTx.wait();
                            const gasUsed = submitReceipt.gasUsed;
                            console.log(` submit(${submissionSize} pfs, 1 submission): ${gasUsed} gas`);
                        }
                    }
                    submissions.push(submission);
                }
                return { saturn, worker, submissions };
            }
            // Very 32 proofs, submitted as submission of the given size.
            async function verifySubmissions(submissionSize) {
                const { saturn, worker, submissions } = await deployAndSubmit(submissionSize);
                const { verifier } = saturn;
                const proofIds = submissions.flatMap((s) => s.getProofIds());
                const calldata = dummyProofData(proofIds);
                const submitPfs = submissions
                    .map((s) => {
                    return s.computeSubmissionProof(0, submissionSize);
                })
                    .filter((x) => x);
                const verifyTx = await verifier.connect(worker).verifyAggregatedProof(calldata, proofIds, submitPfs.map((s) => s.solidity()));
                const verifyReceipt = await verifyTx.wait();
                console.log(` verify cost (${submissionSize} proofs/submission (dummy verif))` +
                    ` = ${verifyReceipt.gasUsed} gas`);
                // isVerified
                const verifyProofIdx = 0;
                const cid = submissions[0].circuitIds[0];
                const inputs = submissions[0].inputs[0];
                const isVerifiedTx = await (() => {
                    const proofRef = submissions[0].computeProofReference(0);
                    if (proofRef) {
                        return verifier
                            .getFunction(saturn_1.isVerifiedMulti)
                            .send(cid, inputs, proofRef);
                    }
                    return verifier.getFunction(saturn_1.isVerifiedSingle).send(cid, inputs);
                })();
                const isVerifiedReceipt = await isVerifiedTx.wait();
                console.log(` isVerified(${verifyProofIdx}) (submissionSize: ${submissionSize})` +
                    ` cost = ${isVerifiedReceipt.gasUsed} gas`);
            }
            // Verify
            await verifySubmissions(1);
            await verifySubmissions(2);
            await verifySubmissions(4);
            await verifySubmissions(8);
            await verifySubmissions(16);
            await verifySubmissions(32);
        }).timeout(60000);
        it("rejects submissions with repeated submission id", async () => {
            const { saturn, s1, s2 } = await (0, network_helpers_1.loadFixture)(deployAndSubmit);
            const { proofReceiver } = saturn;
            // Submit 3 submissions (all against cid_a):
            //
            //   1: [ pf_a ]
            //   2: [ pf_b, pf_c, pf_d ]  (Merkle depth 2, not full)
            //   3: [ pf_e, pf_f ]        (Merkle depth 2, full)
            // Resubmit 1 and 2.  Both should fail.
            await (0, chai_1.expect)((0, saturn_1.submitProofs)(proofReceiver, s1.circuitIds, s1.proofs, s1.inputs)).to.be.reverted;
            await (0, chai_1.expect)((0, saturn_1.submitProofs)(proofReceiver, s2.circuitIds, s2.proofs, s2.inputs)).to.be.reverted;
        });
        it("rejects aggregated proofs with invalid final digest", async () => {
            const { saturn, worker, s1, s2 } = await (0, network_helpers_1.loadFixture)(deployAndSubmit);
            const { verifier } = saturn;
            // Submit 3 submissions (all against cid_a):
            //
            //   1: [ pf_a ]
            //   2: [ pf_b, pf_c, pf_d ]  (Merkle depth 2, not full)
            //   3: [ pf_e, pf_f ]        (Merkle depth 2, full)
            const [pid_a, pid_b, pid_c, pid_d] = Array.prototype.concat(s1.getProofIds(), s2.getProofIds());
            // Aggregate submissions 1 and 2, but use invalid final digest:
            //
            const agg1 = [pid_a, pid_b, pid_c, pid_d];
            const calldata1 = dummyProofData([pid_a, pid_b]);
            const pf2_1 = s2.computeSubmissionProof(0, 3); // proof for pf_e, pf_f
            await (0, chai_1.expect)(verifier
                .connect(worker)
                .verifyAggregatedProof(calldata1, agg1, [pf2_1.solidity()])).to.be.rejected;
        });
        it("rejects aggregated proofs with invalid merkle proofs", async () => {
            const { saturn, worker, s1, s2 } = await (0, network_helpers_1.loadFixture)(deployAndSubmit);
            const { verifier } = saturn;
            // Submit 3 submissions (all against cid_a):
            //
            //   1: [ pf_a ]
            //   2: [ pf_b, pf_c, pf_d ]  (Merkle depth 2, not full)
            //   3: [ pf_e, pf_f ]        (Merkle depth 2, full)
            const [pid_a, pid_b, pid_c] = Array.prototype.concat(s1.getProofIds(), s2.getProofIds());
            //   agg1: [ pf_a, pf_b, pf_c ]
            //         with invalid submission proof
            const agg1 = [pid_a, pid_b, pid_c];
            const calldata1 = dummyProofData(agg1);
            const pf2_1 = s2.computeSubmissionProof(0, 1); // proof for pf_b only
            await (0, chai_1.expect)(verifier
                .connect(worker)
                .verifyAggregatedProof(calldata1, agg1, [pf2_1.solidity()])).to.be.reverted;
        });
        it("rejects aggregated proofs with out-of-order proofs", async () => {
            const { saturn, worker, s1, s2 } = await (0, network_helpers_1.loadFixture)(deployAndSubmit);
            const { verifier } = saturn;
            // Submit 3 submissions (all against cid_a):
            //
            //   1: [ pf_a ]
            //   2: [ pf_b, pf_c, pf_d ]  (Merkle depth 2, not full)
            //   3: [ pf_e, pf_f ]        (Merkle depth 2, full)
            const [pid_a, pid_b, pid_c] = Array.prototype.concat(s1.getProofIds(), s2.getProofIds());
            //   agg1: [ pf_a, pf_c, pf_b ]
            //   - proofs in submission verified out of order
            const agg1 = [pid_a, pid_c, pid_b];
            const calldata1 = dummyProofData(agg1);
            const pf2_1 = s2.computeSubmissionProof(0, 2); // proof for pf_b only
            await (0, chai_1.expect)(verifier
                .connect(worker)
                .verifyAggregatedProof(calldata1, agg1, [pf2_1.solidity()])).to.be.reverted;
        });
        it("rejects aggregated proofs with missing submission proof", async () => {
            const { saturn, worker, s1, s2 } = await (0, network_helpers_1.loadFixture)(deployAndSubmit);
            const { verifier } = saturn;
            // Submit 3 submissions (all against cid_a):
            //
            //   1: [ pf_a ]
            //   2: [ pf_b, pf_c, pf_d ]  (Merkle depth 2, not full)
            //   3: [ pf_e, pf_f ]        (Merkle depth 2, full)
            const [pid_a, pid_b, pid_c] = Array.prototype.concat(s1.getProofIds(), s2.getProofIds());
            //   agg1: [ pf_a, pf_b, pf_c ]
            const agg1 = [pid_a, pid_b, pid_c];
            const calldata1 = dummyProofData(agg1);
            await (0, chai_1.expect)(verifier.connect(worker).verifyAggregatedProof(calldata1, agg1, [])).to.be.revertedWith("missing submission proof");
        });
        it("rejects aggregated proofs with out-of-order submissions", async () => {
            const { saturn, worker, s1, s2, s3 } = await (0, network_helpers_1.loadFixture)(deployAndSubmit);
            const { verifier } = saturn;
            // Submit 3 submissions (all against cid_a):
            //
            //   1: [ pf_a ]
            //   2: [ pf_b, pf_c, pf_d ]  (Merkle depth 2, not full)
            //   3: [ pf_e, pf_f ]        (Merkle depth 2, full)
            const [pid_a, pid_b, , , pid_e, pid_f] = Array.prototype.concat(s1.getProofIds(), s2.getProofIds(), s3.getProofIds());
            //   agg2: [ pf_a, pf_e, pf_f, pf_b ]
            //   - submissions out of order
            const agg1 = [pid_a, pid_e, pid_f, pid_b];
            const calldata1 = dummyProofData(agg1);
            const pf3_1 = s3.computeSubmissionProof(0, 2); // proof for pf_e, pf_f
            const pf2_1 = s2.computeSubmissionProof(0, 1); // proof for pf_b only
            await (0, chai_1.expect)(verifier
                .connect(worker)
                .verifyAggregatedProof(calldata1, agg1, [
                pf3_1.solidity(),
                pf2_1.solidity(),
            ])).to.be.reverted;
        });
        it("rejects agg proofs if a submission's proof is skipped", async () => {
            const { saturn, worker, s1, s2 } = await (0, network_helpers_1.loadFixture)(deployAndSubmit);
            const { verifier } = saturn;
            // Submit 3 submissions (all against cid_a):
            //
            //   1: [ pf_a ]
            //   2: [ pf_b, pf_c, pf_d ]  (Merkle depth 2, not full)
            const [pid_a, pid_b, pid_c] = Array.prototype.concat(s1.getProofIds(), s2.getProofIds());
            //   agg1: [ pf_a, pf_c, pf_d ]
            //   - skipped pf_b in submission 2
            const agg1 = [pid_a, pid_c, pid_b];
            const calldata1 = dummyProofData(agg1);
            const pf2_1 = s2.computeSubmissionProof(1, 2); // proof for pf_c, pf_d
            await (0, chai_1.expect)(verifier
                .connect(worker)
                .verifyAggregatedProof(calldata1, agg1, [pf2_1.solidity()])).to.be.reverted;
        });
    });
    describe("Calldata verification", () => {
        it("compute final digest", async () => {
            const { saturn } = await (0, network_helpers_1.loadFixture)(deploySaturnWithVerifier);
            const { proofReceiver: proofReceiver } = saturn;
            // Load test calldata corresponding to these pids:
            const pids = [
                "0x096b71958a31f9198721fdbae1b697a4845ea39d31cf34ea5324e716b48e765f",
                "0x096b71958a31f9198721fdbae1b697a4845ea39d31cf34ea5324e716b48e765f",
                "0x096b71958a31f9198721fdbae1b697a4845ea39d31cf34ea5324e716b48e765f",
                "0x096b71958a31f9198721fdbae1b697a4845ea39d31cf34ea5324e716b48e765f",
            ];
            const finalDigest = await proofReceiver.computeFinalDigest(pids);
            console.log("final digest = " + (0, ethers_1.hexlify)(finalDigest));
            (0, chai_1.expect)((0, ethers_1.hexlify)(finalDigest)).equals("0x956bf49add4e777484e59667915c0d584466562a63d49a5a07b6eb6c4e258c29");
        });
        it("verify calldata", async () => {
            const { saturn } = await (0, network_helpers_1.loadFixture)(deploySaturnWithVerifier);
            const { verifier: verifier } = saturn;
            const calldata = (0, fs_1.readFileSync)("test/data/outer_2_2.proof.calldata");
            // Load test calldata corresponding to these pids:
            const pids = [
                "0x096b71958a31f9198721fdbae1b697a4845ea39d31cf34ea5324e716b48e765f",
                "0x096b71958a31f9198721fdbae1b697a4845ea39d31cf34ea5324e716b48e765f",
                "0x096b71958a31f9198721fdbae1b697a4845ea39d31cf34ea5324e716b48e765f",
                "0x096b71958a31f9198721fdbae1b697a4845ea39d31cf34ea5324e716b48e765f",
            ];
            // Invalid PIDs should cause a failure
            {
                pids[3] =
                    "0x096b71958a31f9198721fdbae1b697a4845ea39d31cf34ea5324e716b48e765e";
                await (0, chai_1.expect)(verifier.verifyProofForIDs(pids, calldata)).reverted;
                pids[3] = pids[2];
            }
            // Invalid public input data should cause a failure
            {
                const x = calldata[0x19f]; // final bytes of digest_l
                calldata[0x19f] += 1;
                await (0, chai_1.expect)(verifier.verifyProofForIDs(pids, calldata)).reverted;
                calldata[0x19f] = x;
            }
            // Invalid proof data should cause an error
            {
                const offset = 0x1c0; // byte immediately after digest PI entries
                const x = calldata[offset];
                calldata[offset] += 1;
                await (0, chai_1.expect)(verifier.verifyProofForIDs(pids, calldata)).reverted;
                calldata[offset] = x;
            }
            await verifier.verifyProofForIDs(pids, calldata);
        });
    });
});
//# sourceMappingURL=saturnTests.js.map