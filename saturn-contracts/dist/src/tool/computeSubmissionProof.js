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
exports.computeSubmissionProof = void 0;
const cmd_ts_1 = require("cmd-ts");
const options = __importStar(require("./options"));
const fs_1 = require("fs");
const submission_1 = require("../sdk/submission");
exports.computeSubmissionProof = (0, cmd_ts_1.command)({
    name: "compute-submission-proof",
    args: {
        submissionFile: options.submissionFile(),
        startIdx: (0, cmd_ts_1.option)({
            type: cmd_ts_1.number,
            long: "start-idx",
            short: "s",
            description: "Start index of proofs within the submission",
        }),
        numProofs: (0, cmd_ts_1.option)({
            type: cmd_ts_1.number,
            long: "num-proofs",
            short: "n",
            description: "Number of proofs to include in the SubmissionProof",
        }),
    },
    description: "Compute ProofReference for proof at given index within submission",
    handler: async function ({ submissionFile, startIdx, numProofs, }) {
        const submission = submission_1.Submission.from_json((0, fs_1.readFileSync)(submissionFile, "ascii"));
        const submissionProof = submission.computeSubmissionProof(startIdx, numProofs);
        if (!submissionProof) {
            console.log("SubmissionProof not required");
            return;
        }
        console.log(submissionProof.to_json());
    },
});
//# sourceMappingURL=computeSubmissionProof.js.map