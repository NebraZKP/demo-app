import * as ethers from "ethers";
import * as application from "./application";
import { EventSet, ProofSubmittedEvent } from "./events";
import { SaturnProofReceiver } from "../../typechain-types";
import { ProofReferenceStruct } from "../../typechain-types/ISaturnVerifier";
import { SubmissionProofStruct } from "../../typechain-types/SaturnVerifier";
import { CircuitIdProofAndInputs } from "./utils";
export declare const ZERO_BYTES32 = "0x0000000000000000000000000000000000000000000000000000000000000000";
export declare class SubmissionProof {
    submissionId: ethers.BytesLike;
    proof: ethers.BytesLike[];
    constructor(submissionId: ethers.BytesLike, proof: ethers.BytesLike[]);
    static from_json(json: string): SubmissionProof;
    solidity(): SubmissionProofStruct;
    to_json(): string;
}
export declare class ProofReference {
    submissionId: ethers.BytesLike;
    merkleProof: ethers.BytesLike[];
    location: number;
    constructor(submissionId: ethers.BytesLike, merkleProof: ethers.BytesLike[], location: number);
    static from_json(json: string): ProofReference;
    solidity(): ProofReferenceStruct;
    to_json(): string;
}
export declare class Submission {
    circuitIds: bigint[];
    proofs: application.Proof[];
    inputs: bigint[][];
    proofIds: string[];
    paddedProofIds: ethers.BytesLike[];
    depth: number;
    submissionId: ethers.BytesLike;
    private constructor();
    static fromCircuitIdsProofsAndInputs(cidProofsAndInputs: CircuitIdProofAndInputs[]): Submission;
    static fromTransactionReceipt(proofReceiver: SaturnProofReceiver, txReceipt: ethers.TransactionReceipt): Submission;
    static fromSubmittedEvents(events: EventSet<ProofSubmittedEvent.OutputObject>): Submission;
    static from_json(json: string): Submission;
    to_json(): string;
    getProofIds(startIdx?: number, numProofs?: number): string[];
    getSubmissionId(): ethers.BytesLike;
    getCircuitIdsProofsAndInputs(startIdx: number, numProofs: number): CircuitIdProofAndInputs[];
    computeProofReference(location: number): ProofReference | undefined;
    computeSubmissionProof(offset: number, numEntries: number): SubmissionProof | undefined;
}
