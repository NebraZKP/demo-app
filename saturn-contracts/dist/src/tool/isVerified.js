"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVerified = void 0;
const cmd_ts_1 = require("cmd-ts");
const options = __importStar(require("./options"));
const config = __importStar(require("./config"));
const index_1 = require("../index");
const ethers = __importStar(require("ethers"));
const saturn_1 = require("../sdk/saturn");
const fs_1 = require("fs");
const submission_1 = require("../sdk/submission");
exports.isVerified = (0, cmd_ts_1.command)({
    name: "is-verified",
    args: {
        endpoint: options.endpoint(),
        instance: options.instance(),
        circuitId: options.circuitId(),
        proofFile: options.proofFile(),
        proofReferenceFile: options.proofReferenceFile(),
    },
    description: "Query Saturn contract for verification status of a given proof",
    handler: async function ({ endpoint, instance, circuitId, proofFile, proofReferenceFile, }) {
        // TODO: support other ways of specifying inputs.
        const circuitIdNum = BigInt(circuitId);
        const { inputs } = index_1.utils.loadProofAndInputsFile(proofFile);
        const proofRef = (() => {
            if (proofReferenceFile) {
                const proofRef = submission_1.ProofReference.from_json((0, fs_1.readFileSync)(proofReferenceFile, "ascii"));
                return proofRef;
            }
            return undefined;
        })();
        const provider = new ethers.JsonRpcProvider(endpoint);
        const saturn = config.saturnFromInstanceFile(instance, provider);
        /// Choose which `isVerified` function to call, based on whether there is
        /// a proofRef or not.
        const verified = await (async () => {
            if (proofRef) {
                return await saturn.verifier.getFunction(saturn_1.isVerifiedMulti)(circuitIdNum, inputs, proofRef.solidity());
            }
            return await saturn.verifier.getFunction(saturn_1.isVerifiedSingle)(circuitIdNum, inputs);
        })();
        // write 1/0 to stdout and use exit status to indicate validity
        console.log(verified ? "1" : "0");
        process.exit(verified ? 0 : 1);
    },
});
//# sourceMappingURL=isVerified.js.map