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
exports.dummyWorker = void 0;
const cmd_ts_1 = require("cmd-ts");
const options = __importStar(require("./options"));
const ethers = __importStar(require("ethers"));
const events_1 = require("../sdk/events");
const index_1 = require("../index");
const config = __importStar(require("./config"));
const assert_1 = require("assert");
const submission_1 = require("../sdk/submission");
exports.dummyWorker = (0, cmd_ts_1.command)({
    name: "dummy-worker",
    args: {
        batchSize: (0, cmd_ts_1.option)({
            type: cmd_ts_1.number,
            long: "batch-size",
            defaultValue: () => 4,
            description: "Target batch size for aggregated proofs",
        }),
        maxWaitTime: (0, cmd_ts_1.option)({
            type: cmd_ts_1.number,
            long: "max-wait-time",
            defaultValue: () => 10,
            description: "Time (sec) worker waits before submitting partial batch",
        }),
        endpoint: options.endpoint(),
        keyfile: options.keyfile(),
        password: options.password(),
        instance: options.instance(),
        verbose: (0, cmd_ts_1.flag)({
            type: cmd_ts_1.boolean,
            long: "verbose",
            short: "v",
            description: "Output extra information (primarily for debugging).",
        }),
    },
    description: "Listens for ProofSubmitted events, submits dummy aggregated proofs",
    handler: async function ({ batchSize, maxWaitTime, endpoint, instance, keyfile, password, verbose, }) {
        const provider = new ethers.JsonRpcProvider(endpoint);
        const wallet = await config.loadWallet(keyfile, options.getPassword(password), provider);
        let nonce = await wallet.getNonce();
        const saturnInstance = config.saturnFromInstanceFile(instance, wallet);
        // TODO: Make sure not to repeat already verified proofs from this block
        // (Only an issue in situations where another worker could have previously
        // submitted a batch)
        const startBlock = Number(await saturnInstance.verifier.lastVerifiedSubmissionHeight());
        let lastBlockSeen = startBlock;
        const maxBlockPerQuery = 2;
        // Event getter
        const submittedEventGetter = new events_1.ProofSubmittedEventGetter(saturnInstance.proofReceiver);
        let submissionQueue = [];
        const maxWaitTimeMillis = 1000 * maxWaitTime;
        let submitIntervalId = null;
        // Start or restart an interval to submit a batch every
        // maxWaitTime seconds
        function resetInterval() {
            if (submitIntervalId !== null) {
                clearInterval(submitIntervalId);
            }
            submitIntervalId = setInterval(async () => {
                if (submissionQueue.length) {
                    if (verbose) {
                        console.log(`submitting batch to respect max. wait time. 
              Batch size: ${submissionQueue.length}`);
                    }
                    await submitBatchFromQueue();
                }
            }, maxWaitTimeMillis);
        }
        resetInterval();
        // TODO: Currently always aggregates entire submissions. Add ability
        // to start/end batch in the middle of a submission
        async function submitBatchFromQueue() {
            (0, assert_1.strict)(submissionQueue.length);
            const batch = submissionQueue.slice(0, batchSize);
            submissionQueue = submissionQueue.slice(batchSize);
            await submitBatch(batch, saturnInstance, verbose, { nonce: nonce++ });
        }
        for (;;) {
            const blockNum = await provider.getBlockNumber();
            const endBlock = Math.min(blockNum, lastBlockSeen + maxBlockPerQuery);
            if (endBlock > lastBlockSeen) {
                const startBlock = lastBlockSeen + 1;
                // Pull any events
                const newEvents = await submittedEventGetter.getFullGroupedByTransaction(startBlock, endBlock);
                const submissions = newEvents.map((eventSet) => {
                    return submission_1.Submission.fromSubmittedEvents(eventSet);
                });
                if (verbose && submissions.length) {
                    submissions.map((submission) => {
                        console.log(`Queued submissionId: ${submission.submissionId}`);
                    });
                }
                submissionQueue.push(...submissions);
                while (submissionQueue.length >= batchSize) {
                    if (verbose) {
                        console.log(`Creating aggregated batch when queue` +
                            `has length ${submissionQueue.length}`);
                    }
                    await submitBatchFromQueue();
                    if (verbose) {
                        console.log(`After submission queue has length ${submissionQueue.length}`);
                    }
                    resetInterval();
                }
                lastBlockSeen = endBlock;
            }
            // Wait 1 sec
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    },
});
async function submitBatch(batch, saturnInstance, verbose, options) {
    if (verbose) {
        console.log(`batch.length: ${batch.length}`);
    }
    // Compute the finalDigest
    const proofIds = batch.flatMap((submission) => submission.proofIds);
    const finalDigest = await saturnInstance.proofReceiver.computeFinalDigest(proofIds);
    // Compute the submission calldata
    const fieldElements = await saturnInstance.proofReceiver.digestAsFieldElements(finalDigest);
    const fe0 = index_1.utils.bigintToBytes32(fieldElements[0]);
    const fe1 = index_1.utils.bigintToBytes32(fieldElements[1]);
    const padding = index_1.utils.bigintToBytes32(7n);
    // dummy calldata consists of 12 Fr elements followed by the final
    // digest decomposed into two field elements.  See,
    // `prover::outer::prove::do_prove_dry_run`.
    const calldata = new Uint8Array([
        ...padding,
        ...padding,
        ...padding,
        ...padding,
        ...padding,
        ...padding,
        ...padding,
        ...padding,
        ...padding,
        ...padding,
        ...padding,
        ...padding,
        ...fe0,
        ...fe1,
    ]);
    const submissionProofs = batch
        .map((submission) => submission.computeSubmissionProof(0, submission.proofs.length))
        .filter((proof) => proof);
    // Submit aggregated proof
    await saturnInstance.verifier.verifyAggregatedProof(calldata, proofIds, submissionProofs, options || {});
    if (verbose) {
        console.log(`Submitted aggregated proof for proofIds: ${proofIds}`);
    }
}
//# sourceMappingURL=dummyWorker.js.map