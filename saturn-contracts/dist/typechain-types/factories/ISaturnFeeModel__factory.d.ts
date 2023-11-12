import { type ContractRunner } from "ethers";
import type { ISaturnFeeModel, ISaturnFeeModelInterface } from "../ISaturnFeeModel";
export declare class ISaturnFeeModel__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "aggregator";
            readonly type: "address";
        }, {
            readonly internalType: "uint64";
            readonly name: "lastSubmittedProofIdx";
            readonly type: "uint64";
        }];
        readonly name: "allocateAggregatorFee";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "aggregator";
            readonly type: "address";
        }, {
            readonly internalType: "uint128";
            readonly name: "lastVerifiedProofIdx";
            readonly type: "uint128";
        }];
        readonly name: "claimAggregatorFee";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "numProofs";
            readonly type: "uint16";
        }];
        readonly name: "estimateFee";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "feeWei";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "aggregator";
            readonly type: "address";
        }];
        readonly name: "feeAllocated";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "feeDue";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "submitter";
            readonly type: "address";
        }, {
            readonly internalType: "uint64";
            readonly name: "submissionIdx";
            readonly type: "uint64";
        }, {
            readonly internalType: "uint16";
            readonly name: "numProofs";
            readonly type: "uint16";
        }];
        readonly name: "onProofSubmitted";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "refundWei";
            readonly type: "uint256";
        }];
        readonly stateMutability: "payable";
        readonly type: "function";
    }];
    static createInterface(): ISaturnFeeModelInterface;
    static connect(address: string, runner?: ContractRunner | null): ISaturnFeeModel;
}
