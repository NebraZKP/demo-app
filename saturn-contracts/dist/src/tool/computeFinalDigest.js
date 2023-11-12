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
exports.computeFinalDigest = void 0;
const cmd_ts_1 = require("cmd-ts");
const options_1 = require("./options");
const config_1 = require("./config");
const index_1 = require("../index");
const ethers = __importStar(require("ethers"));
const log = __importStar(require("../sdk/log"));
const fs_1 = require("fs");
exports.computeFinalDigest = (0, cmd_ts_1.command)({
    name: "compute-final-digest",
    args: {
        endpoint: (0, options_1.endpoint)(),
        instance: (0, options_1.instance)(),
        proofIdsFile: (0, cmd_ts_1.option)({
            type: cmd_ts_1.string,
            long: "proof-ids-file",
            short: "i",
            description: "File containing proofIds of submitted proofs",
        }),
        calldataFile: (0, cmd_ts_1.option)({
            type: (0, cmd_ts_1.optional)(cmd_ts_1.string),
            long: "calldata-file",
            short: "p",
            description: "Write a fake calldata file",
        }),
    },
    description: "Compute the final digest for a batch of app proofs",
    handler: async function ({ endpoint, instance, proofIdsFile, calldataFile, }) {
        const proofIds = JSON.parse((0, fs_1.readFileSync)(proofIdsFile, "ascii"));
        const provider = new ethers.JsonRpcProvider(endpoint);
        const saturn = (0, config_1.saturnFromInstanceFile)(instance, provider);
        const finalDigest = await saturn.proofReceiver.computeFinalDigest(proofIds);
        console.log(finalDigest);
        if (calldataFile) {
            log.debug("writing calldata");
            const fieldElements = await saturn.proofReceiver.digestAsFieldElements(finalDigest);
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
            (0, fs_1.writeFileSync)(calldataFile, calldata);
        }
    },
});
//# sourceMappingURL=computeFinalDigest.js.map