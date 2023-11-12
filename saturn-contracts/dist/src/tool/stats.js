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
exports.stats = void 0;
const cmd_ts_1 = require("cmd-ts");
const config_1 = require("./config");
const options_1 = require("./options");
const index_1 = require("../index");
const ethers = __importStar(require("ethers"));
const assert_1 = require("assert");
const typechain_types_1 = require("../../typechain-types");
exports.stats = (0, cmd_ts_1.command)({
    name: "stats",
    args: {
        endpoint: (0, options_1.endpoint)(),
        instance: (0, options_1.instance)(),
        listCircuits: (0, cmd_ts_1.flag)({
            type: cmd_ts_1.boolean,
            long: "circuits",
            short: "c",
            defaultValue: () => false,
            description: "List the registered circuit IDs",
        }),
        showvks: (0, cmd_ts_1.flag)({
            type: cmd_ts_1.boolean,
            long: "show-vks",
            short: "s",
            defaultValue: () => false,
            description: "Include VK in circuit info",
        }),
    },
    description: "Query the Saturn contract state",
    handler: async function ({ endpoint, instance, listCircuits, showvks, }) {
        const provider = new ethers.JsonRpcProvider(endpoint);
        const { proofReceiver, verifier, feeModel } = (0, config_1.saturnFromInstanceFile)(instance, provider);
        const blockNumberP = provider.getBlockNumber();
        const nextSubmissionIdxP = proofReceiver.nextSubmissionIdx();
        const nextSubmissionIdxToVerifyP = verifier.nextSubmissionIdxToVerify();
        const lastVerifiedSubmissionHeightP = verifier.lastVerifiedSubmissionHeight();
        const { cids, vks } = await (async () => {
            if (!listCircuits && !showvks) {
                return { cids: undefined, vks: undefined };
            }
            const circuitIdsP = proofReceiver.getCircuitIds();
            let cids = undefined;
            let vks = undefined;
            if (showvks) {
                vks = {};
                await Promise.all((await circuitIdsP).map(async (cid) => {
                    const cidStr = "0x" + cid.toString(16);
                    const vk = await proofReceiver.getVK(cid);
                    (0, assert_1.strict)(vks);
                    vks[cidStr] = vk;
                }));
            }
            if (listCircuits) {
                cids = (await circuitIdsP).map((cid) => {
                    return "0x" + cid.toString(16);
                });
            }
            return { vks, cids };
        })();
        const allocatedFee = await feeModel.feeAllocated(await verifier.worker());
        const totalFees = await provider.getBalance(feeModel);
        // If the fee model is the the Saturn fixed fee contract,
        // we return the verified proof index for allocated fee
        const saturnFixedFee = typechain_types_1.SaturnFixedFee__factory.connect(await feeModel.getAddress()).connect(provider);
        let verifiedProofIdxForAllocatedFee;
        try {
            verifiedProofIdxForAllocatedFee =
                await saturnFixedFee.verifiedProofIdxForAllocatedFee();
        }
        catch {
            verifiedProofIdxForAllocatedFee = undefined;
        }
        const output = {
            blockNumber: await blockNumberP,
            nextSubmissionIdxToVerify: await nextSubmissionIdxToVerifyP,
            lastVerifiedSubmissionHeight: await lastVerifiedSubmissionHeightP,
            nextSubmissionIdx: await nextSubmissionIdxP,
            numPendingSubmissions: (await nextSubmissionIdxP) - (await nextSubmissionIdxToVerifyP),
            circuitIds: cids,
            verificationKeys: vks,
            allocatedFee,
            totalFees,
            verifiedProofIdxForAllocatedFee,
        };
        // Print this to stdout, NOT the log, so it can be consumed by scripts.
        console.log(index_1.utils.JSONstringify(output, 2));
    },
});
//# sourceMappingURL=stats.js.map