import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, BigNumberish, AddressLike, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../common";
import type { SaturnFixedFee, SaturnFixedFeeInterface } from "../SaturnFixedFee";
type SaturnFixedFeeConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class SaturnFixedFee__factory extends ContractFactory {
    constructor(...args: SaturnFixedFeeConstructorParams);
    getDeployTransaction(_owner: AddressLike, _saturnVerifier: AddressLike, _fixedFeePerProof: BigNumberish, overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(_owner: AddressLike, _saturnVerifier: AddressLike, _fixedFeePerProof: BigNumberish, overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<SaturnFixedFee & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): SaturnFixedFee__factory;
    static readonly bytecode = "0x60803461009b57601f61065738819003918201601f19168301916001600160401b038311848410176100a05780849260609460405283398101031261009b57610047816100b6565b6040610055602084016100b6565b9201519160018060a01b03908160018060a01b03199316836000541617600055169060015416176001556002556000600355600060045560405161058c90816100cb8239f35b600080fd5b634e487b7160e01b600052604160045260246000fd5b51906001600160a01b038216820361009b5756fe6040608081526004908136101561001557600080fd5b600091823560e01c9081630f58b8a71461041f578163207bae8a146103e55781633c1a60fd1461036357816356117573146101d35781635c60d032146101aa5781636a1db1bf1461014e5781638da5cb5b14610126578163a98e11ff14610107578163ac246547146100e557508063b872b2a6146100bd5763edc70af31461009c57600080fd5b346100b957816003193601126100b9576020906002549051908152f35b5080fd5b50346100b95760203660031901126100b9576020906100da6104b9565b506003549051908152f35b90503461010357826003193601126101035760209250549051908152f35b8280fd5b5050346100b957816003193601126100b9576020906003549051908152f35b5050346100b957816003193601126100b957905490516001600160a01b039091168152602090f35b919050346101035760203660031901126101035782546001600160a01b0316330361017b57503560025580f35b906020606492519162461bcd60e51b8352820152600960248201526837b7363ca7bbb732b960b91b6044820152fd5b5050346100b957816003193601126100b95760015490516001600160a01b039091168152602090f35b919050346101035780600319360112610103576101ee6104b9565b6024919082356001600160801b0381169081900361035f5761021b60018060a01b03600154163314610514565b84541161031d5747906003548092106102e6578580809381935af13d156102e15767ffffffffffffffff3d8181116102cf57835191601f8201601f19908116603f01168301908111838210176102bd57845281528560203d92013e5b1561028457838060035580f35b606492916020601492519362461bcd60e51b8552840152820152732330b4b632b2103a379039b2b7321022ba3432b960611b6044820152fd5b634e487b7160e01b8852604187528588fd5b634e487b7160e01b8752604186528487fd5b610277565b825162461bcd60e51b815260208187015260128186015271496e73756666696369656e742066756e647360701b6044820152606490fd5b815162461bcd60e51b8152602081860152601a818501527f4e6f7420656e6f7567682070726f6f66732076657269666965640000000000006044820152606490fd5b8580fd5b83915060603660031901126100b95761037a6104b9565b506103836104d4565b5060443561ffff81168091036101035761039f906002546104eb565b34106103af575060209151908152f35b606490602084519162461bcd60e51b8352820152601060248201526f496e73756666696369656e742066656560801b6044820152fd5b90503461010357602036600319011261010357359161ffff831680930361041c57506104156020926002546104eb565b9051908152f35b80fd5b9050346101035781600319360112610103576104396104b9565b506104426104d4565b9161045860018060a01b03600154163314610514565b67ffffffffffffffff82549316928311156104765750554760035580f35b906020606492519162461bcd60e51b8352820152601e60248201527f4c6f77206c617374207375626d69747465642070726f6f6620696e64657800006044820152fd5b600435906001600160a01b03821682036104cf57565b600080fd5b6024359067ffffffffffffffff821682036104cf57565b818102929181159184041417156104fe57565b634e487b7160e01b600052601160045260246000fd5b1561051b57565b60405162461bcd60e51b81526020600482015260136024820152722737ba1029b0ba3ab937102b32b934b334b2b960691b6044820152606490fdfea264697066735822122059ff402f2073b5c572a75be8714d35096b2a49eead2e18cf74130c6da6217dab64736f6c63430008110033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_owner";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_saturnVerifier";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_fixedFeePerProof";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
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
            readonly internalType: "uint256";
            readonly name: "newFee";
            readonly type: "uint256";
        }];
        readonly name: "changeFee";
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
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "feeAllocated";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "fixedFeePerProof";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "uint64";
            readonly name: "";
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
    }, {
        readonly inputs: readonly [];
        readonly name: "owner";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "saturnVerifier";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "totalFeeDueInWei";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "verifiedProofIdxForAllocatedFee";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): SaturnFixedFeeInterface;
    static connect(address: string, runner?: ContractRunner | null): SaturnFixedFee;
}
export {};
