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
exports.submitProofs = void 0;
const cmd_ts_1 = require("cmd-ts");
const options = __importStar(require("./options"));
const config = __importStar(require("./config"));
const index_1 = require("../index");
const ethers = __importStar(require("ethers"));
const log = __importStar(require("../sdk/log"));
const fs_1 = require("fs");
const saturn_1 = require("../sdk/saturn");
const submission_1 = require("../sdk/submission");
const utils_1 = require("../sdk/utils");
exports.submitProofs = (0, cmd_ts_1.command)({
    name: "submit-proofs",
    args: {
        endpoint: options.endpoint(),
        keyfile: options.keyfile(),
        password: options.password(),
        instance: options.instance(),
        estimateGas: options.estimateGas(),
        dumpTx: options.dumpTx(),
        wait: options.wait(),
        maxFeePerGasGwei: options.maxFeePerGasGwei(),
        proofsFile: options.proofsFile(),
        skip: (0, cmd_ts_1.option)({
            type: cmd_ts_1.number,
            long: "skip",
            description: "Skip this number of proofs in the file",
            defaultValue: () => 0,
        }),
        numProofs: (0, cmd_ts_1.option)({
            type: (0, cmd_ts_1.optional)(cmd_ts_1.number),
            long: "num-proofs",
            short: "N",
            description: "Number of proofs to submit",
        }),
        feeInWei: options.feeInWei(),
        outProofIdsFile: (0, cmd_ts_1.option)({
            type: (0, cmd_ts_1.optional)(cmd_ts_1.string),
            long: "proof-ids-file",
            short: "i",
            description: "Output file containing proofIds of submitted proofs",
        }),
        outSubmissionFile: options.submissionFile("Output file containing the submission data"),
    },
    description: "Make a multi-proof submission to Saturn.  Outputs Tx hash to stdout.  " +
        "<proofs-file> must be JSON list of objects { vk, proof, inputs }.",
    handler: async function ({ endpoint, keyfile, password, instance, estimateGas, dumpTx, wait, maxFeePerGasGwei, proofsFile, skip, numProofs, feeInWei, outProofIdsFile, outSubmissionFile, }) {
        const vkProofsAndInputs = (() => {
            const entries = index_1.utils.loadVKProofAndInputsBatchFile(proofsFile);
            numProofs = numProofs || entries.length;
            return entries.slice(skip, skip + numProofs);
        })();
        const provider = new ethers.JsonRpcProvider(endpoint);
        const wallet = await config.loadWallet(keyfile, options.getPassword(password), provider);
        const { proofReceiver } = config.saturnFromInstanceFile(instance, wallet);
        // Compute the circuitIds
        const circuitIdProofsAndInputs = await Promise.all(vkProofsAndInputs.map(async (vpi) => {
            return {
                circuit_id: await proofReceiver.computeCircuitId(vpi.vk),
                proof: vpi.proof,
                inputs: vpi.inputs,
            };
        }));
        // Create the Submission object
        const submission = submission_1.Submission.fromCircuitIdsProofsAndInputs(circuitIdProofsAndInputs);
        // Optionally write the submission JSON file
        if (outSubmissionFile) {
            log.debug(`Writing submission to ${outSubmissionFile}`);
            (0, fs_1.writeFileSync)(outSubmissionFile, submission.to_json());
        }
        // Optionally write proofIds to a file
        if (outProofIdsFile) {
            log.debug(`Writing proofIds to ${outProofIdsFile}`);
            (0, fs_1.writeFileSync)(outProofIdsFile, (0, utils_1.JSONstringify)(submission.getProofIds()));
        }
        // Submit to the contract (output tx hash, optionally dump tx, wait,
        // estimate gas, etc)
        const txReq = await (0, saturn_1.populateSubmitProofs)(proofReceiver, submission.circuitIds, submission.proofs, submission.inputs, { value: index_1.utils.parseFeeOrDefault(feeInWei) });
        await config.handleTxRequest(wallet, txReq, estimateGas, dumpTx, wait, maxFeePerGasGwei);
    },
});
//# sourceMappingURL=submitProofs.js.map