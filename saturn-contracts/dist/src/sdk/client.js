"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionHandle = exports.SaturnClient = void 0;
const saturn_1 = require("./saturn");
const config_1 = require("../tool/config");
// TODO: Add multi-proof submission function `submitProofs`.
class SaturnClient {
    constructor(saturnInstanceFile, wallet) {
        this.wallet = wallet;
        this.saturnInstance = (0, config_1.saturnFromInstanceFile)(saturnInstanceFile, wallet);
    }
    async submitProof(circuitId, proof, publicInputs, options) {
        const txResponse = await (0, saturn_1.submitProof)(this.saturnInstance.proofReceiver, circuitId, proof, publicInputs, options);
        const proofId = await this.saturnInstance.proofReceiver.computeProofId(circuitId, publicInputs);
        console.log(`https://sepolia.nebrascan.io/proofId/${proofId}`);
        return new SubmissionHandle(proofId, txResponse);
    }
    async waitForProofVerified(submissionHandle, progress) {
        const txReceipt = await submissionHandle.txResponse.wait();
        if (!txReceipt) {
            throw new Error(`Null TransactionReceipt`);
        }
        await (0, saturn_1.waitForProofVerified)(this.saturnInstance, txReceipt, submissionHandle.proofId, progress);
    }
}
exports.SaturnClient = SaturnClient;
class SubmissionHandle {
    constructor(proofId, txResponse) {
        this.proofId = proofId;
        this.txResponse = txResponse;
    }
}
exports.SubmissionHandle = SubmissionHandle;
//# sourceMappingURL=client.js.map