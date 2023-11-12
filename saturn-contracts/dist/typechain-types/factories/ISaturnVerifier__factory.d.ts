import { type ContractRunner } from "ethers";
import type { ISaturnVerifier, ISaturnVerifierInterface } from "../ISaturnVerifier";
export declare class ISaturnVerifier__factory {
    static readonly abi: readonly [{
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "bytes32";
            readonly name: "proofId";
            readonly type: "bytes32";
        }];
        readonly name: "ProofVerified";
        readonly type: "event";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "circuitId";
            readonly type: "uint256";
        }, {
            readonly components: readonly [{
                readonly internalType: "uint256[2]";
                readonly name: "pA";
                readonly type: "uint256[2]";
            }, {
                readonly internalType: "uint256[2][2]";
                readonly name: "pB";
                readonly type: "uint256[2][2]";
            }, {
                readonly internalType: "uint256[2]";
                readonly name: "pC";
                readonly type: "uint256[2]";
            }];
            readonly internalType: "struct Proof";
            readonly name: "proof";
            readonly type: "tuple";
        }, {
            readonly internalType: "uint256[]";
            readonly name: "publicInputs";
            readonly type: "uint256[]";
        }];
        readonly name: "challenge";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "challengeSuccessful";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "circuitId";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256[]";
            readonly name: "publicInputs";
            readonly type: "uint256[]";
        }];
        readonly name: "isVerified";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "circuitId";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256[]";
            readonly name: "publicInputs";
            readonly type: "uint256[]";
        }, {
            readonly components: readonly [{
                readonly internalType: "bytes32";
                readonly name: "submissionId";
                readonly type: "bytes32";
            }, {
                readonly internalType: "bytes32[]";
                readonly name: "merkleProof";
                readonly type: "bytes32[]";
            }, {
                readonly internalType: "uint16";
                readonly name: "location";
                readonly type: "uint16";
            }];
            readonly internalType: "struct ProofReference";
            readonly name: "proofReference";
            readonly type: "tuple";
        }];
        readonly name: "isVerified";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "nextSubmissionIdxToVerify";
        readonly outputs: readonly [{
            readonly internalType: "uint64";
            readonly name: "";
            readonly type: "uint64";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "proofReceiverContract";
        readonly outputs: readonly [{
            readonly internalType: "contract ISaturnProofReceiver";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): ISaturnVerifierInterface;
    static connect(address: string, runner?: ContractRunner | null): ISaturnVerifier;
}
