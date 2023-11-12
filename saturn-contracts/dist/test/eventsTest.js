"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../src/sdk/utils");
const application_1 = require("../src/sdk/application");
const utils = __importStar(require("../src/sdk/utils"));
const saturnTests_1 = require("./saturnTests");
const hardhat_1 = require("hardhat");
const network_helpers_1 = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const chai_1 = require("chai");
const events_1 = require("../src/sdk/events");
const saturn_1 = require("../src/sdk/saturn");
const submission_1 = require("../src/sdk/submission");
describe("EventGetter for events", () => {
    // Dummy proofs and PIs
    const pf_a = new application_1.Proof(["1", "2"], [
        ["3", "4"],
        ["5", "6"],
    ], ["7", "8"]);
    const pi_a = [1n, 0n, 0n];
    const pi_b = [2n, 0n, 0n];
    const pi_c = [3n, 0n, 0n];
    const pi_d = [4n, 0n, 0n];
    const pi_e = [5n, 0n, 0n];
    const pi_f = [6n, 0n, 0n];
    // Submissions:
    //   1: [ A, B ],
    //   2: [ C ],
    //   3: [ D, E, F]
    //
    // Verify:
    //   1: [ A ],
    //   2: [ B, C, D ],
    //   3: [ E, F ],
    const deploySubmitVerify = async () => {
        const { saturn, worker } = await (0, network_helpers_1.loadFixture)(saturnTests_1.deploySaturnDummyVerifier);
        const { proofReceiver, verifier } = saturn;
        const vk = (0, utils_1.loadAppVK)("../circuits/src/tests/data/vk.json");
        await proofReceiver.registerVK(vk);
        const [cid] = await proofReceiver.getCircuitIds();
        const pid_a = utils.computeProofId(cid, pi_a);
        const pid_b = utils.computeProofId(cid, pi_b);
        const pid_c = utils.computeProofId(cid, pi_c);
        const pid_d = utils.computeProofId(cid, pi_d);
        const pid_e = utils.computeProofId(cid, pi_e);
        const pid_f = utils.computeProofId(cid, pi_f);
        const startHeight = await hardhat_1.ethers.provider.getBlockNumber();
        // Submissions:
        //   1: [ A, B ],
        //   2: [ C ],
        //   3: [ D, E, F]
        const sub_1 = submission_1.Submission.fromCircuitIdsProofsAndInputs([
            { circuit_id: cid, proof: pf_a, inputs: pi_a },
            { circuit_id: cid, proof: pf_a, inputs: pi_b },
        ]);
        const sub1TxHash = await (async () => {
            const s1Tx = await (0, saturn_1.submitProofs)(proofReceiver, sub_1.circuitIds, sub_1.proofs, sub_1.inputs);
            return s1Tx.hash;
        })();
        const sub_2 = submission_1.Submission.fromCircuitIdsProofsAndInputs([
            { circuit_id: cid, proof: pf_a, inputs: pi_c },
        ]);
        const sub2TxHash = await (async () => {
            const s2Tx = await (0, saturn_1.submitProofs)(proofReceiver, sub_2.circuitIds, sub_2.proofs, sub_2.inputs);
            return s2Tx.hash;
        })();
        const sub_3 = submission_1.Submission.fromCircuitIdsProofsAndInputs([
            { circuit_id: cid, proof: pf_a, inputs: pi_d },
            { circuit_id: cid, proof: pf_a, inputs: pi_e },
            { circuit_id: cid, proof: pf_a, inputs: pi_f },
        ]);
        const sub3TxHash = await (async () => {
            const s3Tx = await (0, saturn_1.submitProofs)(proofReceiver, sub_3.circuitIds, sub_3.proofs, sub_3.inputs);
            return s3Tx.hash;
        })();
        // Verify:
        //   1: [ A ],
        //   2: [ B, C, D ],
        //   3: [ E, F ],
        const agg1TxHash = await (async () => {
            const proofIds = [pid_a];
            const agg1Tx = await verifier
                .connect(worker)
                .verifyAggregatedProof((0, saturnTests_1.dummyProofData)(proofIds), proofIds, [
                sub_1.computeSubmissionProof(0, 1).solidity(),
            ]);
            return agg1Tx.hash;
        })();
        const agg2TxHash = await (async () => {
            const proofIds = [pid_b, pid_c, pid_d];
            const agg2Tx = await verifier
                .connect(worker)
                .verifyAggregatedProof((0, saturnTests_1.dummyProofData)(proofIds), proofIds, [
                sub_1.computeSubmissionProof(1, 1).solidity(),
                sub_3.computeSubmissionProof(0, 1).solidity(),
            ]);
            return agg2Tx.hash;
        })();
        const agg3TxHash = await (async () => {
            const proofIds = [pid_e, pid_f];
            const agg3Tx = await verifier
                .connect(worker)
                .verifyAggregatedProof((0, saturnTests_1.dummyProofData)(proofIds), proofIds, [
                sub_3.computeSubmissionProof(1, 2).solidity(),
            ]);
            return agg3Tx.hash;
        })();
        return {
            saturn,
            startHeight,
            pid_a,
            pid_b,
            pid_c,
            pid_d,
            pid_e,
            pid_f,
            sub1TxHash,
            sub2TxHash,
            sub3TxHash,
            agg1TxHash,
            agg2TxHash,
            agg3TxHash,
        };
    };
    it("should find all events group them by tx", async function () {
        const { saturn, startHeight, pid_a, pid_b, pid_c, pid_d, pid_e, pid_f, sub1TxHash, sub2TxHash, sub3TxHash, agg1TxHash, agg2TxHash, agg3TxHash, } = await (0, network_helpers_1.loadFixture)(deploySubmitVerify);
        const curHeight = await hardhat_1.ethers.provider.getBlockNumber();
        const submittedEventGetter = new events_1.ProofSubmittedEventGetter(saturn.proofReceiver);
        const verifiedEventGetter = new events_1.ProofVerifiedEventGetter(saturn.verifier);
        const groupedSubmittedEvents = await submittedEventGetter.getFullGroupedByTransaction(startHeight, curHeight);
        const groupedVerifiedEvents = await verifiedEventGetter.getFullGroupedByTransaction(startHeight, curHeight);
        // 3 groups, of the correct sizes
        // Submissions:
        //   1: [ A, B ],
        //   2: [ C ],
        //   3: [ D, E, F]
        (0, chai_1.expect)(groupedSubmittedEvents.length).equal(3);
        // proof ids are as expected
        (0, chai_1.expect)(groupedSubmittedEvents[0].events.map((ev) => ev.proofId)).eql([
            pid_a,
            pid_b,
        ]);
        (0, chai_1.expect)(groupedSubmittedEvents[1].events.map((ev) => ev.proofId)).eql([
            pid_c,
        ]);
        (0, chai_1.expect)(groupedSubmittedEvents[2].events.map((ev) => ev.proofId)).eql([
            pid_d,
            pid_e,
            pid_f,
        ]);
        (0, chai_1.expect)(groupedSubmittedEvents[0].txHash).eql(sub1TxHash);
        (0, chai_1.expect)(groupedSubmittedEvents[1].txHash).eql(sub2TxHash);
        (0, chai_1.expect)(groupedSubmittedEvents[2].txHash).eql(sub3TxHash);
        // Verify:
        //   1: [ A ],
        //   2: [ B, C, D ],
        //   3: [ E, F ],
        (0, chai_1.expect)(groupedVerifiedEvents.length).equal(3);
        // proofIds are as expected
        (0, chai_1.expect)(groupedVerifiedEvents[0].events.map((ev) => ev.proofId)).eql([
            pid_a,
        ]);
        (0, chai_1.expect)(groupedVerifiedEvents[1].events.map((ev) => ev.proofId)).eql([
            pid_b,
            pid_c,
            pid_d,
        ]);
        (0, chai_1.expect)(groupedVerifiedEvents[2].events.map((ev) => ev.proofId)).eql([
            pid_e,
            pid_f,
        ]);
        // tx hashes are grouped as expected
        (0, chai_1.expect)(groupedVerifiedEvents[0].txHash).eql(agg1TxHash);
        (0, chai_1.expect)(groupedVerifiedEvents[1].txHash).eql(agg2TxHash);
        (0, chai_1.expect)(groupedVerifiedEvents[2].txHash).eql(agg3TxHash);
    });
    it("should support event filtering", async function () {
        const { saturn, startHeight, pid_b, pid_e, sub1TxHash, agg3TxHash } = await (0, network_helpers_1.loadFixture)(deploySubmitVerify);
        const curHeight = await hardhat_1.ethers.provider.getBlockNumber();
        const submittedEventGetter = new events_1.ProofSubmittedEventGetter(saturn.proofReceiver, undefined /* circuitId */, pid_b /* proofId */);
        const verifiedEventGetter = new events_1.ProofVerifiedEventGetter(saturn.verifier, pid_e /* proofId */);
        const submittedEvents = await submittedEventGetter.getFull(startHeight, curHeight);
        const verifiedEvents = await verifiedEventGetter.getFull(startHeight, curHeight);
        // Submissions:
        //   1: [ A, *B ],
        //   2: [ C ],
        //   3: [ D, E, F]
        //
        // *- expect to only see this
        (0, chai_1.expect)(submittedEvents.length).equal(1);
        (0, chai_1.expect)(submittedEvents[0].txHash).eql(sub1TxHash);
        (0, chai_1.expect)(submittedEvents[0].event.proofId).eql(pid_b);
        // Verify:
        //   1: [ A ],
        //   2: [ B, C, D ],
        //   3: [ *E, F ],
        //
        // *- expect to only see this
        (0, chai_1.expect)(verifiedEvents.length).equal(1);
        (0, chai_1.expect)(verifiedEvents[0].txHash).eql(agg3TxHash);
        (0, chai_1.expect)(verifiedEvents[0].event.proofId).eql(pid_e);
    });
});
//# sourceMappingURL=eventsTest.js.map