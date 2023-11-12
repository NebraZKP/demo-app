import { Signer, BytesLike } from "ethers";
import { SaturnInstance } from "../src/sdk/saturn";
export declare function dummyProofData(proofIDs: BytesLike[]): BytesLike;
type DeployResult = {
    saturn: SaturnInstance;
    owner: Signer;
    worker: Signer;
    user1: Signer;
    user2: Signer;
};
export declare function deploySaturnWithVerifier(verifier?: string): Promise<DeployResult>;
export declare function deploySaturnDummyVerifier(): Promise<DeployResult>;
export {};
