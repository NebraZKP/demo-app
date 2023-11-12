import { VKStruct, ProofStruct } from "../../typechain-types/ISaturnProofReceiver";
import { SnarkJSProof, SnarkJSVKey } from "./snarkjs";
import { BigNumberish } from "ethers";
export type G1Point = [string, string];
export type G2Point = [[string, string], [string, string]];
export declare function reverseFq2Elements<T>(g2: [[T, T], [T, T]]): [[T, T], [T, T]];
export declare class VerifyingKey {
    alpha: G1Point;
    beta: G2Point;
    gamma: G2Point;
    delta: G2Point;
    s: G1Point[];
    constructor(alpha: [BigNumberish, BigNumberish], beta: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]], gamma: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]], delta: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]], s: [BigNumberish, BigNumberish][]);
    static from_solidity(sol: VKStruct): VerifyingKey;
    static from_json(json_obj: object): VerifyingKey;
    static from_snarkjs(snarkjs: SnarkJSVKey): VerifyingKey;
    solidity(): VKStruct;
    snarkjs(): SnarkJSVKey;
}
export declare class Proof {
    pi_a: G1Point;
    pi_b: G2Point;
    pi_c: G1Point;
    constructor(pi_a: [BigNumberish, BigNumberish], pi_b: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]], pi_c: [BigNumberish, BigNumberish]);
    static from_solidity(sol: ProofStruct): Proof;
    static from_json(json_obj: object): Proof;
    static from_snarkjs(json_obj: SnarkJSProof): Proof;
    solidity(): ProofStruct;
    snarkjs(): SnarkJSProof;
}
