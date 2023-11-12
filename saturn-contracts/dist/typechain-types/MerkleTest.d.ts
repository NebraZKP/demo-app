import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "./common";
export interface MerkleTestInterface extends Interface {
    getFunction(nameOrSignature: "computeMerkleIntervalRoot" | "computeMerkleRoot" | "hash" | "merkleDepth" | "verifyMerkleProof"): FunctionFragment;
    encodeFunctionData(functionFragment: "computeMerkleIntervalRoot", values: [BigNumberish, BigNumberish, BytesLike[], BytesLike[]]): string;
    encodeFunctionData(functionFragment: "computeMerkleRoot", values: [BytesLike[]]): string;
    encodeFunctionData(functionFragment: "hash", values: [BytesLike, BytesLike]): string;
    encodeFunctionData(functionFragment: "merkleDepth", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "verifyMerkleProof", values: [BytesLike, BytesLike, BigNumberish, BigNumberish, BytesLike[]]): string;
    decodeFunctionResult(functionFragment: "computeMerkleIntervalRoot", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "computeMerkleRoot", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "hash", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "merkleDepth", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "verifyMerkleProof", data: BytesLike): Result;
}
export interface MerkleTest extends BaseContract {
    connect(runner?: ContractRunner | null): MerkleTest;
    waitForDeployment(): Promise<this>;
    interface: MerkleTestInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    computeMerkleIntervalRoot: TypedContractMethod<[
        depth: BigNumberish,
        offset: BigNumberish,
        interval: BytesLike[],
        intervalProof: BytesLike[]
    ], [
        string
    ], "view">;
    computeMerkleRoot: TypedContractMethod<[
        leaves: BytesLike[]
    ], [
        string
    ], "view">;
    hash: TypedContractMethod<[
        left: BytesLike,
        right: BytesLike
    ], [
        string
    ], "view">;
    merkleDepth: TypedContractMethod<[
        numEntries: BigNumberish
    ], [
        bigint
    ], "view">;
    verifyMerkleProof: TypedContractMethod<[
        root: BytesLike,
        value: BytesLike,
        depth: BigNumberish,
        location: BigNumberish,
        proof: BytesLike[]
    ], [
        boolean
    ], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "computeMerkleIntervalRoot"): TypedContractMethod<[
        depth: BigNumberish,
        offset: BigNumberish,
        interval: BytesLike[],
        intervalProof: BytesLike[]
    ], [
        string
    ], "view">;
    getFunction(nameOrSignature: "computeMerkleRoot"): TypedContractMethod<[leaves: BytesLike[]], [string], "view">;
    getFunction(nameOrSignature: "hash"): TypedContractMethod<[left: BytesLike, right: BytesLike], [string], "view">;
    getFunction(nameOrSignature: "merkleDepth"): TypedContractMethod<[numEntries: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "verifyMerkleProof"): TypedContractMethod<[
        root: BytesLike,
        value: BytesLike,
        depth: BigNumberish,
        location: BigNumberish,
        proof: BytesLike[]
    ], [
        boolean
    ], "view">;
    filters: {};
}
