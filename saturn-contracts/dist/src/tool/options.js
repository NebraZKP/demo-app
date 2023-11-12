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
exports.proofReferenceFile = exports.submissionFile = exports.feeInWei = exports.maxFeePerGasGwei = exports.dumpTx = exports.estimateGas = exports.wait = exports.circuitId = exports.proofsFile = exports.proofFile = exports.instance = exports.endpoint = exports.getPassword = exports.password = exports.keyfile = void 0;
const cmd_ts_1 = require("cmd-ts");
require("dotenv/config");
const readlineSync = __importStar(require("readline-sync"));
function keyfile(description) {
    return (0, cmd_ts_1.option)({
        type: cmd_ts_1.string,
        long: "keyfile",
        short: "k",
        defaultValue: () => process.env.KEYFILE || "",
        description: description || "Keyfile to sign tx (defaults to KEYFILE env var)",
    });
}
exports.keyfile = keyfile;
// Pass the output into `getPassword`.
function password(description) {
    return (0, cmd_ts_1.option)({
        type: cmd_ts_1.string,
        long: "password",
        short: "p",
        defaultValue: () => process.env.KEYFILE_PASSWORD || "",
        description: description ||
            "Password for keyfile (defaults to KEYFILE_PASSWORD env var)",
    });
}
exports.password = password;
function getPassword(password) {
    if (password) {
        // If password is provided as a command line argument, use it
        return password;
    }
    // If KEYFILE_PASSWORD is defined in environment variables, use it
    const envPassword = process.env.KEYFILE_PASSWORD;
    if (envPassword || envPassword == "") {
        return envPassword;
    }
    // Securely prompt user for their password (hides their input)
    const stdinPassword = readlineSync.question("Enter your keyfile password (empty if unencrypted): ", {
        hideEchoBack: true,
    });
    return stdinPassword;
}
exports.getPassword = getPassword;
function endpoint() {
    return (0, cmd_ts_1.option)({
        type: cmd_ts_1.string,
        long: "endpoint",
        short: "e",
        defaultValue: () => process.env.RPC_ENDPOINT || "http://127.0.0.1:8545/",
        description: "RPC endpoint to connect to (defaults to ENDPOINT env var)",
    });
}
exports.endpoint = endpoint;
function instance(description) {
    return (0, cmd_ts_1.option)({
        type: cmd_ts_1.string,
        long: "instance",
        short: "i",
        defaultValue: () => "saturn.instance",
        description: description || "Saturn instance file",
    });
}
exports.instance = instance;
function proofFile() {
    return (0, cmd_ts_1.option)({
        type: cmd_ts_1.string,
        long: "proof-file",
        short: "p",
        description: "Proof file",
    });
}
exports.proofFile = proofFile;
function proofsFile() {
    return (0, cmd_ts_1.option)({
        type: cmd_ts_1.string,
        long: "proofs-file",
        short: "p",
        description: "Proofs file (containing a list of proofs)",
    });
}
exports.proofsFile = proofsFile;
function circuitId() {
    return (0, cmd_ts_1.option)({
        type: cmd_ts_1.string,
        long: "circuit-id",
        short: "c",
        description: "Circuit Id",
    });
}
exports.circuitId = circuitId;
function wait() {
    return (0, cmd_ts_1.flag)({
        type: cmd_ts_1.boolean,
        long: "wait",
        short: "w",
        defaultValue: () => false,
        description: "Wait for the transaction to complete",
    });
}
exports.wait = wait;
function estimateGas() {
    return (0, cmd_ts_1.flag)({
        type: cmd_ts_1.boolean,
        long: "estimate-gas",
        short: "g",
        defaultValue: () => false,
        description: "Estimate gas only.  Do not send the tx.",
    });
}
exports.estimateGas = estimateGas;
function dumpTx() {
    return (0, cmd_ts_1.flag)({
        type: cmd_ts_1.boolean,
        long: "dump-tx",
        short: "d",
        defaultValue: () => false,
        description: "Dump the tx request.  Do not send.",
    });
}
exports.dumpTx = dumpTx;
function maxFeePerGasGwei() {
    return (0, cmd_ts_1.option)({
        type: cmd_ts_1.string,
        long: "max-fee-per-gas",
        defaultValue: () => {
            return process.env.MAX_FEE_PER_GAS_GWEI || "";
        },
        description: "Maximum fee per gas(Gwei) (or env var MAX_FEE_PER_GAS_GWEI)",
    });
}
exports.maxFeePerGasGwei = maxFeePerGasGwei;
function feeInWei() {
    return (0, cmd_ts_1.option)({
        type: (0, cmd_ts_1.optional)(cmd_ts_1.string),
        long: "fee",
        short: "f",
        description: "Fixed fee per proof in Wei",
    });
}
exports.feeInWei = feeInWei;
function submissionFile(description) {
    return (0, cmd_ts_1.option)({
        type: cmd_ts_1.string,
        long: "submission-file",
        short: "s",
        defaultValue: () => "",
        description: description || "Submission file",
    });
}
exports.submissionFile = submissionFile;
function proofReferenceFile(description) {
    return (0, cmd_ts_1.option)({
        type: cmd_ts_1.string,
        long: "proof-ref-file",
        short: "r",
        defaultValue: () => "",
        description: description || "Proof reference file",
    });
}
exports.proofReferenceFile = proofReferenceFile;
//# sourceMappingURL=options.js.map