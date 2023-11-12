import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../common";
import type { BitVectorLibTest, BitVectorLibTestInterface } from "../BitVectorLibTest";
type BitVectorLibTestConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class BitVectorLibTest__factory extends ContractFactory {
    constructor(...args: BitVectorLibTestConstructorParams);
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<BitVectorLibTest & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): BitVectorLibTest__factory;
    static readonly bytecode = "0x60808060405234610016576104f7908161001c8239f35b600080fdfe60806040526004361015610013575b600080fd5b6000803560e01c9081634178462f1461007a57508063538168341461007157806379b1422f14610068578063cc58929d1461005f5763dca7bcbe1461005757600080fd5b61000e610328565b5061000e6101f9565b5061000e61018d565b5061000e61011b565b346100f657610088366100f9565b8154600160ff83161b9160081c6001600160781b0316908110156100e457806100e1926100b76100c0936103be565b939054926103be565b92909360031b1c179082549060031b600019811b9283911b16911916179055565b80f35b60018101835582805260208320015580f35b80fd5b602090600319011261000e576004356001600160801b038116810361000e5790565b503461000e57602061012c366100f9565b60008054600883901c6001600160781b031692919083101561016e575060ff6101566001936103be565b90549060031b1c91161c1615155b6040519015158152f35b915050610164565b6004359067ffffffffffffffff8216820361000e57565b503461000e57602036600319011261000e5760206101a9610176565b600090670fffffffffffffff8160041c169160015483106000146101f1575060f06101d661ffff936103eb565b90549060031b1c9160041b161c165b61ffff60405191168152f35b9150506101e5565b503461000e57604036600319011261000e57610213610176565b60243561ffff9081811680910361000e5760f0670fffffffffffffff8460041c169360041b1690811b91600154841060001461029357916102769161026e859461025f610291976103eb565b9190931b1992549060031b1c90565b1617916103eb565b90919082549060031b600019811b9283911b16911916179055565b005b50506102e76102dd836001610291950160015560016000528381602060002001556102d86001546102d26102c68461041c565b6001600160801b031690565b1461044a565b6103eb565b90549060031b1c90565b14610486565b6020908160408183019282815285518094520193019160005b828110610314575050505090565b835185529381019392810192600101610306565b503461000e576000806003193601126100f6576040518154808252828052602080842081840192909185905b8282106103a75750505050819003601f01601f191681019167ffffffffffffffff831182841017610393575061038f829182604052826102ed565b0390f35b634e487b7160e01b81526041600452602490fd5b835485529384019360019384019390910190610354565b9060009182548110156103d75782805260208320019190565b634e487b7160e01b83526032600452602483fd5b60015481101561040657600160005260206000200190600090565b634e487b7160e01b600052603260045260246000fd5b6001600160801b039081166001019190821161043457565b634e487b7160e01b600052601160045260246000fd5b1561045157565b60405162461bcd60e51b815260206004820152600d60248201526c0eccac6e8dee440d8cadccee8d609b1b6044820152606490fd5b1561048d57565b60405162461bcd60e51b815260206004820152600c60248201526b766563746f7220656e74727960a01b6044820152606490fdfea2646970667358221220f7e6a787b937d99094a0586889658c1259e3c6a009823fe9ec4f4f570a0fe52864736f6c63430008110033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "uint64";
            readonly name: "idx";
            readonly type: "uint64";
        }];
        readonly name: "getUint16";
        readonly outputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "";
            readonly type: "uint16";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getWords";
        readonly outputs: readonly [{
            readonly internalType: "uint256[]";
            readonly name: "";
            readonly type: "uint256[]";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint128";
            readonly name: "idx";
            readonly type: "uint128";
        }];
        readonly name: "isSet";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint128";
            readonly name: "idx";
            readonly type: "uint128";
        }];
        readonly name: "set";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint64";
            readonly name: "idx";
            readonly type: "uint64";
        }, {
            readonly internalType: "uint16";
            readonly name: "value";
            readonly type: "uint16";
        }];
        readonly name: "setUint16";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): BitVectorLibTestInterface;
    static connect(address: string, runner?: ContractRunner | null): BitVectorLibTest;
}
export {};
