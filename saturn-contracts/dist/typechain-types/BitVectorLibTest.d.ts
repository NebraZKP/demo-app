import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "./common";
export interface BitVectorLibTestInterface extends Interface {
    getFunction(nameOrSignature: "getUint16" | "getWords" | "isSet" | "set" | "setUint16"): FunctionFragment;
    encodeFunctionData(functionFragment: "getUint16", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "getWords", values?: undefined): string;
    encodeFunctionData(functionFragment: "isSet", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "set", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "setUint16", values: [BigNumberish, BigNumberish]): string;
    decodeFunctionResult(functionFragment: "getUint16", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getWords", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isSet", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "set", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setUint16", data: BytesLike): Result;
}
export interface BitVectorLibTest extends BaseContract {
    connect(runner?: ContractRunner | null): BitVectorLibTest;
    waitForDeployment(): Promise<this>;
    interface: BitVectorLibTestInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    getUint16: TypedContractMethod<[idx: BigNumberish], [bigint], "view">;
    getWords: TypedContractMethod<[], [bigint[]], "view">;
    isSet: TypedContractMethod<[idx: BigNumberish], [boolean], "view">;
    set: TypedContractMethod<[idx: BigNumberish], [void], "nonpayable">;
    setUint16: TypedContractMethod<[
        idx: BigNumberish,
        value: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "getUint16"): TypedContractMethod<[idx: BigNumberish], [bigint], "view">;
    getFunction(nameOrSignature: "getWords"): TypedContractMethod<[], [bigint[]], "view">;
    getFunction(nameOrSignature: "isSet"): TypedContractMethod<[idx: BigNumberish], [boolean], "view">;
    getFunction(nameOrSignature: "set"): TypedContractMethod<[idx: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "setUint16"): TypedContractMethod<[
        idx: BigNumberish,
        value: BigNumberish
    ], [
        void
    ], "nonpayable">;
    filters: {};
}
