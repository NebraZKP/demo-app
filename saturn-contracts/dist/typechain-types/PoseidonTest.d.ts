import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "./common";
export interface PoseidonTestInterface extends Interface {
    getFunction(nameOrSignature: "testHash" | "testPoseidonPermute"): FunctionFragment;
    encodeFunctionData(functionFragment: "testHash", values: [BigNumberish[]]): string;
    encodeFunctionData(functionFragment: "testPoseidonPermute", values: [BigNumberish, BigNumberish, BigNumberish]): string;
    decodeFunctionResult(functionFragment: "testHash", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "testPoseidonPermute", data: BytesLike): Result;
}
export interface PoseidonTest extends BaseContract {
    connect(runner?: ContractRunner | null): PoseidonTest;
    waitForDeployment(): Promise<this>;
    interface: PoseidonTestInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    testHash: TypedContractMethod<[
        inputs: BigNumberish[]
    ], [
        [bigint, bigint]
    ], "view">;
    testPoseidonPermute: TypedContractMethod<[
        state0: BigNumberish,
        state1: BigNumberish,
        state2: BigNumberish
    ], [
        [bigint, bigint, bigint]
    ], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "testHash"): TypedContractMethod<[inputs: BigNumberish[]], [[bigint, bigint]], "view">;
    getFunction(nameOrSignature: "testPoseidonPermute"): TypedContractMethod<[
        state0: BigNumberish,
        state1: BigNumberish,
        state2: BigNumberish
    ], [
        [bigint, bigint, bigint]
    ], "view">;
    filters: {};
}
