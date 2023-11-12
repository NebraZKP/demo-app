import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../common";
import type { YulTest, YulTestInterface } from "../YulTest";
type YulTestConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class YulTest__factory extends ContractFactory {
    constructor(...args: YulTestConstructorParams);
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<YulTest & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): YulTest__factory;
    static readonly bytecode = "0x60808060405234610016576101c3908161001c8239f35b600080fdfe608060408181526004918236101561001657600080fd5b600092833560e01c63108ddba41461002d57600080fd5b3461018957826003193601126101895780356001600160a01b0381168103610185578460249182359067ffffffffffffffff95868311610189573660238401121561018957828601358781116101855736868286010111610185578181869592888794018337810182815203925af13d1561017c573d84811161016a57855194601f8201601f19908116603f011686019081118682101761015857865284523d86602086013e5b1561012457505091815192839160208084528251928382860152825b84811061010e57505050828201840152601f01601f19168101030190f35b81810183015188820188015287955082016100f0565b90600f606492602086519362461bcd60e51b85528401528201526e1e5d5b0818dbd9194819985a5b1959608a1b6044820152fd5b634e487b7160e01b8852604185528388fd5b634e487b7160e01b8752604184528287fd5b606093506100d4565b8480fd5b8380fdfea26469706673582212204ee9be3e30f3e97d7d0d1b3ffe4d0e3d18bced70f0d146635785745a4c41281964736f6c63430008110033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "contractAddress";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly name: "callYul";
        readonly outputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): YulTestInterface;
    static connect(address: string, runner?: ContractRunner | null): YulTest;
}
export {};
