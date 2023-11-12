import { Signer } from "ethers";
import { VerifyingKey, Proof } from "./application";
import { SnarkJSVKey } from "./snarkjs";
export type VKProofAndInputs = {
    vk: VerifyingKey;
    proof: Proof;
    inputs: bigint[];
};
export type CircuitIdProofAndInputs = {
    circuit_id: bigint;
    proof: Proof;
    inputs: bigint[];
};
export type ProofAndInputs = {
    proof: Proof;
    inputs: bigint[];
};
export declare function bigintToHex32(b: bigint): string;
export declare function bigintToBytes32(b: bigint): Uint8Array;
export declare function deployBinaryContract(deployer: Signer, bin_file: string, nonce?: number): Promise<string>;
export declare function loadAppVK(filename: string): VerifyingKey;
export declare function loadSnarkjsVK(filename: string): SnarkJSVKey;
export declare function loadProofAndInputsFile(filename: string): ProofAndInputs;
export declare function loadProofAndInputsBatchFile(filename: string): ProofAndInputs[];
export declare function loadVKProofAndInputsBatchFile(filename: string): VKProofAndInputs[];
export declare function JSONstringify(obj: unknown, spacing?: number, forceDecimal?: boolean): string;
export declare function requestWithRetry<T>(requestFn: () => Promise<T>, requestLabel: string, maxRetries?: number, timeoutMs?: number, onFail?: () => void): Promise<T>;
export declare function computeProofId(circuitId: bigint, appPublicInputs: bigint[]): string;
export declare function parseFeeOrDefault(feeInWei?: string): bigint | undefined;
