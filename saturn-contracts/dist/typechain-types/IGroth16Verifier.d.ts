import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "./common";
export type ProofStruct = {
    pA: [BigNumberish, BigNumberish];
    pB: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]];
    pC: [BigNumberish, BigNumberish];
};
export type ProofStructOutput = [
    pA: [bigint, bigint],
    pB: [[bigint, bigint], [bigint, bigint]],
    pC: [bigint, bigint]
] & {
    pA: [bigint, bigint];
    pB: [[bigint, bigint], [bigint, bigint]];
    pC: [bigint, bigint];
};
export type VKStruct = {
    alpha: [BigNumberish, BigNumberish];
    beta: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]];
    gamma: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]];
    delta: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]];
    s: [BigNumberish, BigNumberish][];
};
export type VKStructOutput = [
    alpha: [bigint, bigint],
    beta: [[bigint, bigint], [bigint, bigint]],
    gamma: [[bigint, bigint], [bigint, bigint]],
    delta: [[bigint, bigint], [bigint, bigint]],
    s: [bigint, bigint][]
] & {
    alpha: [bigint, bigint];
    beta: [[bigint, bigint], [bigint, bigint]];
    gamma: [[bigint, bigint], [bigint, bigint]];
    delta: [[bigint, bigint], [bigint, bigint]];
    s: [bigint, bigint][];
};
export interface IGroth16VerifierInterface extends Interface {
    getFunction(nameOrSignature: "verifyProof"): FunctionFragment;
    encodeFunctionData(functionFragment: "verifyProof", values: [ProofStruct, BigNumberish[], VKStruct]): string;
    decodeFunctionResult(functionFragment: "verifyProof", data: BytesLike): Result;
}
export interface IGroth16Verifier extends BaseContract {
    connect(runner?: ContractRunner | null): IGroth16Verifier;
    waitForDeployment(): Promise<this>;
    interface: IGroth16VerifierInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    verifyProof: TypedContractMethod<[
        proofBytes: ProofStruct,
        publicInputs: BigNumberish[],
        vk: VKStruct
    ], [
        boolean
    ], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "verifyProof"): TypedContractMethod<[
        proofBytes: ProofStruct,
        publicInputs: BigNumberish[],
        vk: VKStruct
    ], [
        boolean
    ], "view">;
    filters: {};
}
