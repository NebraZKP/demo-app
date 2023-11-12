"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Proof = exports.VerifyingKey = exports.reverseFq2Elements = void 0;
const ethers_1 = require("ethers");
/// Convert from BigNumberish representation
function toG1(sol) {
    return [(0, ethers_1.toBeHex)(sol[0], 32), (0, ethers_1.toBeHex)(sol[1], 32)];
}
/// Convert from BigNumberish representation.
// Note this DOES NOT reverse the Fq2 component order.
function toG2(sol) {
    return [
        [(0, ethers_1.toBeHex)(sol[0][0], 32), (0, ethers_1.toBeHex)(sol[0][1], 32)],
        [(0, ethers_1.toBeHex)(sol[1][0], 32), (0, ethers_1.toBeHex)(sol[1][1], 32)],
    ];
}
/// Utility function to reverse Fq2 components.  Use VerifyingKey and Proof
/// instead.
function reverseFq2Elements(g2) {
    return [
        [g2[0][1], g2[0][0]],
        [g2[1][1], g2[1][0]],
    ];
}
exports.reverseFq2Elements = reverseFq2Elements;
function snarkJSG1ToG1(g1) {
    if (g1[2] !== "1") {
        throw "unexpected form of SnarkJSG1";
    }
    return [g1[0], g1[1]];
}
function snarkJSG2ToG2(g2) {
    if (g2[2][0] !== "1" || g2[2][1] !== "0") {
        throw "unexpected form of SnarkJSG2";
    }
    return [g2[0], g2[1]];
}
/// A Groth16 Verification Key.  All Fq2 elements are stored in the natural
/// order, as output by snarkjs.zkey.exportVerificationKey.
class VerifyingKey {
    constructor(alpha, beta, gamma, delta, s) {
        this.alpha = toG1(alpha);
        this.beta = toG2(beta);
        this.gamma = toG2(gamma);
        this.delta = toG2(delta);
        this.s = s.map(toG1);
    }
    static from_solidity(sol) {
        return new VerifyingKey(sol.alpha, sol.beta, sol.gamma, sol.delta, sol.s);
    }
    static from_json(json_obj) {
        const obj = json_obj;
        return new VerifyingKey(obj.alpha, obj.beta, obj.gamma, obj.delta, obj.s);
    }
    static from_snarkjs(snarkjs) {
        return new VerifyingKey(snarkJSG1ToG1(snarkjs.vk_alpha_1), snarkJSG2ToG2(snarkjs.vk_beta_2), snarkJSG2ToG2(snarkjs.vk_gamma_2), snarkJSG2ToG2(snarkjs.vk_delta_2), snarkjs.IC.map(snarkJSG1ToG1));
    }
    solidity() {
        // No conversion necessary
        return this;
    }
    snarkjs() {
        return {
            IC: this.s.map((x) => [x[0], x[1], "1"]),
            nPublic: this.s.length - 1,
            curve: "bn128",
            protocol: "groth",
            vk_alpha_1: [...this.alpha, "1"],
            vk_beta_2: [...this.beta, ["1", "0"]],
            vk_gamma_2: [...this.gamma, ["1", "0"]],
            vk_delta_2: [...this.delta, ["1", "0"]],
        };
    }
}
exports.VerifyingKey = VerifyingKey;
// TODO: Proof should really have different attributes, instead of matching
// SnarkJSProof, since the representations are not 100% compatible.
/// A "native" proof, as returned from snarkjs.fullProve.  Holds Fq2 elements
/// in the natural format.  Note, members are named the same as the snarkjs
/// proof struct, and intentionally differently from the Proof struct in the
/// Saturn contract, to prevent accidentally passing a proof with elements in
/// the wrong order.
class Proof {
    /// Assumes that values passed in are in the "natural" order (i.e. Fq2
    /// components NOT swapped) as output by snarkjs.fullProve.
    constructor(pi_a, pi_b, pi_c) {
        this.pi_a = [(0, ethers_1.toBeHex)(pi_a[0], 32), (0, ethers_1.toBeHex)(pi_a[1], 32)];
        this.pi_b = [
            [(0, ethers_1.toBeHex)(pi_b[0][0], 32), (0, ethers_1.toBeHex)(pi_b[0][1], 32)],
            [(0, ethers_1.toBeHex)(pi_b[1][0], 32), (0, ethers_1.toBeHex)(pi_b[1][1], 32)],
        ];
        this.pi_c = [(0, ethers_1.toBeHex)(pi_c[0], 32), (0, ethers_1.toBeHex)(pi_c[1], 32)];
    }
    static from_solidity(sol) {
        return new Proof(sol.pA, reverseFq2Elements(sol.pB), sol.pC);
    }
    static from_json(json_obj) {
        const obj = json_obj;
        return new Proof(obj.pi_a, obj.pi_b, obj.pi_c);
    }
    static from_snarkjs(json_obj) {
        return new Proof(snarkJSG1ToG1(json_obj.pi_a), snarkJSG2ToG2(json_obj.pi_b), snarkJSG1ToG1(json_obj.pi_c));
    }
    solidity() {
        return {
            pA: this.pi_a,
            pB: reverseFq2Elements(this.pi_b),
            pC: this.pi_c,
        };
    }
    snarkjs() {
        return {
            pi_a: [...this.pi_a, "1"],
            pi_b: [...this.pi_b, ["1", "0"]],
            pi_c: [...this.pi_c, "1"],
            curve: "bn128",
            protocol: "groth",
        };
    }
}
exports.Proof = Proof;
//# sourceMappingURL=application.js.map