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
exports.submitAggregatedProof = void 0;
const cmd_ts_1 = require("cmd-ts");
const options = __importStar(require("./options"));
const config = __importStar(require("./config"));
const ethers = __importStar(require("ethers"));
const fs_1 = require("fs");
const submission_1 = require("../sdk/submission");
exports.submitAggregatedProof = (0, cmd_ts_1.command)({
    name: "submit-aggregated-proof",
    args: {
        endpoint: options.endpoint(),
        keyfile: options.keyfile(),
        password: options.password(),
        instance: options.instance(),
        wait: options.wait(),
        estimateGas: options.estimateGas(),
        dumpTx: options.dumpTx(),
        maxFeePerGasGwei: options.maxFeePerGasGwei(),
        calldataFile: (0, cmd_ts_1.option)({
            type: cmd_ts_1.string,
            long: "calldata-file",
            short: "p",
            description: "Proof file",
        }),
        proofIdsFile: (0, cmd_ts_1.option)({
            type: cmd_ts_1.string,
            long: "proof-ids-file",
            short: "i",
            description: "file with JSON list of proofIds to be aggregated",
        }),
        submissionProofFiles: (0, cmd_ts_1.multioption)({
            type: (0, cmd_ts_1.array)(cmd_ts_1.string),
            long: "submission-proof-file",
            short: "s",
            description: "submission proof file(s)",
        }),
    },
    description: "Submit an aggregated proof to the Saturn contract",
    handler: async function ({ endpoint, keyfile, password, instance, calldataFile, proofIdsFile, submissionProofFiles, wait, estimateGas, dumpTx, maxFeePerGasGwei, }) {
        const calldata = (0, fs_1.readFileSync)(calldataFile);
        const proofIds = JSON.parse((0, fs_1.readFileSync)(proofIdsFile, "ascii"));
        const submissionProofs = submissionProofFiles.map((f) => {
            return submission_1.SubmissionProof.from_json((0, fs_1.readFileSync)(f, "ascii"));
        });
        const provider = new ethers.JsonRpcProvider(endpoint);
        const wallet = await config.loadWallet(keyfile, options.getPassword(password), provider);
        const { verifier: verifier } = config.saturnFromInstanceFile(instance, wallet);
        const submissionProofsSolidity = submissionProofs.map((p) => p.solidity());
        const txReq = await verifier.verifyAggregatedProof.populateTransaction(calldata, proofIds, submissionProofsSolidity);
        await config.handleTxRequest(wallet, txReq, estimateGas, dumpTx, wait, maxFeePerGasGwei);
    },
});
//# sourceMappingURL=submitAggregatedProof.js.map