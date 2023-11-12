import { type ContractRunner } from "ethers";
import type { IGroth16Verifier, IGroth16VerifierInterface } from "../IGroth16Verifier";
export declare class IGroth16Verifier__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [{
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
            readonly name: "proofBytes";
            readonly type: "tuple";
        }, {
            readonly internalType: "uint256[]";
            readonly name: "publicInputs";
            readonly type: "uint256[]";
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
            readonly internalType: "struct VK";
            readonly name: "vk";
            readonly type: "tuple";
        }];
        readonly name: "verifyProof";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "success";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): IGroth16VerifierInterface;
    static connect(address: string, runner?: ContractRunner | null): IGroth16Verifier;
}
