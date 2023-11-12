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
exports.computeProofIds = exports.computeProofId = void 0;
const cmd_ts_1 = require("cmd-ts");
const options = __importStar(require("./options"));
const index_1 = require("../index");
const utils_1 = require("../sdk/utils");
exports.computeProofId = (0, cmd_ts_1.command)({
    name: "compute-proof-id",
    args: {
        circuitId: options.circuitId(),
        proofFile: options.proofFile(),
    },
    description: "Locally compute the proofId a proof",
    handler: function ({ circuitId, proofFile }) {
        const { inputs } = index_1.utils.loadProofAndInputsFile(proofFile);
        console.log(index_1.utils.computeProofId(BigInt(circuitId), inputs));
    },
});
exports.computeProofIds = (0, cmd_ts_1.command)({
    name: "compute-proof-ids",
    args: {
        circuitId: options.circuitId(),
        proofsFile: options.proofsFile(),
    },
    description: "Locally compute the proofIds for a batch of proofs",
    handler: function ({ circuitId, proofsFile }) {
        const circuitIdNum = BigInt(circuitId);
        const pis = index_1.utils.loadProofAndInputsBatchFile(proofsFile);
        const proofIds = pis.map((pi) => index_1.utils.computeProofId(circuitIdNum, pi.inputs));
        console.log((0, utils_1.JSONstringify)(proofIds));
    },
});
//# sourceMappingURL=computeProofId.js.map