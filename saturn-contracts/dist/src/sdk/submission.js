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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Submission = exports.ProofReference = exports.SubmissionProof = exports.ZERO_BYTES32 = void 0;
const application = __importStar(require("./application"));
const merkleUtils_1 = require("./merkleUtils");
const utils_1 = require("./utils");
const assert_1 = __importDefault(require("assert"));
exports.ZERO_BYTES32 = "0x0000000000000000000000000000000000000000000000000000000000000000";
/// The proof that a given sequence of proofIds belong to an existing
/// submission.  This is intended to be sent to the SaturnVerifier alongside
/// aggregated proofs.  See the solidity definition of SubmissionProof for
/// details.
class SubmissionProof {
    constructor(submissionId, proof) {
        this.submissionId = submissionId;
        this.proof = proof;
    }
    static from_json(json) {
        const object = JSON.parse(json);
        return new SubmissionProof(object.submissionId, object.proof);
    }
    solidity() {
        return this;
    }
    to_json() {
        return (0, utils_1.JSONstringify)(this);
    }
}
exports.SubmissionProof = SubmissionProof;
class ProofReference {
    constructor(submissionId, merkleProof, location) {
        this.submissionId = submissionId;
        this.merkleProof = merkleProof;
        this.location = location;
    }
    static from_json(json) {
        const object = JSON.parse(json);
        return new ProofReference(object.submissionId, object.merkleProof, object.location);
    }
    solidity() {
        return this;
    }
    to_json() {
        return (0, utils_1.JSONstringify)(this);
    }
}
exports.ProofReference = ProofReference;
class Submission {
    constructor(proofIds, circuitIds, proofs, inputs) {
        (0, assert_1.default)(proofIds.length > 0);
        (0, assert_1.default)(proofIds.length === circuitIds.length);
        (0, assert_1.default)(proofIds.length === proofs.length);
        (0, assert_1.default)(proofIds.length === inputs.length);
        const depth = Math.ceil(Math.log2(proofIds.length));
        const paddedLength = 1 << depth;
        const paddedProofIds = proofIds.slice();
        while (paddedProofIds.length < paddedLength) {
            paddedProofIds.push(exports.ZERO_BYTES32);
        }
        proofIds.forEach((pid) => (0, assert_1.default)(typeof pid === "string"));
        this.circuitIds = circuitIds;
        this.proofs = proofs;
        this.inputs = inputs;
        this.proofIds = proofIds;
        this.paddedProofIds = paddedProofIds;
        this.depth = depth;
        this.submissionId = (0, merkleUtils_1.computeMerkleRoot)(merkleUtils_1.evmHashFn, paddedProofIds);
    }
    static fromCircuitIdsProofsAndInputs(cidProofsAndInputs) {
        const circuitIds = [];
        const proofs = [];
        const inputs = [];
        const proofIds = [];
        cidProofsAndInputs.forEach((cpi) => {
            circuitIds.push(cpi.circuit_id);
            proofs.push(cpi.proof);
            inputs.push(cpi.inputs);
            proofIds.push((0, utils_1.computeProofId)(cpi.circuit_id, cpi.inputs));
        });
        return new Submission(proofIds, circuitIds, proofs, inputs);
    }
    static fromTransactionReceipt(proofReceiver, txReceipt) {
        const circuitIds = [];
        const proofs = [];
        const inputs = [];
        const proofIds = [];
        txReceipt.logs.forEach((log) => {
            const parsed = proofReceiver.interface.parseLog(log);
            if (parsed) {
                circuitIds.push(parsed.args.circuitId);
                proofs.push(application.Proof.from_solidity(parsed.args.proof));
                inputs.push([...parsed.args.publicInputs]);
                proofIds.push(parsed.args.proofId);
            }
        });
        return new Submission(proofIds, circuitIds, proofs, inputs);
    }
    static fromSubmittedEvents(events) {
        const submission = Submission.fromCircuitIdsProofsAndInputs(events.events.map((ev) => {
            return {
                circuit_id: ev.circuitId,
                proof: application.Proof.from_solidity(ev.proof),
                inputs: ev.publicInputs,
            };
        }));
        // TODO: check the proofIds in the events against the computed version.
        return submission;
    }
    static from_json(json) {
        const object = JSON.parse(json);
        const circuitIds = object.circuitIds.map((x) => BigInt(x));
        const proofs = object.proofs.map(application.Proof.from_json);
        const inputs = object.inputs.map((instance) => instance.map((x) => BigInt(x)));
        const proofIds = object.proofIds;
        return new Submission(proofIds, circuitIds, proofs, inputs);
    }
    to_json() {
        return (0, utils_1.JSONstringify)(this);
    }
    getProofIds(startIdx, numProofs) {
        if (startIdx || numProofs) {
            startIdx = startIdx || 0;
            const endIdx = numProofs ? startIdx + numProofs : this.proofs.length;
            (0, assert_1.default)(endIdx <= this.proofIds.length);
            return this.proofIds.slice(startIdx, endIdx);
        }
        return this.proofIds;
    }
    getSubmissionId() {
        return this.submissionId;
    }
    /// Extract a sub-interval of the CircuitIdProofAndInputs structures.  Used
    /// primarily by off-chain aggregators to form inner proof batches.
    getCircuitIdsProofsAndInputs(startIdx, numProofs) {
        const cpis = [];
        const endIdx = startIdx + numProofs;
        (0, assert_1.default)(endIdx <= this.proofs.length);
        for (let i = startIdx; i < endIdx; ++i) {
            cpis.push({
                circuit_id: this.circuitIds[i],
                proof: this.proofs[i],
                inputs: this.inputs[i],
            });
        }
        return cpis;
    }
    /// Return a reference to a proof in this submission.  `undefined` if a
    /// reference is not required (single-entry submissions).
    computeProofReference(location) {
        if (this.proofIds.length === 1) {
            return undefined;
        }
        const { root, proof } = (0, merkleUtils_1.computeMerkleProof)(merkleUtils_1.evmHashFn, this.paddedProofIds, location);
        return new ProofReference(root, proof, location);
    }
    /// Returns a Submission proof for the given slice of proofs.  `undefined`
    /// if not required (single-entry submission).
    computeSubmissionProof(offset, numEntries) {
        (0, assert_1.default)(0 <= offset);
        (0, assert_1.default)(offset < this.proofIds.length);
        (0, assert_1.default)(0 < numEntries);
        (0, assert_1.default)(offset + numEntries <= this.proofIds.length);
        // If the submission has a single proof, we don't need a proof.
        if (this.proofIds.length == 1) {
            return undefined;
        }
        // Compute the interval proof for the range of entries.
        const { proof, root } = (0, merkleUtils_1.createMerkleIntervalProof)(merkleUtils_1.evmHashFn, this.paddedProofIds, offset, numEntries);
        return new SubmissionProof(root, proof);
    }
}
exports.Submission = Submission;
//# sourceMappingURL=submission.js.map