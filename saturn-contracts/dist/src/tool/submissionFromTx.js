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
exports.submissionFromTx = void 0;
const cmd_ts_1 = require("cmd-ts");
const options = __importStar(require("./options"));
const config = __importStar(require("./config"));
const ethers = __importStar(require("ethers"));
const fs_1 = require("fs");
const submission_1 = require("../sdk/submission");
const process_1 = require("process");
exports.submissionFromTx = (0, cmd_ts_1.command)({
    name: "submission-from-tx",
    args: {
        endpoint: options.endpoint(),
        instance: options.instance(),
        submissionFile: options.submissionFile(),
        txHash: (0, cmd_ts_1.positional)({
            type: cmd_ts_1.string,
            displayName: "tx-hash",
            description: "Hash of the tx to trace",
        }),
    },
    description: "Submit a proof to the Saturn contract",
    handler: async function ({ endpoint, instance, submissionFile, txHash, }) {
        const provider = new ethers.JsonRpcProvider(endpoint);
        const { proofReceiver } = config.saturnFromInstanceFile(instance, provider);
        const txReceipt = await provider.getTransactionReceipt(txHash);
        if (!txReceipt) {
            console.error(`failed to get receipt for ${txHash}`);
            (0, process_1.exit)(1);
        }
        const submission = submission_1.Submission.fromTransactionReceipt(proofReceiver, txReceipt);
        if (submissionFile) {
            (0, fs_1.writeFileSync)(submissionFile, submission.to_json());
        }
        else {
            console.log(submission.to_json());
        }
    },
});
//# sourceMappingURL=submissionFromTx.js.map