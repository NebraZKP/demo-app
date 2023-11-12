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
exports.registervk = void 0;
const cmd_ts_1 = require("cmd-ts");
const options_1 = require("./options");
const config_1 = require("./config");
const index_1 = require("../index");
const log = __importStar(require("../sdk/log"));
const ethers = __importStar(require("ethers"));
exports.registervk = (0, cmd_ts_1.command)({
    name: "registervk",
    description: "Register a verifying key with Saturn",
    args: {
        endpoint: (0, options_1.endpoint)(),
        keyfile: (0, options_1.keyfile)(),
        password: (0, options_1.password)(),
        instance: (0, options_1.instance)(),
        wait: (0, options_1.wait)(),
        vkFile: (0, cmd_ts_1.option)({
            type: cmd_ts_1.string,
            long: "vk-file",
            short: "v",
            description: "Verifying key file",
        }),
    },
    handler: async function ({ endpoint, keyfile, password, instance, wait, vkFile, }) {
        const vk = index_1.utils.loadAppVK(vkFile);
        const provider = new ethers.JsonRpcProvider(endpoint);
        const wallet = await (0, config_1.loadWallet)(keyfile, (0, options_1.getPassword)(password), provider);
        const saturn = (0, config_1.saturnFromInstanceFile)(instance, wallet);
        const tx = await saturn.proofReceiver.registerVK(vk.solidity());
        log.info(tx.hash);
        console.log(tx.hash);
        if (wait) {
            await tx.wait();
        }
    },
});
//# sourceMappingURL=registerVK.js.map