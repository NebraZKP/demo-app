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
exports.monitor = exports.eventCounts = exports.events = void 0;
const cmd_ts_1 = require("cmd-ts");
const events_1 = require("../sdk/events");
const config_1 = require("./config");
const utils = __importStar(require("../sdk/utils"));
const options_1 = require("./options");
const ethers = __importStar(require("ethers"));
const assert_1 = require("assert");
const fs = __importStar(require("fs"));
/// Number of blocks to compute rates over
const DEFAULT_BLOCK_DEPTH = 5;
/// Track events by block over some window and compute the rate per second.
class RateTracker {
    constructor(provider, blockDepth, verbose) {
        this.provider = provider;
        this.blockDepth = blockDepth;
        this.verbose = verbose;
        this.earliestBlockSeen = 0;
        this.lastBlockSeen = 0;
        this.counts = [];
    }
    addEvent(blockNumber) {
        const counts = this.counts;
        const numBlocks = counts.length;
        if (numBlocks == 0) {
            counts.push({ blockNumber, count: 1 });
            return;
        }
        const latest = counts[numBlocks - 1];
        if (this.verbose) {
            console.log(`  RateTracker.addEvent: blockNumber: ${blockNumber}`);
        }
        (0, assert_1.strict)(blockNumber >= latest.blockNumber);
        if (blockNumber > latest.blockNumber) {
            counts.push({ blockNumber, count: 1 });
        }
        else {
            latest.count++;
        }
    }
    seenBlock(blockNumber) {
        const counts = this.counts;
        if (counts.length == 0) {
            counts.push({ blockNumber, count: 0 });
        }
        const latest = counts[this.counts.length - 1];
        (0, assert_1.strict)(blockNumber >= latest.blockNumber);
        if (blockNumber > latest.blockNumber) {
            counts.push({ blockNumber, count: 0 });
        }
        this.removeOld();
    }
    async getRate() {
        const counts = this.counts;
        const numBlocks = counts.length;
        (0, assert_1.strict)(numBlocks <= this.blockDepth);
        if (this.verbose) {
            console.log(`  RateTracker.addEvent: counts: ${JSON.stringify(counts)}`);
        }
        if (numBlocks < 2) {
            return 0.0;
        }
        const firstBlockNum = counts[0].blockNumber;
        const lastBlockNum = counts[numBlocks - 1].blockNumber;
        const firstBlockP = this.provider.getBlock(firstBlockNum);
        const lastBlockP = this.provider.getBlock(lastBlockNum);
        // Count proofs (skip first block) while waiting
        let count = 0;
        for (let i = 1; i < numBlocks; ++i) {
            count += counts[i].count;
        }
        const firstBlockTime = (await firstBlockP).timestamp;
        const lastBlockTime = (await lastBlockP).timestamp;
        const rate = count / (lastBlockTime - firstBlockTime);
        if (this.verbose) {
            console.log(`  RateTracker.getRate(): firstBlockTime: ${firstBlockTime} ` +
                `(${firstBlockNum})`);
            console.log(`  RateTracker.getRate(): lastBlockTime: ${lastBlockTime} ` +
                `(${lastBlockNum})`);
            console.log(`  RateTracker.getRate(): count: ${count}`);
        }
        return rate;
    }
    removeOld() {
        const counts = this.counts;
        while (counts.length > this.blockDepth) {
            this.counts.shift();
        }
        (0, assert_1.strict)(this.counts.length <= this.blockDepth);
    }
}
/// Record the number of events per block.
class EventCounter {
    constructor(provider, verbose = false) {
        this.provider = provider;
        this.verbose = verbose;
        this.counts = [];
    }
    addEvent(blockNumber) {
        const counts = this.counts;
        const numBlocks = counts.length;
        if (numBlocks == 0) {
            counts.push({ blockNumber, count: 1 });
            return;
        }
        const latest = counts[numBlocks - 1];
        if (this.verbose) {
            console.log(`  EventCounter.addEvent: blockNumber: ${blockNumber}`);
        }
        (0, assert_1.strict)(blockNumber >= latest.blockNumber);
        if (blockNumber > latest.blockNumber) {
            counts.push({ blockNumber, count: 1 });
        }
        else {
            latest.count++;
        }
    }
    getCounts() {
        return this.counts;
    }
}
exports.events = (0, cmd_ts_1.command)({
    name: "events",
    args: {
        endpoint: (0, options_1.endpoint)(),
        instance: (0, options_1.instance)(),
        startBlock: (0, cmd_ts_1.option)({
            type: (0, cmd_ts_1.optional)(cmd_ts_1.number),
            long: "start-block",
        }),
        endBlock: (0, cmd_ts_1.option)({
            type: (0, cmd_ts_1.optional)(cmd_ts_1.number),
            long: "end-block",
        }),
        maxBlockPerQuery: (0, cmd_ts_1.option)({
            type: cmd_ts_1.number,
            long: "max-blocks-per-query",
            defaultValue: () => 2000,
        }),
        // TODO: add support - potentially non-trivial without streaming
        // outputFile: option({
        //   type: optional(string),
        //   long: "output-file",
        // }),
    },
    description: "Dump ProofVerified events across a block range",
    handler: async function ({ endpoint, instance, startBlock, endBlock, maxBlockPerQuery, }) {
        const provider = new ethers.JsonRpcProvider(endpoint);
        const saturn = (0, config_1.saturnFromInstanceFile)(instance, provider);
        // Event getters
        const verifiedEventGetter = new events_1.ProofVerifiedEventGetter(saturn.verifier);
        // If startBlock is not given, pull blockDepth blocks (including the
        // newest block).
        startBlock = startBlock ? startBlock : 0;
        endBlock = endBlock
            ? endBlock
            : (await provider.getBlockNumber()) || startBlock;
        let curBlock = startBlock;
        // Main loop
        while (curBlock <= endBlock) {
            const lastBlock = Math.min(endBlock, curBlock + maxBlockPerQuery - 1);
            // console.log(`Blocks [${curBlock},${lastBlock}]`);
            const evs = await verifiedEventGetter.getFull(curBlock, lastBlock);
            console.log(utils.JSONstringify(evs));
            curBlock = lastBlock + 1;
        }
    },
});
exports.eventCounts = (0, cmd_ts_1.command)({
    name: "eventCounts",
    args: {
        endpoint: (0, options_1.endpoint)(),
        instance: (0, options_1.instance)(),
        startBlock: (0, cmd_ts_1.option)({
            type: (0, cmd_ts_1.optional)(cmd_ts_1.number),
            long: "start-block",
        }),
        endBlock: (0, cmd_ts_1.option)({
            type: (0, cmd_ts_1.optional)(cmd_ts_1.number),
            long: "end-block",
        }),
        maxBlockPerQuery: (0, cmd_ts_1.option)({
            type: cmd_ts_1.number,
            long: "max-blocks-per-query",
            defaultValue: () => 2000,
        }),
        outputFile: (0, cmd_ts_1.option)({
            type: (0, cmd_ts_1.optional)(cmd_ts_1.string),
            long: "output-file",
        }),
    },
    description: "Dump per-block ProofVerifiedEventGetter event counts over a block range",
    handler: async function ({ endpoint, instance, startBlock, endBlock, maxBlockPerQuery, outputFile, }) {
        const provider = new ethers.JsonRpcProvider(endpoint);
        const saturn = (0, config_1.saturnFromInstanceFile)(instance, provider);
        // Event getters
        const verifiedEventGetter = new events_1.ProofVerifiedEventGetter(saturn.verifier);
        // If startBlock is not given, pull blockDepth blocks (including the
        // newest block).
        startBlock = startBlock ? startBlock : 0;
        endBlock = endBlock
            ? endBlock
            : (await provider.getBlockNumber()) || startBlock;
        const counter = new EventCounter(provider);
        let curBlock = startBlock;
        // Main loop
        while (curBlock <= endBlock) {
            const lastBlock = Math.min(endBlock, curBlock + maxBlockPerQuery - 1);
            console.log(`Blocks [${curBlock},${lastBlock}]`);
            const evs = await verifiedEventGetter.get(curBlock, lastBlock);
            evs.forEach((ev) => {
                counter.addEvent(ev.blockNumber);
            });
            curBlock = lastBlock + 1;
        }
        // Write the JSON file to disk
        if (outputFile) {
            fs.writeFileSync(outputFile, utils.JSONstringify(counter.getCounts()));
        }
        else {
            console.log(utils.JSONstringify(counter.getCounts()));
        }
    },
});
exports.monitor = (0, cmd_ts_1.command)({
    name: "monitor",
    args: {
        endpoint: (0, options_1.endpoint)(),
        instance: (0, options_1.instance)(),
        startBlock: (0, cmd_ts_1.option)({
            type: (0, cmd_ts_1.optional)(cmd_ts_1.number),
            long: "start-block",
        }),
        maxBlockPerQuery: (0, cmd_ts_1.option)({
            type: (0, cmd_ts_1.optional)(cmd_ts_1.number),
            long: "max-blocks-per-query",
        }),
        interval: (0, cmd_ts_1.option)({
            type: cmd_ts_1.number,
            long: "interval",
            defaultValue: () => 5.0,
            description: "Interval (in seconds) to query (default: 5.0)",
        }),
        blockDepth: (0, cmd_ts_1.option)({
            type: cmd_ts_1.number,
            long: "block-depth",
            defaultValue: () => DEFAULT_BLOCK_DEPTH,
            description: "Num blocks to compute rates over " +
                `(default: ${DEFAULT_BLOCK_DEPTH})`,
        }),
        verbose: (0, cmd_ts_1.flag)({
            type: cmd_ts_1.boolean,
            long: "verbose",
            short: "v",
            description: "Output extra information (primarily for debugging).",
        }),
    },
    description: "Monitor the saturn contract state",
    handler: async function ({ endpoint, instance, startBlock, maxBlockPerQuery, interval, blockDepth, verbose, }) {
        const provider = new ethers.JsonRpcProvider(endpoint);
        const saturn = (0, config_1.saturnFromInstanceFile)(instance, provider);
        // Event getters
        const submittedEventGetter = new events_1.ProofSubmittedEventGetter(saturn.proofReceiver);
        const verifiedEventGetter = new events_1.ProofVerifiedEventGetter(saturn.verifier);
        maxBlockPerQuery = maxBlockPerQuery || 2000;
        // If startBlock is not given, pull blockDepth blocks (including the
        // newest block).
        let lastBlockSeen = startBlock
            ? startBlock - 1
            : (await provider.getBlockNumber()) - blockDepth;
        // Rate counters
        const submittedRateTracker = new RateTracker(provider, blockDepth, verbose);
        const verifiedRateTracker = new RateTracker(provider, blockDepth, verbose);
        async function showRate() {
            const submitRateP = submittedRateTracker.getRate();
            const verifyRateP = verifiedRateTracker.getRate();
            console.log(`RATE: (block ${lastBlockSeen}) submit: ${await submitRateP} ` +
                `proofs/s, verify: ${await verifyRateP} proofs/s`);
        }
        // Main loop
        for (;;) {
            const blockNum = await provider.getBlockNumber();
            const endBlock = Math.min(blockNum, lastBlockSeen + maxBlockPerQuery);
            if (verbose) {
                console.log(`  MAIN: blockNum: ${blockNum}, curBlock: ${endBlock}, ` +
                    `lastBlock: ${startBlock}`);
            }
            if (endBlock > lastBlockSeen) {
                const startBlock = lastBlockSeen + 1;
                let submittedEvents;
                let verifiedEvents;
                // Pull any events
                try {
                    [submittedEvents, verifiedEvents] = await Promise.all([
                        submittedEventGetter.get(startBlock, endBlock),
                        verifiedEventGetter.get(startBlock, endBlock),
                    ]);
                }
                catch (e) {
                    console.warn(`  MAIN: error getting events: ${e}`);
                    await new Promise((r) => setTimeout(r, 1000));
                    continue;
                }
                // TODO: Here we post events one-at-a-time to the counters.  If we
                // have only queried for a single block, we could just pass the number
                // of events to the counters.
                if (verbose) {
                    console.log(`submittedEvents: ${submittedEvents}`);
                    console.log(`verifiedEvents: ${verifiedEvents}`);
                }
                // Add events to the counters
                if (submittedEvents.length) {
                    if (verbose) {
                        console.log(`  MAIN: Submitted: ${submittedEvents.length} in blocks ` +
                            `${startBlock}-${endBlock}`);
                    }
                    submittedEvents.forEach((ev) => {
                        submittedRateTracker.addEvent(ev.blockNumber);
                    });
                }
                if (verifiedEvents.length) {
                    if (verbose) {
                        console.log(`  MAIN: Verified: ${verifiedEvents.length} in blocks ` +
                            `${startBlock}-${endBlock}`);
                    }
                    verifiedEvents.forEach((ev) => {
                        verifiedRateTracker.addEvent(ev.blockNumber);
                    });
                }
                submittedRateTracker.seenBlock(endBlock);
                verifiedRateTracker.seenBlock(endBlock);
                lastBlockSeen = endBlock;
            }
            await showRate();
            await new Promise((r) => setTimeout(r, interval * 1000));
        }
    },
});
//# sourceMappingURL=monitor.js.map