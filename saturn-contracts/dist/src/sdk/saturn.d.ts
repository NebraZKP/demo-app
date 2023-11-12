import * as ethers from "ethers";
import { SaturnVerifier, SaturnProofReceiver, IGroth16Verifier, ISaturnFeeModel, ISaturnProofReceiver } from "../../typechain-types";
import { application } from "..";
import { PayableOverrides } from "../../typechain-types/common";
export declare const isVerifiedSingle = "isVerified(uint256,uint256[])";
export declare const isVerifiedMulti = "isVerified(uint256,uint256[],(bytes32,bytes32[],uint16))";
export type SaturnInstanceDescriptor = {
    verifier: string;
    proofReceiver: string;
    poseidon: string;
    aggregatedProofVerifier: string;
    feeModel: string;
};
export type SaturnInstance = {
    verifier: SaturnVerifier;
    proofReceiver: SaturnProofReceiver;
    feeModel: ISaturnFeeModel;
};
export declare function deploySaturn(signer: ethers.Signer, verifier_bin_file: string, groth16Verifier?: IGroth16Verifier, owner?: string, worker?: string, proofReceiver?: SaturnProofReceiver, feeModel?: ISaturnFeeModel, feeInWei?: bigint): Promise<SaturnInstanceDescriptor>;
export declare function saturnInstanceFromDescriptor(instanceDescriptor: SaturnInstanceDescriptor, provider: ethers.ContractRunner): SaturnInstance;
export declare function updateOptions(proofReceiver: ISaturnProofReceiver, numProofs: number, options?: PayableOverrides): Promise<PayableOverrides>;
export declare function populateSubmitProof(proofReceiver: ISaturnProofReceiver, circuitId: ethers.BigNumberish, proof: application.Proof, instance: ethers.BigNumberish[], options?: PayableOverrides): Promise<ethers.ContractTransaction>;
export declare function submitProof(proofReceiver: ISaturnProofReceiver, circuitId: ethers.BigNumberish, proof: application.Proof, instance: ethers.BigNumberish[], options?: PayableOverrides): Promise<ethers.ContractTransactionResponse>;
export declare function populateSubmitProofs(proofReceiver: ISaturnProofReceiver, circuitIds: ethers.BigNumberish[], proofs: application.Proof[], instances: ethers.BigNumberish[][], options?: PayableOverrides): Promise<ethers.ContractTransaction>;
export declare function submitProofs(proofReceiver: ISaturnProofReceiver, circuitIds: ethers.BigNumberish[], proofs: application.Proof[], instances: ethers.BigNumberish[][], options?: PayableOverrides): Promise<ethers.ContractTransactionResponse>;
export declare function waitForProofVerified(saturnInstance: SaturnInstance, tx: ethers.TransactionReceipt, proofId: string, progress?: (v: number) => void): Promise<boolean>;
