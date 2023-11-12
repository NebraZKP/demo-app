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
export declare namespace SaturnProofReceiver {
    type SubmissionStruct = {
        proofDigestRoot: BytesLike;
        submissionIdx: BigNumberish;
        submissionBlockNumber: BigNumberish;
        numProofs: BigNumberish;
        merkleDepth: BigNumberish;
    };
    type SubmissionStructOutput = [
        proofDigestRoot: string,
        submissionIdx: bigint,
        submissionBlockNumber: bigint,
        numProofs: bigint,
        merkleDepth: bigint
    ] & {
        proofDigestRoot: string;
        submissionIdx: bigint;
        submissionBlockNumber: bigint;
        numProofs: bigint;
        merkleDepth: bigint;
    };
}
export interface SaturnProofReceiverInterface extends Interface {
    getFunction(nameOrSignature: "MAX_NUM_PROOFS_PER_SUBMISSION" | "MAX_SUBMISSION_MERKLE_DEPTH" | "_circuitData" | "_circuitIds" | "_feeModel" | "_nextProofIdx" | "_nextSubmissionIdx" | "_owner" | "_submissions" | "computeCircuitId" | "computeFinalDigest" | "computeProofId" | "decomposeFq" | "digestAsFieldElements" | "estimateFee" | "getCircuitIds" | "getSubmission" | "getSubmissionIdx" | "getSubmissionIdxAndHeight" | "getSubmissionIdxAndNumProofs" | "getSubmissionIdxHeightNumProofsDepth" | "getSubmissionIdxNumProofsDepth" | "getVK" | "maxNumProofsPerSubmission" | "nextSubmissionIdx" | "registerVK" | "setFeeModel" | "submit"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "ProofSubmitted" | "VKRegistered"): EventFragment;
    encodeFunctionData(functionFragment: "MAX_NUM_PROOFS_PER_SUBMISSION", values?: undefined): string;
    encodeFunctionData(functionFragment: "MAX_SUBMISSION_MERKLE_DEPTH", values?: undefined): string;
    encodeFunctionData(functionFragment: "_circuitData", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "_circuitIds", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "_feeModel", values?: undefined): string;
    encodeFunctionData(functionFragment: "_nextProofIdx", values?: undefined): string;
    encodeFunctionData(functionFragment: "_nextSubmissionIdx", values?: undefined): string;
    encodeFunctionData(functionFragment: "_owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "_submissions", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "computeCircuitId", values: [VKStruct]): string;
    encodeFunctionData(functionFragment: "computeFinalDigest", values: [BytesLike[]]): string;
    encodeFunctionData(functionFragment: "computeProofId", values: [BigNumberish, BigNumberish[]]): string;
    encodeFunctionData(functionFragment: "decomposeFq", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "digestAsFieldElements", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "estimateFee", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "getCircuitIds", values?: undefined): string;
    encodeFunctionData(functionFragment: "getSubmission", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "getSubmissionIdx", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "getSubmissionIdxAndHeight", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "getSubmissionIdxAndNumProofs", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "getSubmissionIdxHeightNumProofsDepth", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "getSubmissionIdxNumProofsDepth", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "getVK", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "maxNumProofsPerSubmission", values?: undefined): string;
    encodeFunctionData(functionFragment: "nextSubmissionIdx", values?: undefined): string;
    encodeFunctionData(functionFragment: "registerVK", values: [VKStruct]): string;
    encodeFunctionData(functionFragment: "setFeeModel", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "submit", values: [BigNumberish[], ProofStruct[], BigNumberish[][]]): string;
    decodeFunctionResult(functionFragment: "MAX_NUM_PROOFS_PER_SUBMISSION", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "MAX_SUBMISSION_MERKLE_DEPTH", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "_circuitData", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "_circuitIds", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "_feeModel", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "_nextProofIdx", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "_nextSubmissionIdx", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "_owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "_submissions", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "computeCircuitId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "computeFinalDigest", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "computeProofId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "decomposeFq", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "digestAsFieldElements", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "estimateFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getCircuitIds", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getSubmission", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getSubmissionIdx", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getSubmissionIdxAndHeight", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getSubmissionIdxAndNumProofs", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getSubmissionIdxHeightNumProofsDepth", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getSubmissionIdxNumProofsDepth", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getVK", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "maxNumProofsPerSubmission", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "nextSubmissionIdx", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "registerVK", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setFeeModel", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "submit", data: BytesLike): Result;
}
export declare namespace ProofSubmittedEvent {
    type InputTuple = [
        circuitId: BigNumberish,
        proofId: BytesLike,
        submissionIdx: BigNumberish,
        proofIdx: BigNumberish,
        proof: ProofStruct,
        publicInputs: BigNumberish[]
    ];
    type OutputTuple = [
        circuitId: bigint,
        proofId: string,
        submissionIdx: bigint,
        proofIdx: bigint,
        proof: ProofStructOutput,
        publicInputs: bigint[]
    ];
    interface OutputObject {
        circuitId: bigint;
        proofId: string;
        submissionIdx: bigint;
        proofIdx: bigint;
        proof: ProofStructOutput;
        publicInputs: bigint[];
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace VKRegisteredEvent {
    type InputTuple = [circuitId: BigNumberish, vk: VKStruct];
    type OutputTuple = [circuitId: bigint, vk: VKStructOutput];
    interface OutputObject {
        circuitId: bigint;
        vk: VKStructOutput;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface SaturnProofReceiver extends BaseContract {
    connect(runner?: ContractRunner | null): SaturnProofReceiver;
    waitForDeployment(): Promise<this>;
    interface: SaturnProofReceiverInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    MAX_NUM_PROOFS_PER_SUBMISSION: TypedContractMethod<[], [bigint], "view">;
    MAX_SUBMISSION_MERKLE_DEPTH: TypedContractMethod<[], [bigint], "view">;
    _circuitData: TypedContractMethod<[
        arg0: BigNumberish
    ], [
        VKStructOutput
    ], "view">;
    _circuitIds: TypedContractMethod<[arg0: BigNumberish], [bigint], "view">;
    _feeModel: TypedContractMethod<[], [string], "view">;
    _nextProofIdx: TypedContractMethod<[], [bigint], "view">;
    _nextSubmissionIdx: TypedContractMethod<[], [bigint], "view">;
    _owner: TypedContractMethod<[], [string], "view">;
    _submissions: TypedContractMethod<[
        arg0: BytesLike
    ], [
        [
            string,
            bigint,
            bigint,
            bigint,
            bigint
        ] & {
            proofDigestRoot: string;
            submissionIdx: bigint;
            submissionBlockNumber: bigint;
            numProofs: bigint;
            merkleDepth: bigint;
        }
    ], "view">;
    computeCircuitId: TypedContractMethod<[vk: VKStruct], [bigint], "view">;
    computeFinalDigest: TypedContractMethod<[
        proofIDs: BytesLike[]
    ], [
        string
    ], "view">;
    computeProofId: TypedContractMethod<[
        circuitId: BigNumberish,
        publicInputs: BigNumberish[]
    ], [
        string
    ], "view">;
    decomposeFq: TypedContractMethod<[
        fq: BigNumberish
    ], [
        [bigint, bigint, bigint]
    ], "view">;
    digestAsFieldElements: TypedContractMethod<[
        digest: BytesLike
    ], [
        [bigint, bigint]
    ], "view">;
    estimateFee: TypedContractMethod<[numProofs: BigNumberish], [bigint], "view">;
    getCircuitIds: TypedContractMethod<[], [bigint[]], "view">;
    getSubmission: TypedContractMethod<[
        submissionId: BytesLike
    ], [
        SaturnProofReceiver.SubmissionStructOutput
    ], "view">;
    getSubmissionIdx: TypedContractMethod<[
        submissionId: BytesLike
    ], [
        bigint
    ], "view">;
    getSubmissionIdxAndHeight: TypedContractMethod<[
        submissionId: BytesLike
    ], [
        [
            bigint,
            bigint
        ] & {
            submissionIdx: bigint;
            submissionBlockNumber: bigint;
        }
    ], "view">;
    getSubmissionIdxAndNumProofs: TypedContractMethod<[
        submissionId: BytesLike
    ], [
        [bigint, bigint] & {
            submissionIdx: bigint;
            numProofs: bigint;
        }
    ], "view">;
    getSubmissionIdxHeightNumProofsDepth: TypedContractMethod<[
        submissionId: BytesLike
    ], [
        [
            bigint,
            bigint,
            bigint,
            bigint
        ] & {
            submissionIdx: bigint;
            height: bigint;
            numProofs: bigint;
            depth: bigint;
        }
    ], "view">;
    getSubmissionIdxNumProofsDepth: TypedContractMethod<[
        submissionId: BytesLike
    ], [
        [
            bigint,
            bigint,
            bigint
        ] & {
            submissionIdx: bigint;
            numProofs: bigint;
            depth: bigint;
        }
    ], "view">;
    getVK: TypedContractMethod<[
        circuitId: BigNumberish
    ], [
        VKStructOutput
    ], "view">;
    maxNumProofsPerSubmission: TypedContractMethod<[], [bigint], "view">;
    nextSubmissionIdx: TypedContractMethod<[], [bigint], "view">;
    registerVK: TypedContractMethod<[vk: VKStruct], [bigint], "nonpayable">;
    setFeeModel: TypedContractMethod<[
        feeModel: AddressLike
    ], [
        void
    ], "nonpayable">;
    submit: TypedContractMethod<[
        circuitIds: BigNumberish[],
        proofs: ProofStruct[],
        publicInputs: BigNumberish[][]
    ], [
        string
    ], "payable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "MAX_NUM_PROOFS_PER_SUBMISSION"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "MAX_SUBMISSION_MERKLE_DEPTH"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "_circuitData"): TypedContractMethod<[arg0: BigNumberish], [VKStructOutput], "view">;
    getFunction(nameOrSignature: "_circuitIds"): TypedContractMethod<[arg0: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "_feeModel"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "_nextProofIdx"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "_nextSubmissionIdx"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "_owner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "_submissions"): TypedContractMethod<[
        arg0: BytesLike
    ], [
        [
            string,
            bigint,
            bigint,
            bigint,
            bigint
        ] & {
            proofDigestRoot: string;
            submissionIdx: bigint;
            submissionBlockNumber: bigint;
            numProofs: bigint;
            merkleDepth: bigint;
        }
    ], "view">;
    getFunction(nameOrSignature: "computeCircuitId"): TypedContractMethod<[vk: VKStruct], [bigint], "view">;
    getFunction(nameOrSignature: "computeFinalDigest"): TypedContractMethod<[proofIDs: BytesLike[]], [string], "view">;
    getFunction(nameOrSignature: "computeProofId"): TypedContractMethod<[
        circuitId: BigNumberish,
        publicInputs: BigNumberish[]
    ], [
        string
    ], "view">;
    getFunction(nameOrSignature: "decomposeFq"): TypedContractMethod<[
        fq: BigNumberish
    ], [
        [bigint, bigint, bigint]
    ], "view">;
    getFunction(nameOrSignature: "digestAsFieldElements"): TypedContractMethod<[digest: BytesLike], [[bigint, bigint]], "view">;
    getFunction(nameOrSignature: "estimateFee"): TypedContractMethod<[numProofs: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "getCircuitIds"): TypedContractMethod<[], [bigint[]], "view">;
    getFunction(nameOrSignature: "getSubmission"): TypedContractMethod<[
        submissionId: BytesLike
    ], [
        SaturnProofReceiver.SubmissionStructOutput
    ], "view">;
    getFunction(nameOrSignature: "getSubmissionIdx"): TypedContractMethod<[submissionId: BytesLike], [bigint], "view">;
    getFunction(nameOrSignature: "getSubmissionIdxAndHeight"): TypedContractMethod<[
        submissionId: BytesLike
    ], [
        [
            bigint,
            bigint
        ] & {
            submissionIdx: bigint;
            submissionBlockNumber: bigint;
        }
    ], "view">;
    getFunction(nameOrSignature: "getSubmissionIdxAndNumProofs"): TypedContractMethod<[
        submissionId: BytesLike
    ], [
        [bigint, bigint] & {
            submissionIdx: bigint;
            numProofs: bigint;
        }
    ], "view">;
    getFunction(nameOrSignature: "getSubmissionIdxHeightNumProofsDepth"): TypedContractMethod<[
        submissionId: BytesLike
    ], [
        [
            bigint,
            bigint,
            bigint,
            bigint
        ] & {
            submissionIdx: bigint;
            height: bigint;
            numProofs: bigint;
            depth: bigint;
        }
    ], "view">;
    getFunction(nameOrSignature: "getSubmissionIdxNumProofsDepth"): TypedContractMethod<[
        submissionId: BytesLike
    ], [
        [
            bigint,
            bigint,
            bigint
        ] & {
            submissionIdx: bigint;
            numProofs: bigint;
            depth: bigint;
        }
    ], "view">;
    getFunction(nameOrSignature: "getVK"): TypedContractMethod<[circuitId: BigNumberish], [VKStructOutput], "view">;
    getFunction(nameOrSignature: "maxNumProofsPerSubmission"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "nextSubmissionIdx"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "registerVK"): TypedContractMethod<[vk: VKStruct], [bigint], "nonpayable">;
    getFunction(nameOrSignature: "setFeeModel"): TypedContractMethod<[feeModel: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "submit"): TypedContractMethod<[
        circuitIds: BigNumberish[],
        proofs: ProofStruct[],
        publicInputs: BigNumberish[][]
    ], [
        string
    ], "payable">;
    getEvent(key: "ProofSubmitted"): TypedContractEvent<ProofSubmittedEvent.InputTuple, ProofSubmittedEvent.OutputTuple, ProofSubmittedEvent.OutputObject>;
    getEvent(key: "VKRegistered"): TypedContractEvent<VKRegisteredEvent.InputTuple, VKRegisteredEvent.OutputTuple, VKRegisteredEvent.OutputObject>;
    filters: {
        "ProofSubmitted(uint256,bytes32,uint64,uint64,tuple,uint256[])": TypedContractEvent<ProofSubmittedEvent.InputTuple, ProofSubmittedEvent.OutputTuple, ProofSubmittedEvent.OutputObject>;
        ProofSubmitted: TypedContractEvent<ProofSubmittedEvent.InputTuple, ProofSubmittedEvent.OutputTuple, ProofSubmittedEvent.OutputObject>;
        "VKRegistered(uint256,tuple)": TypedContractEvent<VKRegisteredEvent.InputTuple, VKRegisteredEvent.OutputTuple, VKRegisteredEvent.OutputObject>;
        VKRegistered: TypedContractEvent<VKRegisteredEvent.InputTuple, VKRegisteredEvent.OutputTuple, VKRegisteredEvent.OutputObject>;
    };
}
