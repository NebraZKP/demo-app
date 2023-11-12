import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
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
export type SubmissionProofStruct = {
    submissionId: BytesLike;
    proof: BytesLike[];
};
export type SubmissionProofStructOutput = [
    submissionId: string,
    proof: string[]
] & {
    submissionId: string;
    proof: string[];
};
export interface SaturnVerifierInterface extends Interface {
    getFunction(nameOrSignature: "allocateAggregatorFee" | "challenge" | "claimAggregatorFee" | "feeModel" | "getNumVerifiedForSubmissionIdx" | "groth16Verifier" | "isVerified(uint256,uint256[])" | "isVerified(uint256,uint256[],(bytes32,bytes32[],uint16))" | "lastVerifiedSubmissionHeight" | "nextSubmissionIdxToVerify" | "outerVerifier" | "owner" | "proofReceiver" | "proofReceiverContract" | "setFeeModel" | "setWorker" | "verifyAggregatedProof" | "verifyProofForIDs" | "worker"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "ProofVerified"): EventFragment;
    encodeFunctionData(functionFragment: "allocateAggregatorFee", values?: undefined): string;
    encodeFunctionData(functionFragment: "challenge", values: [BigNumberish, ProofStruct, BigNumberish[]]): string;
    encodeFunctionData(functionFragment: "claimAggregatorFee", values?: undefined): string;
    encodeFunctionData(functionFragment: "feeModel", values?: undefined): string;
    encodeFunctionData(functionFragment: "getNumVerifiedForSubmissionIdx", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "groth16Verifier", values?: undefined): string;
    encodeFunctionData(functionFragment: "isVerified(uint256,uint256[])", values: [BigNumberish, BigNumberish[]]): string;
    encodeFunctionData(functionFragment: "isVerified(uint256,uint256[],(bytes32,bytes32[],uint16))", values: [BigNumberish, BigNumberish[], ProofReferenceStruct]): string;
    encodeFunctionData(functionFragment: "lastVerifiedSubmissionHeight", values?: undefined): string;
    encodeFunctionData(functionFragment: "nextSubmissionIdxToVerify", values?: undefined): string;
    encodeFunctionData(functionFragment: "outerVerifier", values?: undefined): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "proofReceiver", values?: undefined): string;
    encodeFunctionData(functionFragment: "proofReceiverContract", values?: undefined): string;
    encodeFunctionData(functionFragment: "setFeeModel", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "setWorker", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "verifyAggregatedProof", values: [BytesLike, BytesLike[], SubmissionProofStruct[]]): string;
    encodeFunctionData(functionFragment: "verifyProofForIDs", values: [BytesLike[], BytesLike]): string;
    encodeFunctionData(functionFragment: "worker", values?: undefined): string;
    decodeFunctionResult(functionFragment: "allocateAggregatorFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "challenge", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "claimAggregatorFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "feeModel", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getNumVerifiedForSubmissionIdx", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "groth16Verifier", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isVerified(uint256,uint256[])", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isVerified(uint256,uint256[],(bytes32,bytes32[],uint16))", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lastVerifiedSubmissionHeight", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "nextSubmissionIdxToVerify", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "outerVerifier", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "proofReceiver", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "proofReceiverContract", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setFeeModel", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setWorker", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "verifyAggregatedProof", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "verifyProofForIDs", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "worker", data: BytesLike): Result;
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
export interface SaturnVerifier extends BaseContract {
    connect(runner?: ContractRunner | null): SaturnVerifier;
    waitForDeployment(): Promise<this>;
    interface: SaturnVerifierInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    allocateAggregatorFee: TypedContractMethod<[], [void], "nonpayable">;
    challenge: TypedContractMethod<[
        circuitId: BigNumberish,
        proof: ProofStruct,
        publicInputs: BigNumberish[]
    ], [
        boolean
    ], "nonpayable">;
    claimAggregatorFee: TypedContractMethod<[], [void], "nonpayable">;
    feeModel: TypedContractMethod<[], [string], "view">;
    getNumVerifiedForSubmissionIdx: TypedContractMethod<[
        submissionIdx: BigNumberish
    ], [
        bigint
    ], "view">;
    groth16Verifier: TypedContractMethod<[], [string], "view">;
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
    lastVerifiedSubmissionHeight: TypedContractMethod<[], [bigint], "view">;
    nextSubmissionIdxToVerify: TypedContractMethod<[], [bigint], "view">;
    outerVerifier: TypedContractMethod<[], [string], "view">;
    owner: TypedContractMethod<[], [string], "view">;
    proofReceiver: TypedContractMethod<[], [string], "view">;
    proofReceiverContract: TypedContractMethod<[], [string], "view">;
    setFeeModel: TypedContractMethod<[
        _feeModel: AddressLike
    ], [
        void
    ], "nonpayable">;
    setWorker: TypedContractMethod<[_worker: AddressLike], [void], "nonpayable">;
    verifyAggregatedProof: TypedContractMethod<[
        proof: BytesLike,
        proofIds: BytesLike[],
        submissionProofs: SubmissionProofStruct[]
    ], [
        void
    ], "nonpayable">;
    verifyProofForIDs: TypedContractMethod<[
        proofIDs: BytesLike[],
        proof: BytesLike
    ], [
        void
    ], "nonpayable">;
    worker: TypedContractMethod<[], [string], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "allocateAggregatorFee"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "challenge"): TypedContractMethod<[
        circuitId: BigNumberish,
        proof: ProofStruct,
        publicInputs: BigNumberish[]
    ], [
        boolean
    ], "nonpayable">;
    getFunction(nameOrSignature: "claimAggregatorFee"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "feeModel"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "getNumVerifiedForSubmissionIdx"): TypedContractMethod<[submissionIdx: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "groth16Verifier"): TypedContractMethod<[], [string], "view">;
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
    getFunction(nameOrSignature: "lastVerifiedSubmissionHeight"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "nextSubmissionIdxToVerify"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "outerVerifier"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "owner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "proofReceiver"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "proofReceiverContract"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "setFeeModel"): TypedContractMethod<[_feeModel: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "setWorker"): TypedContractMethod<[_worker: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "verifyAggregatedProof"): TypedContractMethod<[
        proof: BytesLike,
        proofIds: BytesLike[],
        submissionProofs: SubmissionProofStruct[]
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "verifyProofForIDs"): TypedContractMethod<[
        proofIDs: BytesLike[],
        proof: BytesLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "worker"): TypedContractMethod<[], [string], "view">;
    getEvent(key: "ProofVerified"): TypedContractEvent<ProofVerifiedEvent.InputTuple, ProofVerifiedEvent.OutputTuple, ProofVerifiedEvent.OutputObject>;
    filters: {
        "ProofVerified(bytes32)": TypedContractEvent<ProofVerifiedEvent.InputTuple, ProofVerifiedEvent.OutputTuple, ProofVerifiedEvent.OutputObject>;
        ProofVerified: TypedContractEvent<ProofVerifiedEvent.InputTuple, ProofVerifiedEvent.OutputTuple, ProofVerifiedEvent.OutputObject>;
    };
}
