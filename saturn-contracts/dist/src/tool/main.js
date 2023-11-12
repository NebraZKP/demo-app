#!/usr/bin/env node
"use strict";
// -*- typescript -*-
Object.defineProperty(exports, "__esModule", { value: true });
const cmd_ts_1 = require("cmd-ts");
const deploy_1 = require("./deploy");
const local_1 = require("./local");
const computeCircuitId_1 = require("./computeCircuitId");
const dummyWorker_1 = require("./dummyWorker");
const registerVK_1 = require("./registerVK");
const stats_1 = require("./stats");
const submitProof_1 = require("./submitProof");
const submitProofs_1 = require("./submitProofs");
const submitAggregatedProof_1 = require("./submitAggregatedProof");
const computeFinalDigest_1 = require("./computeFinalDigest");
const convertVK_1 = require("./convertVK");
const monitor_1 = require("./monitor");
const genStandardJsonInput_1 = require("./genStandardJsonInput");
const computeProofId_1 = require("./computeProofId");
const isVerified_1 = require("./isVerified");
const allocateAggregatorFee_1 = require("./allocateAggregatorFee");
const claimAggregatorFee_1 = require("./claimAggregatorFee");
const submissionFromTx_1 = require("./submissionFromTx");
const computeProofRef_1 = require("./computeProofRef");
const computeSubmissionProof_1 = require("./computeSubmissionProof");
const root = (0, cmd_ts_1.subcommands)({
    name: "saturn",
    cmds: {
        "allocate-aggregator-fee": allocateAggregatorFee_1.allocateAggregatorFee,
        "claim-aggregator-fee": claimAggregatorFee_1.claimAggregatorFee,
        local: local_1.local,
        deploy: deploy_1.deploy,
        registervk: registerVK_1.registervk,
        convertvk: convertVK_1.convertvk,
        stats: stats_1.stats,
        "submit-proof": submitProof_1.submitProof,
        "submit-proofs": submitProofs_1.submitProofs,
        genstandardjsoninput: genStandardJsonInput_1.genstandardjsoninput,
        "compute-circuitid": computeCircuitId_1.computecircuitid,
        "submit-aggregated-proof": submitAggregatedProof_1.submitAggregatedProof,
        "compute-final-digest": computeFinalDigest_1.computeFinalDigest,
        monitor: monitor_1.monitor,
        events: monitor_1.events,
        "event-counts": monitor_1.eventCounts,
        "compute-proof-id": computeProofId_1.computeProofId,
        "compute-proof-ids": computeProofId_1.computeProofIds,
        "is-verified": isVerified_1.isVerified,
        "submission-from-tx": submissionFromTx_1.submissionFromTx,
        "compute-proof-ref": computeProofRef_1.computeProofRef,
        "compute-submission-proof": computeSubmissionProof_1.computeSubmissionProof,
        "dummy-worker": dummyWorker_1.dummyWorker,
    },
});
(0, cmd_ts_1.run)(root, process.argv.slice(2));
//# sourceMappingURL=main.js.map