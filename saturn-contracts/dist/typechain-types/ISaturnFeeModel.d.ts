import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "./common";
export interface ISaturnFeeModelInterface extends Interface {
    getFunction(nameOrSignature: "allocateAggregatorFee" | "claimAggregatorFee" | "estimateFee" | "feeAllocated" | "onProofSubmitted"): FunctionFragment;
    encodeFunctionData(functionFragment: "allocateAggregatorFee", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "claimAggregatorFee", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "estimateFee", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "feeAllocated", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "onProofSubmitted", values: [AddressLike, BigNumberish, BigNumberish]): string;
    decodeFunctionResult(functionFragment: "allocateAggregatorFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "claimAggregatorFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "estimateFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "feeAllocated", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "onProofSubmitted", data: BytesLike): Result;
}
export interface ISaturnFeeModel extends BaseContract {
    connect(runner?: ContractRunner | null): ISaturnFeeModel;
    waitForDeployment(): Promise<this>;
    interface: ISaturnFeeModelInterface;
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
        aggregator: AddressLike,
        lastSubmittedProofIdx: BigNumberish
    ], [
        void
    ], "nonpayable">;
    claimAggregatorFee: TypedContractMethod<[
        aggregator: AddressLike,
        lastVerifiedProofIdx: BigNumberish
    ], [
        void
    ], "nonpayable">;
    estimateFee: TypedContractMethod<[numProofs: BigNumberish], [bigint], "view">;
    feeAllocated: TypedContractMethod<[
        aggregator: AddressLike
    ], [
        bigint
    ], "view">;
    onProofSubmitted: TypedContractMethod<[
        submitter: AddressLike,
        submissionIdx: BigNumberish,
        numProofs: BigNumberish
    ], [
        bigint
    ], "payable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "allocateAggregatorFee"): TypedContractMethod<[
        aggregator: AddressLike,
        lastSubmittedProofIdx: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "claimAggregatorFee"): TypedContractMethod<[
        aggregator: AddressLike,
        lastVerifiedProofIdx: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "estimateFee"): TypedContractMethod<[numProofs: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "feeAllocated"): TypedContractMethod<[aggregator: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "onProofSubmitted"): TypedContractMethod<[
        submitter: AddressLike,
        submissionIdx: BigNumberish,
        numProofs: BigNumberish
    ], [
        bigint
    ], "payable">;
    filters: {};
}
