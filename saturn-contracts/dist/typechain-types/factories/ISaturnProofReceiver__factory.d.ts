import { type ContractRunner } from "ethers";
import type { ISaturnProofReceiver, ISaturnProofReceiverInterface } from "../ISaturnProofReceiver";
export declare class ISaturnProofReceiver__factory {
    static readonly abi: readonly [{
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "uint256";
            readonly name: "circuitId";
            readonly type: "uint256";
        }, {
            readonly indexed: true;
            readonly internalType: "bytes32";
            readonly name: "proofId";
            readonly type: "bytes32";
        }, {
            readonly indexed: false;
            readonly internalType: "uint64";
            readonly name: "submissionIdx";
            readonly type: "uint64";
        }, {
            readonly indexed: false;
            readonly internalType: "uint64";
            readonly name: "proofIdx";
            readonly type: "uint64";
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
            readonly indexed: false;
            readonly internalType: "struct Proof";
            readonly name: "proof";
            readonly type: "tuple";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256[]";
            readonly name: "publicInputs";
            readonly type: "uint256[]";
        }];
        readonly name: "ProofSubmitted";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "uint256";
            readonly name: "circuitId";
            readonly type: "uint256";
        }, {
            readonly components: readonly [{
                readonly internalType: "uint256[2]";
                readonly name: "alpha";
                readonly type: "uint256[2]";
            }, {
                readonly internalType: "uint256[2][2]";
                readonly name: "beta";
                readonly type: "uint256[2][2]";
            }, {
                readonly internalType: "uint256[2][2]";
                readonly name: "gamma";
                readonly type: "uint256[2][2]";
            }, {
                readonly internalType: "uint256[2][2]";
                readonly name: "delta";
                readonly type: "uint256[2][2]";
            }, {
                readonly internalType: "uint256[2][]";
                readonly name: "s";
                readonly type: "uint256[2][]";
            }];
            readonly indexed: false;
            readonly internalType: "struct VK";
            readonly name: "vk";
            readonly type: "tuple";
        }];
        readonly name: "VKRegistered";
        readonly type: "event";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "numProofs";
            readonly type: "uint16";
        }];
        readonly name: "estimateFee";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "maxNumProofsPerSubmission";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "uint256[2]";
                readonly name: "alpha";
                readonly type: "uint256[2]";
            }, {
                readonly internalType: "uint256[2][2]";
                readonly name: "beta";
                readonly type: "uint256[2][2]";
            }, {
                readonly internalType: "uint256[2][2]";
                readonly name: "gamma";
                readonly type: "uint256[2][2]";
            }, {
                readonly internalType: "uint256[2][2]";
                readonly name: "delta";
                readonly type: "uint256[2][2]";
            }, {
                readonly internalType: "uint256[2][]";
                readonly name: "s";
                readonly type: "uint256[2][]";
            }];
            readonly internalType: "struct VK";
            readonly name: "vk";
            readonly type: "tuple";
        }];
        readonly name: "registerVK";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "circuitId";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256[]";
            readonly name: "circuitIds";
            readonly type: "uint256[]";
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
            readonly internalType: "struct Proof[]";
            readonly name: "proofs";
            readonly type: "tuple[]";
        }, {
            readonly internalType: "uint256[][]";
            readonly name: "publicInputs";
            readonly type: "uint256[][]";
        }];
        readonly name: "submit";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "submissionId";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "payable";
        readonly type: "function";
    }];
    static createInterface(): ISaturnProofReceiverInterface;
    static connect(address: string, runner?: ContractRunner | null): ISaturnProofReceiver;
}
