import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "./common";
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
export type ProofReferenceStruct = {
    submissionId: BytesLike;
    merkleProof: BytesLike[];
    location: BigNumberish;
};
export type ProofReferenceStructOutput = [
    submissionId: string,
    merkleProof: string[],
    location: bigint
] & {
    submissionId: string;
    merkleProof: string[];
    location: bigint;
};
export interface ISaturnVerifierInterface extends Interface {
    getFunction(nameOrSignature: "challenge" | "isVerified(uint256,uint256[])" | "isVerified(uint256,uint256[],(bytes32,bytes32[],uint16))" | "nextSubmissionIdxToVerify" | "proofReceiverContract"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "ProofVerified"): EventFragment;
    encodeFunctionData(functionFragment: "challenge", values: [BigNumberish, ProofStruct, BigNumberish[]]): string;
    encodeFunctionData(functionFragment: "isVerified(uint256,uint256[])", values: [BigNumberish, BigNumberish[]]): string;
    encodeFunctionData(functionFragment: "isVerified(uint256,uint256[],(bytes32,bytes32[],uint16))", values: [BigNumberish, BigNumberish[], ProofReferenceStruct]): string;
    encodeFunctionData(functionFragment: "nextSubmissionIdxToVerify", values?: undefined): string;
    encodeFunctionData(functionFragment: "proofReceiverContract", values?: undefined): string;
    decodeFunctionResult(functionFragment: "challenge", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isVerified(uint256,uint256[])", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isVerified(uint256,uint256[],(bytes32,bytes32[],uint16))", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "nextSubmissionIdxToVerify", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "proofReceiverContract", data: BytesLike): Result;
}
export declare namespace ProofVerifiedEvent {
    type InputTuple = [proofId: BytesLike];
    type OutputTuple = [proofId: string];
    interface OutputObject {
        proofId: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface ISaturnVerifier extends BaseContract {
    connect(runner?: ContractRunner | null): ISaturnVerifier;
    waitForDeployment(): Promise<this>;
    interface: ISaturnVerifierInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    challenge: TypedContractMethod<[
        circuitId: BigNumberish,
        proof: ProofStruct,
        publicInputs: BigNumberish[]
    ], [
        boolean
    ], "nonpayable">;
    "isVerified(uint256,uint256[])": TypedContractMethod<[
        circuitId: BigNumberish,
        publicInputs: BigNumberish[]
    ], [
        boolean
    ], "view">;
    "isVerified(uint256,uint256[],(bytes32,bytes32[],uint16))": TypedContractMethod<[
        circuitId: BigNumberish,
        publicInputs: BigNumberish[],
        proofReference: ProofReferenceStruct
    ], [
        boolean
    ], "view">;
    nextSubmissionIdxToVerify: TypedContractMethod<[], [bigint], "view">;
    proofReceiverContract: TypedContractMethod<[], [string], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "challenge"): TypedContractMethod<[
        circuitId: BigNumberish,
        proof: ProofStruct,
        publicInputs: BigNumberish[]
    ], [
        boolean
    ], "nonpayable">;
    getFunction(nameOrSignature: "isVerified(uint256,uint256[])"): TypedContractMethod<[
        circuitId: BigNumberish,
        publicInputs: BigNumberish[]
    ], [
        boolean
    ], "view">;
    getFunction(nameOrSignature: "isVerified(uint256,uint256[],(bytes32,bytes32[],uint16))"): TypedContractMethod<[
        circuitId: BigNumberish,
        publicInputs: BigNumberish[],
        proofReference: ProofReferenceStruct
    ], [
        boolean
    ], "view">;
    getFunction(nameOrSignature: "nextSubmissionIdxToVerify"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "proofReceiverContract"): TypedContractMethod<[], [string], "view">;
    getEvent(key: "ProofVerified"): TypedContractEvent<ProofVerifiedEvent.InputTuple, ProofVerifiedEvent.OutputTuple, ProofVerifiedEvent.OutputObject>;
    filters: {
        "ProofVerified(bytes32)": TypedContractEvent<ProofVerifiedEvent.InputTuple, ProofVerifiedEvent.OutputTuple, ProofVerifiedEvent.OutputObject>;
        ProofVerified: TypedContractEvent<ProofVerifiedEvent.InputTuple, ProofVerifiedEvent.OutputTuple, ProofVerifiedEvent.OutputObject>;
    };
}
