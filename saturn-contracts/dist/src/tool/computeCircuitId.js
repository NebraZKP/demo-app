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
exports.computecircuitid = void 0;
const cmd_ts_1 = require("cmd-ts");
const config_1 = require("./config");
const options_1 = require("./options");
const index_1 = require("../index");
const ethers = __importStar(require("ethers"));
exports.computecircuitid = (0, cmd_ts_1.command)({
    name: "computecircuitid",
    args: {
        endpoint: (0, options_1.endpoint)(),
        instance: (0, options_1.instance)(),
        vkFile: (0, cmd_ts_1.option)({
            type: cmd_ts_1.string,
            long: "vk-file",
            short: "v",
            description: "Verifying key file",
        }),
    },
    description: "Use the Saturn contract to compute the circuitId of a given VK",
    handler: async function ({ endpoint, instance, vkFile }) {
        const provider = new ethers.JsonRpcProvider(endpoint);
        const saturn = (0, config_1.saturnFromInstanceFile)(instance, provider);
        const vk = index_1.utils.loadAppVK(vkFile);
        const circuitId = await saturn.proofReceiver.computeCircuitId(vk);
        // Print this to stdout, NOT the log, so it can be consumed by scripts.
        console.log("0x" + circuitId.toString(16));
    },
});
//# sourceMappingURL=computeCircuitId.js.map