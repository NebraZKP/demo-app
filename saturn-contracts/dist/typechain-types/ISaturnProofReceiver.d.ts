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
export interface ISaturnProofReceiverInterface extends Interface {
    getFunction(nameOrSignature: "estimateFee" | "maxNumProofsPerSubmission" | "registerVK" | "submit"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "ProofSubmitted" | "VKRegistered"): EventFragment;
    encodeFunctionData(functionFragment: "estimateFee", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "maxNumProofsPerSubmission", values?: undefined): string;
    encodeFunctionData(functionFragment: "registerVK", values: [VKStruct]): string;
    encodeFunctionData(functionFragment: "submit", values: [BigNumberish[], ProofStruct[], BigNumberish[][]]): string;
    decodeFunctionResult(functionFragment: "estimateFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "maxNumProofsPerSubmission", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "registerVK", data: BytesLike): Result;
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
export interface ISaturnProofReceiver extends BaseContract {
    connect(runner?: ContractRunner | null): ISaturnProofReceiver;
    waitForDeployment(): Promise<this>;
    interface: ISaturnProofReceiverInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    estimateFee: TypedContractMethod<[numProofs: BigNumberish], [bigint], "view">;
    maxNumProofsPerSubmission: TypedContractMethod<[], [bigint], "view">;
    registerVK: TypedContractMethod<[vk: VKStruct], [bigint], "nonpayable">;
    submit: TypedContractMethod<[
        circuitIds: BigNumberish[],
        proofs: ProofStruct[],
        publicInputs: BigNumberish[][]
    ], [
        string
    ], "payable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "estimateFee"): TypedContractMethod<[numProofs: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "maxNumProofsPerSubmission"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "registerVK"): TypedContractMethod<[vk: VKStruct], [bigint], "nonpayable">;
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
