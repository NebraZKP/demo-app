import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../common";
import type { PoseidonTest, PoseidonTestInterface } from "../PoseidonTest";
type PoseidonTestConstructorParams = [linkLibraryAddresses: PoseidonTestLibraryAddresses, signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class PoseidonTest__factory extends ContractFactory {
    constructor(...args: PoseidonTestConstructorParams);
    static linkBytecode(linkLibraryAddresses: PoseidonTestLibraryAddresses): string;
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<PoseidonTest & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): PoseidonTest__factory;
    static readonly bytecode = "0x60808060405234610016576103ec908161001c8239f35b600080fdfe60806040908082526004908136101561001757600080fd5b600090813560e01c908163218bfb5014610206575063bdf9e1b11461003b57600080fd5b3461012c57606092836003193601126102025780516372de5b2f60e01b81526118609373__$5f8d1571992d2f3bcd28d5b37c5414edb7$__9185818381865af49586156101f857859661015e575b50508251636127984d60e01b81529486928692909186908483015b60c38310610141575050506118c4918391356118648301526024356118848301526044356118a48301525af49182156101365780938180946100f2575b505081519384526020840152820152f35b929350809450858092503d831161012f575b61010e818361037e565b8101031261012c5750815190806020840151930151919238806100e1565b80fd5b503d610104565b9051903d90823e3d90fd5b815181528a965089955060019290920191602091820191016100a4565b80919296503d82116101f1575b610175818461037e565b82019080838303126101ed5781601f840112156101ed5784519281840184811067ffffffffffffffff8211176101da578652839181019283116101d657905b8282106101c657505050933880610089565b81518152602091820191016101b4565b8680fd5b634e487b7160e01b885260418952602488fd5b8580fd5b503d61016b565b84513d87823e3d90fd5b5080fd5b929190503461012c576020908160031936011261012c5767ffffffffffffffff92803584811161037a573660238201121561037a5780820135948511610367578460051b946102578587018861037e565b8652838601602481968301019136831161036357959695602401905b828210610354575050505a9383875180976340ec6e4960e01b82526024820193838684015251809452604482019093865b81811061033b57505081929350038173__$5f8d1571992d2f3bcd28d5b37c5414edb7$__5af4948515610331578295610302575b505a84039384116102ef5750508351928352820152f35b634e487b7160e01b825260119052602490fd5b9094508281813d831161032a575b61031a818361037e565b81010312610202575193386102d8565b503d610310565b86513d84823e3d90fd5b855183529484019488948b9450909201916001016102a4565b81358152908501908501610273565b8480fd5b634e487b7160e01b835260418252602483fd5b8280fd5b90601f8019910116810190811067ffffffffffffffff8211176103a057604052565b634e487b7160e01b600052604160045260246000fdfea2646970667358221220de5aa7b809db0b7869d0a49ce69f7de371fbb569e63bf3b4040667d114bf917764736f6c63430008110033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "uint256[]";
            readonly name: "inputs";
            readonly type: "uint256[]";
        }];
        readonly name: "testHash";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "state0";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "state1";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "state2";
            readonly type: "uint256";
        }];
        readonly name: "testPoseidonPermute";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }];
    static createInterface(): PoseidonTestInterface;
    static connect(address: string, runner?: ContractRunner | null): PoseidonTest;
}
export interface PoseidonTestLibraryAddresses {
    ["contracts/Poseidon.sol:Poseidon"]: string;
}
export {};
