import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "./common";
export interface PoseidonInterface extends Interface {
    getFunction(nameOrSignature: "constants" | "hash" | "permute" | "pow5mod"): FunctionFragment;
    encodeFunctionData(functionFragment: "constants", values?: undefined): string;
    encodeFunctionData(functionFragment: "hash", values: [BigNumberish[]]): string;
    encodeFunctionData(functionFragment: "permute", values: [BigNumberish[], BigNumberish, BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "pow5mod", values: [BigNumberish]): string;
    decodeFunctionResult(functionFragment: "constants", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "hash", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "permute", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "pow5mod", data: BytesLike): Result;
}
export interface Poseidon extends BaseContract {
    connect(runner?: ContractRunner | null): Poseidon;
    waitForDeployment(): Promise<this>;
    interface: PoseidonInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    constants: TypedContractMethod<[], [bigint[]], "view">;
    hash: TypedContractMethod<[data: BigNumberish[]], [bigint], "view">;
    permute: TypedContractMethod<[
        c: BigNumberish[],
        state0: BigNumberish,
        state1: BigNumberish,
        state2: BigNumberish
    ], [
        [bigint, bigint, bigint]
    ], "view">;
    pow5mod: TypedContractMethod<[i: BigNumberish], [bigint], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "constants"): TypedContractMethod<[], [bigint[]], "view">;
    getFunction(nameOrSignature: "hash"): TypedContractMethod<[data: BigNumberish[]], [bigint], "view">;
    getFunction(nameOrSignature: "permute"): TypedContractMethod<[
        c: BigNumberish[],
        state0: BigNumberish,
        state1: BigNumberish,
        state2: BigNumberish
    ], [
        [bigint, bigint, bigint]
    ], "view">;
    getFunction(nameOrSignature: "pow5mod"): TypedContractMethod<[i: BigNumberish], [bigint], "view">;
    filters: {};
}
