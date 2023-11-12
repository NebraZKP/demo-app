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
exports.deploy = void 0;
const config_1 = require("./config");
const options_1 = require("./options");
const saturn_1 = require("../sdk/saturn");
const cmd_ts_1 = require("cmd-ts");
const typechain_types_1 = require("../../typechain-types");
const options = __importStar(require("./options"));
const ethers = __importStar(require("ethers"));
const fs = __importStar(require("fs"));
exports.deploy = (0, cmd_ts_1.command)({
    name: "deploy",
    args: {
        endpoint: (0, options_1.endpoint)(),
        keyfile: (0, options_1.keyfile)(),
        password: (0, options_1.password)(),
        instance: (0, options_1.instance)("Output file for instance information"),
        verifier_bin: (0, cmd_ts_1.option)({
            type: cmd_ts_1.string,
            long: "verifier",
            short: "v",
            description: "On-chain verifier binary",
        }),
        owner: (0, cmd_ts_1.option)({
            type: (0, cmd_ts_1.optional)(cmd_ts_1.string),
            long: "owner",
            short: "o",
            description: "Owner address (defaults to address of keyfile)",
        }),
        worker: (0, cmd_ts_1.option)({
            type: (0, cmd_ts_1.optional)(cmd_ts_1.string),
            long: "worker",
            short: "w",
            description: "Worker address (defaults to address of keyfile)",
        }),
        groth16VerifierAddress: (0, cmd_ts_1.option)({
            type: (0, cmd_ts_1.optional)(cmd_ts_1.string),
            long: "groth16",
            short: "g16",
            description: "Groth16 verifier address",
        }),
        proofReceiverAddress: (0, cmd_ts_1.option)({
            type: (0, cmd_ts_1.optional)(cmd_ts_1.string),
            long: "proof-receiver",
            short: "receiver",
            description: "Proof receiver contract address",
        }),
        feeModelAddress: (0, cmd_ts_1.option)({
            type: (0, cmd_ts_1.optional)(cmd_ts_1.string),
            long: "fee-model",
            description: "Fee model contract address",
        }),
        feeInWei: options.feeInWei(),
    },
    description: "Deploy the Saturn contracts for a given configuration",
    handler: async function ({ endpoint, keyfile, password, verifier_bin, instance, owner, worker, feeInWei, groth16VerifierAddress, proofReceiverAddress, feeModelAddress, }) {
        const provider = new ethers.JsonRpcProvider(endpoint);
        const wallet = await (0, config_1.loadWallet)(keyfile, (0, options_1.getPassword)(password), provider);
        let fixedFeePerProof;
        try {
            fixedFeePerProof = feeInWei ? ethers.getUint(feeInWei) : undefined;
        }
        catch (error) {
            console.log("Error while parsing the fee", error);
            throw error;
        }
        const groth16Verifier = groth16VerifierAddress
            ? await typechain_types_1.IGroth16Verifier__factory.connect(groth16VerifierAddress)
            : undefined;
        const proofReceiver = proofReceiverAddress
            ? await typechain_types_1.SaturnProofReceiver__factory.connect(proofReceiverAddress)
            : undefined;
        const feeModel = feeModelAddress
            ? await typechain_types_1.ISaturnFeeModel__factory.connect(feeModelAddress)
            : undefined;
        const saturnInstance = await (0, saturn_1.deploySaturn)(wallet, verifier_bin, groth16Verifier, owner, worker, proofReceiver, feeModel, fixedFeePerProof);
        fs.writeFileSync(instance, JSON.stringify(saturnInstance));
    },
});
//# sourceMappingURL=deploy.js.map