import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "./common";
export interface SaturnFixedFeeInterface extends Interface {
    getFunction(nameOrSignature: "allocateAggregatorFee" | "changeFee" | "claimAggregatorFee" | "estimateFee" | "feeAllocated" | "fixedFeePerProof" | "onProofSubmitted" | "owner" | "saturnVerifier" | "totalFeeDueInWei" | "verifiedProofIdxForAllocatedFee"): FunctionFragment;
    encodeFunctionData(functionFragment: "allocateAggregatorFee", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "changeFee", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "claimAggregatorFee", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "estimateFee", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "feeAllocated", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "fixedFeePerProof", values?: undefined): string;
    encodeFunctionData(functionFragment: "onProofSubmitted", values: [AddressLike, BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "saturnVerifier", values?: undefined): string;
    encodeFunctionData(functionFragment: "totalFeeDueInWei", values?: undefined): string;
    encodeFunctionData(functionFragment: "verifiedProofIdxForAllocatedFee", values?: undefined): string;
    decodeFunctionResult(functionFragment: "allocateAggregatorFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "changeFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "claimAggregatorFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "estimateFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "feeAllocated", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "fixedFeePerProof", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "onProofSubmitted", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "saturnVerifier", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "totalFeeDueInWei", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "verifiedProofIdxForAllocatedFee", data: BytesLike): Result;
}
export interface SaturnFixedFee extends BaseContract {
    connect(runner?: ContractRunner | null): SaturnFixedFee;
    waitForDeployment(): Promise<this>;
    interface: SaturnFixedFeeInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    allocateAggregatorFee: TypedContractMethod<[
        arg0: AddressLike,
        lastSubmittedProofIdx: BigNumberish
    ], [
        void
    ], "nonpayable">;
    changeFee: TypedContractMethod<[newFee: BigNumberish], [void], "nonpayable">;
    claimAggregatorFee: TypedContractMethod<[
        aggregator: AddressLike,
        lastVerifiedProofIdx: BigNumberish
    ], [
        void
    ], "nonpayable">;
    estimateFee: TypedContractMethod<[numProofs: BigNumberish], [bigint], "view">;
    feeAllocated: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    fixedFeePerProof: TypedContractMethod<[], [bigint], "view">;
    onProofSubmitted: TypedContractMethod<[
        arg0: AddressLike,
        arg1: BigNumberish,
        numProofs: BigNumberish
    ], [
        bigint
    ], "payable">;
    owner: TypedContractMethod<[], [string], "view">;
    saturnVerifier: TypedContractMethod<[], [string], "view">;
    totalFeeDueInWei: TypedContractMethod<[], [bigint], "view">;
    verifiedProofIdxForAllocatedFee: TypedContractMethod<[], [bigint], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "allocateAggregatorFee"): TypedContractMethod<[
        arg0: AddressLike,
        lastSubmittedProofIdx: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "changeFee"): TypedContractMethod<[newFee: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "claimAggregatorFee"): TypedContractMethod<[
        aggregator: AddressLike,
        lastVerifiedProofIdx: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "estimateFee"): TypedContractMethod<[numProofs: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "feeAllocated"): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "fixedFeePerProof"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "onProofSubmitted"): TypedContractMethod<[
        arg0: AddressLike,
        arg1: BigNumberish,
        numProofs: BigNumberish
    ], [
        bigint
    ], "payable">;
    getFunction(nameOrSignature: "owner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "saturnVerifier"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "totalFeeDueInWei"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "verifiedProofIdxForAllocatedFee"): TypedContractMethod<[], [bigint], "view">;
    filters: {};
}
