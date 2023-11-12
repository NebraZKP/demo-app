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
exports.computeProofRef = void 0;
const cmd_ts_1 = require("cmd-ts");
const options = __importStar(require("./options"));
const fs_1 = require("fs");
const submission_1 = require("../sdk/submission");
exports.computeProofRef = (0, cmd_ts_1.command)({
    name: "compute-proof-ref",
    args: {
        submissionFile: options.submissionFile(),
        proofIdx: (0, cmd_ts_1.option)({
            type: cmd_ts_1.number,
            long: "proof-idx",
            short: "i",
            description: "Index of proof within the submission",
        }),
        proofReferenceFile: options.proofReferenceFile(),
    },
    description: "Compute ProofReference for proof at given index within submission",
    handler: async function ({ submissionFile, proofIdx, proofReferenceFile, }) {
        const submission = submission_1.Submission.from_json((0, fs_1.readFileSync)(submissionFile, "ascii"));
        const proofRef = submission.computeProofReference(proofIdx);
        if (!proofRef) {
            console.log("ProofReference not required");
            return;
        }
        if (proofReferenceFile) {
            (0, fs_1.writeFileSync)(proofReferenceFile, proofRef.to_json());
        }
        else {
            console.log(proofRef.to_json());
        }
    },
});
//# sourceMappingURL=computeProofRef.js.map