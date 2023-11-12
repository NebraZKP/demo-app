"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VKRegisteredEventGetter = exports.ProofVerifiedEventGetter = exports.ProofSubmittedEventGetter = exports.EventGetter = void 0;
const assert_1 = require("assert");
/// Base class to query the chain for specific events.
class EventGetter {
    constructor(saturn, filter) {
        this.saturn = saturn;
        this.filter = filter;
    }
    // Get the event log with typechain wrapper
    async get(startBlock, endBlock) {
        return this.saturn.queryFilter(this.filter, startBlock, endBlock);
    }
    // Get the parsed event data
    async getFull(startBlock, endBlock) {
        const logs = await this.get(startBlock, endBlock);
        return logs.map((log) => {
            return {
                blockNumber: log.blockNumber,
                txHash: log.transactionHash,
                event: this.parseEvent(log),
            };
        });
    }
    // Get parsed events, grouped by transaction.
    async getFullGroupedByTransaction(startBlock, endBlock) {
        const logs = await this.get(startBlock, endBlock);
        if (logs.length === 0) {
            return [];
        }
        const output = [];
        let curSet = {
            txHash: logs[0].transactionHash,
            blockNumber: logs[0].blockNumber,
            events: [],
        };
        logs.forEach((log) => {
            const txHash = log.transactionHash;
            if (txHash !== curSet.txHash) {
                // New batch.  Push the current one and reset.
                (0, assert_1.strict)(curSet.events.length != 0);
                output.push(curSet);
                curSet = {
                    txHash,
                    blockNumber: log.blockNumber,
                    events: [],
                };
            }
            else {
                (0, assert_1.strict)(log.blockNumber == curSet.blockNumber);
            }
            curSet.events.push(this.parseEvent(log));
        });
        // Should always be a curGroup left over.
        (0, assert_1.strict)(curSet.events.length != 0);
        output.push(curSet);
        return output;
    }
}
exports.EventGetter = EventGetter;
/// Specialized version of EventGetter for ProofSubmitted events.
class ProofSubmittedEventGetter extends EventGetter {
    constructor(saturn, ...args) {
        super(saturn, saturn.filters.ProofSubmitted(...args));
    }
    parseEvent(ev) {
        const args = ev.args;
        return {
            circuitId: args.circuitId,
            proofId: args.proofId,
            submissionIdx: args.submissionIdx,
            proofIdx: args.proofIdx,
            proof: args.proof,
            publicInputs: args.publicInputs,
        };
    }
}
exports.ProofSubmittedEventGetter = ProofSubmittedEventGetter;
/// Specialized version of EventGetter for ProofVerified events.
class ProofVerifiedEventGetter extends EventGetter {
    constructor(saturn, ...args) {
        super(saturn, saturn.filters.ProofVerified(...args));
    }
    parseEvent(ev) {
        const args = ev.args;
        return {
            proofId: args.proofId,
        };
    }
}
exports.ProofVerifiedEventGetter = ProofVerifiedEventGetter;
/// Specialized version of EventGetter for ProofSubmitted events.
class VKRegisteredEventGetter extends EventGetter {
    constructor(saturn) {
        super(saturn, saturn.filters.VKRegistered());
    }
    parseEvent(ev) {
        const args = ev.args;
        return {
            circuitId: args.circuitId,
            vk: args.vk,
        };
    }
}
exports.VKRegisteredEventGetter = VKRegisteredEventGetter;
//# sourceMappingURL=events.js.map