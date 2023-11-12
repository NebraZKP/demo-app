"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const application_1 = require("../src/sdk/application");
const submission_1 = require("../src/sdk/submission");
// Fake proofs
const pf_a = new application_1.Proof(["1", "2"], [
    ["3", "4"],
    ["5", "6"],
], ["7", "8"]);
const pf_b = new application_1.Proof(["1", "2"], [
    ["3", "4"],
    ["5", "6"],
], ["7", "9"]);
const cidsProofsAndInputs = [
    {
        circuit_id: BigInt(123),
        proof: pf_a,
        inputs: [1n, 0n, 0n],
    },
    {
        circuit_id: BigInt(234),
        proof: pf_b,
        inputs: [2n, 0n, 0n],
    },
    {
        circuit_id: BigInt(345),
        proof: pf_a,
        inputs: [3n, 0n, 0n],
    },
    {
        circuit_id: BigInt(456),
        proof: pf_b,
        inputs: [4n, 0n, 0n],
    },
];
// A fake submission
const submission = submission_1.Submission.fromCircuitIdsProofsAndInputs(cidsProofsAndInputs);
describe("Submission", () => {
    it("(de)serialize Submission", function () {
        const submissionJSON = submission.to_json();
        const submissionFromJSON = submission_1.Submission.from_json(submissionJSON);
        (0, chai_1.expect)(submissionFromJSON).eql(submission);
    });
    it("(de)serialize ProofReference", function () {
        const proofRef1 = submission.computeProofReference(1);
        const proofRef2 = submission.computeProofReference(2);
        const proofRefJSON = proofRef1.to_json();
        const proofRefFromJSON = submission_1.ProofReference.from_json(proofRefJSON);
        (0, chai_1.expect)(proofRefFromJSON).eql(proofRef1);
        (0, chai_1.expect)(proofRefFromJSON).not.eql(proofRef2);
    });
    it("(de)serialize SubmissionProof", function () {
        const submissionProof1 = submission.computeSubmissionProof(0, 1);
        const submissionProof2 = submission.computeSubmissionProof(1, 1);
        const submissionProofJSON = submissionProof1.to_json();
        const submissionProofFromJSON = submission_1.SubmissionProof.from_json(submissionProofJSON);
        (0, chai_1.expect)(submissionProofFromJSON).eql(submissionProof1);
        (0, chai_1.expect)(submissionProofFromJSON).not.eql(submissionProof2);
    });
    it("getCircuitIdsProofsAndInputs", function () {
        const returnedAll = submission.getCircuitIdsProofsAndInputs(0, submission.proofs.length);
        (0, chai_1.expect)(returnedAll).eql(cidsProofsAndInputs);
        const returned12 = submission.getCircuitIdsProofsAndInputs(1, 1);
        (0, chai_1.expect)(returned12).eql(cidsProofsAndInputs.slice(1, 2));
    });
    it("getProofIds", function () {
        const proofIds = submission.getProofIds();
        (0, chai_1.expect)(proofIds.length).equals(4);
        const proofIds_1_2 = submission.getProofIds(1, 2);
        (0, chai_1.expect)(proofIds_1_2).eql([proofIds[1], proofIds[2]]);
        const proofIds_2 = submission.getProofIds(2);
        (0, chai_1.expect)(proofIds_2).eql([proofIds[2], proofIds[3]]);
        const proofIds__2 = submission.getProofIds(undefined, 2);
        (0, chai_1.expect)(proofIds__2).eql([proofIds[0], proofIds[1]]);
    });
});
//# sourceMappingURL=submissionTest.js.map