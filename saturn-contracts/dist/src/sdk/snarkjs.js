"use strict";
/// Declarations for snarkjs types
Object.defineProperty(exports, "__esModule", { value: true });
exports.groth16 = void 0;
const snarkjs_impl = require("snarkjs");
exports.groth16 = {
    fullProve: (input, wasmFile, zkeyFileName, 
    // eslint-disable-next-line
    logger) => {
        return snarkjs_impl.groth16.fullProve(input, wasmFile, zkeyFileName, logger);
    },
    verify: (vk, publicSignals, proof, 
    // eslint-disable-next-line
    logger) => {
        return snarkjs_impl.groth16.verify(vk, publicSignals, proof, logger);
    },
};
//# sourceMappingURL=snarkjs.js.map