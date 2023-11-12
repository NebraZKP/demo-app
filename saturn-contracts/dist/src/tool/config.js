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
exports.handleTxRequest = exports.loadWallet = exports.saturnFromInstanceFile = exports.loadInstance = void 0;
const index_1 = require("../index");
const log = __importStar(require("../sdk/log"));
const saturn_1 = require("../sdk/saturn");
const ethers = __importStar(require("ethers"));
const fs = __importStar(require("fs"));
const assert_1 = require("assert");
/// Load an instance descriptor file
function loadInstance(instanceFile) {
    return JSON.parse(fs.readFileSync(instanceFile, "ascii"));
}
exports.loadInstance = loadInstance;
/// Load an instance descriptor file and initialize and instance.  Optionally
/// connect to an ethers.Provider or etheres.Signer.
function saturnFromInstanceFile(instanceFile, provider) {
    const instanceDesc = loadInstance(instanceFile);
    return (0, saturn_1.saturnInstanceFromDescriptor)(instanceDesc, provider);
}
exports.saturnFromInstanceFile = saturnFromInstanceFile;
/// Create a Signer from an encrypted keyfile.
async function loadWallet(keyfile, password, provider) {
    const keystoreStr = fs.readFileSync(keyfile, "ascii");
    let wallet = await ethers.Wallet.fromEncryptedJson(keystoreStr, password);
    if (provider) {
        wallet = wallet.connect(provider);
    }
    return wallet;
}
exports.loadWallet = loadWallet;
/// Consistent handling of txs over multiple commands.  If estimateGas is
/// true, print the gas and exit.  Otherwise, if dumpTx is true, write out the
/// Tx JSON and exit, otherwise sign and send the tx, optionally waiting for
/// it to be accepted.
async function handleTxRequest(wallet, txReq, estimateGas, dumpTx, wait, maxFeePerGasGwei = undefined) {
    if (maxFeePerGasGwei) {
        txReq.maxFeePerGas = ethers.parseUnits(maxFeePerGasGwei.toString(), "gwei");
    }
    const populatedTx = await wallet.populateTransaction(txReq);
    const provider = wallet.provider;
    (0, assert_1.strict)(provider);
    if (estimateGas) {
        (0, assert_1.strict)(!dumpTx, "--dump-tx should not be used with --estimate-gas");
        (0, assert_1.strict)(!wait, "--dump-tx should not be used with --wait");
        const gas = await provider.estimateGas(populatedTx);
        console.log(`${gas} gas`);
        return;
    }
    if (dumpTx) {
        console.log(index_1.utils.JSONstringify(populatedTx));
        return;
    }
    const signedTx = await wallet.signTransaction(populatedTx);
    const tx = await provider.broadcastTransaction(signedTx);
    console.log(tx.hash);
    log.info(tx.hash);
    if (wait) {
        log.debug("waiting ...");
        await tx.wait();
    }
}
exports.handleTxRequest = handleTxRequest;
//# sourceMappingURL=config.js.map