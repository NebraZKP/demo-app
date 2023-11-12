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
exports.submitProof = void 0;
const cmd_ts_1 = require("cmd-ts");
const options = __importStar(require("./options"));
const config = __importStar(require("./config"));
const index_1 = require("../index");
const ethers = __importStar(require("ethers"));
const fs_1 = require("fs");
const saturn_1 = require("../sdk/saturn");
exports.submitProof = (0, cmd_ts_1.command)({
    name: "submit-proof",
    args: {
        endpoint: options.endpoint(),
        keyfile: options.keyfile(),
        password: options.password(),
        instance: options.instance(),
        wait: options.wait(),
        estimateGas: options.estimateGas(),
        dumpTx: options.dumpTx(),
        maxFeePerGasGwei: options.maxFeePerGasGwei(),
        circuitId: options.circuitId(),
        proofFile: options.proofFile(),
        proofIdFile: (0, cmd_ts_1.option)({
            type: (0, cmd_ts_1.optional)(cmd_ts_1.string),
            long: "proof-id-file",
            short: "i",
            description: "Output file containing proofId of submitted proof",
        }),
        feeInWei: options.feeInWei(),
    },
    description: "Submit a proof to the Saturn contract",
    handler: async function ({ endpoint, keyfile, password, instance, wait, estimateGas, dumpTx, maxFeePerGasGwei, circuitId, proofFile, proofIdFile, feeInWei, }) {
        const circuitIdNum = BigInt(circuitId);
        const { proof, inputs } = index_1.utils.loadProofAndInputsFile(proofFile);
        const provider = new ethers.JsonRpcProvider(endpoint);
        const wallet = await config.loadWallet(keyfile, options.getPassword(password), provider);
        const { proofReceiver: proofReceiver } = config.saturnFromInstanceFile(instance, wallet);
        // TODO: Keep each stage explicit.  Later we may want to add options to
        // output the tx request (e.g. to run replay it later or run gas estimates
        // etc).
        const optionsPayable = {
            value: index_1.utils.parseFeeOrDefault(feeInWei),
        };
        const txReq = await (0, saturn_1.populateSubmitProof)(proofReceiver, circuitIdNum, proof, inputs, optionsPayable);
        await config.handleTxRequest(wallet, txReq, estimateGas, dumpTx, wait, maxFeePerGasGwei);
        if (proofIdFile) {
            const proofId = index_1.utils.computeProofId(circuitIdNum, inputs);
            (0, fs_1.writeFileSync)(proofIdFile, proofId);
        }
    },
});
//# sourceMappingURL=submitProof.js.map