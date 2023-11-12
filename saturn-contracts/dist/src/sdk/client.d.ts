import * as ethers from "ethers";
import { SaturnInstance } from "./saturn";
import { Proof } from "./application";
import { PayableOverrides } from "../../typechain-types/common";
export declare class SaturnClient {
    wallet: ethers.ethers.BaseWallet;
    saturnInstance: SaturnInstance;
    constructor(saturnInstanceFile: string, wallet: ethers.ethers.BaseWallet);
    submitProof(circuitId: ethers.BigNumberish, proof: Proof, publicInputs: ethers.BigNumberish[], options?: PayableOverrides | undefined): Promise<SubmissionHandle>;
    waitForProofVerified(submissionHandle: SubmissionHandle, progress?: (v: number) => void): Promise<void>;
}
export declare class SubmissionHandle {
    proofId: string;
    txResponse: ethers.ethers.ContractTransactionResponse;
    constructor(proofId: string, txResponse: ethers.ethers.ContractTransactionResponse);
}
