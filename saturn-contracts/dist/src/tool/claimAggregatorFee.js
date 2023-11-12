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
exports.claimAggregatorFee = void 0;
const cmd_ts_1 = require("cmd-ts");
const options = __importStar(require("./options"));
const config = __importStar(require("./config"));
const ethers = __importStar(require("ethers"));
exports.claimAggregatorFee = (0, cmd_ts_1.command)({
    name: "claim-aggregator-fee",
    args: {
        endpoint: options.endpoint(),
        keyfile: options.keyfile(),
        password: options.password(),
        instance: options.instance(),
        wait: options.wait(),
        estimateGas: options.estimateGas(),
        dumpTx: options.dumpTx(),
        maxFeePerGasGwei: options.maxFeePerGasGwei(),
    },
    description: "Claims the allocated aggregator fee in Saturn's fee model contract",
    handler: async function ({ endpoint, keyfile, password, instance, wait, estimateGas, dumpTx, maxFeePerGasGwei, }) {
        const provider = new ethers.JsonRpcProvider(endpoint);
        const wallet = await config.loadWallet(keyfile, options.getPassword(password), provider);
        const { verifier: verifier } = config.saturnFromInstanceFile(instance, wallet);
        const txReq = await verifier.claimAggregatorFee.populateTransaction();
        await config.handleTxRequest(wallet, txReq, estimateGas, dumpTx, wait, maxFeePerGasGwei);
    },
});
//# sourceMappingURL=claimAggregatorFee.js.map