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
exports.waitForProofVerified = exports.submitProofs = exports.populateSubmitProofs = exports.submitProof = exports.populateSubmitProof = exports.updateOptions = exports.saturnInstanceFromDescriptor = exports.deploySaturn = exports.isVerifiedMulti = exports.isVerifiedSingle = void 0;
const utils = __importStar(require("./utils"));
const typechain_types_1 = require("../../typechain-types");
const assert_1 = require("assert");
const submission_1 = require("./submission");
const events_1 = require("./events");
/// Default fee in Wei.
const DEFAULT_FEE = 1n;
// Function lookup strings
exports.isVerifiedSingle = "isVerified(uint256,uint256[])";
exports.isVerifiedMulti = "isVerified(uint256,uint256[],(bytes32,bytes32[],uint16))";
/// Deploys the Saturn contract, with all dependencies.  `verifier_bin_file`
/// points to the hex representation of the verifier byte code (as output by
/// solidity). The address of `signer` is used by default for `owner` and
/// `worker` if they are not given.
async function deploySaturn(signer, verifier_bin_file, groth16Verifier, owner, worker, proofReceiver, feeModel, feeInWei) {
    const nonceP = signer.getNonce();
    const addr = await signer.getAddress();
    feeInWei = feeInWei || DEFAULT_FEE;
    owner = owner || addr;
    worker = worker || addr;
    let nonce = await nonceP;
    // Deploy the Aggregated proof Verifier
    const binVerifierAddrP = utils.deployBinaryContract(signer, verifier_bin_file, nonce);
    // TODO: deploy Poseidon in parallel with Verifier
    // Deploy the Poseidon dependency
    const poseidonAddrP = (async () => {
        const Poseidon = new typechain_types_1.Poseidon__factory(signer);
        const poseidon = await Poseidon.deploy({ nonce: ++nonce });
        await poseidon.waitForDeployment();
        return poseidon.getAddress();
    })();
    // If proofReceiver is not set, deploy a fresh one.
    const saturnProofReceiverP = (async () => {
        if (proofReceiver) {
            return proofReceiver;
        }
        const SaturnProofReceiverFactory = new typechain_types_1.SaturnProofReceiver__factory({ "contracts/Poseidon.sol:Poseidon": await poseidonAddrP }, signer);
        const saturnProofReceiver = await SaturnProofReceiverFactory.deploy(owner, {
            nonce: ++nonce,
        });
        await saturnProofReceiver.waitForDeployment();
        return saturnProofReceiver;
    })();
    // Determine groth16Verifier
    const groth16VerifierAddrP = (async () => {
        if (groth16Verifier) {
            return await groth16Verifier.getAddress();
        }
        // TODO: Deploy a verifier if one is not given.  For now we just reuse the
        // verifierAddr address.
        return binVerifierAddrP;
    })();
    // Deploy Saturn
    const SaturnVerifier = new typechain_types_1.SaturnVerifier__factory(signer);
    const saturnProofReceiver = await saturnProofReceiverP;
    const proofReceiverAddrP = saturnProofReceiver.getAddress();
    const verifier = await SaturnVerifier.deploy(owner, worker, saturnProofReceiver, await binVerifierAddrP, await groth16VerifierAddrP, { nonce: ++nonce });
    await verifier.waitForDeployment();
    const saturnVerifierAddr = await verifier.getAddress();
    // Deploy Fee Model
    const feeModelAddr = await (async () => {
        if (feeModel) {
            return feeModel.getAddress();
        }
        const SaturnFixedFeeFactory = new typechain_types_1.SaturnFixedFee__factory(signer);
        const saturnFixedFee = await SaturnFixedFeeFactory.deploy(owner, saturnVerifierAddr, feeInWei, { nonce: ++nonce });
        await saturnFixedFee.waitForDeployment();
        return saturnFixedFee.getAddress();
    })();
    await verifier.setFeeModel(feeModelAddr, { nonce: ++nonce });
    await saturnProofReceiver.setFeeModel(feeModelAddr, { nonce: ++nonce });
    // Return the instance data
    return {
        verifier: saturnVerifierAddr,
        proofReceiver: await proofReceiverAddrP,
        poseidon: await poseidonAddrP,
        aggregatedProofVerifier: await binVerifierAddrP,
        feeModel: feeModelAddr,
    };
}
exports.deploySaturn = deploySaturn;
function saturnInstanceFromDescriptor(instanceDescriptor, provider) {
    const instance = {
        verifier: typechain_types_1.SaturnVerifier__factory.connect(instanceDescriptor.verifier),
        proofReceiver: typechain_types_1.SaturnProofReceiver__factory.connect(instanceDescriptor.proofReceiver),
        feeModel: typechain_types_1.ISaturnFeeModel__factory.connect(instanceDescriptor.feeModel),
    };
    return {
        verifier: instance.verifier.connect(provider),
        proofReceiver: instance.proofReceiver.connect(provider),
        feeModel: instance.feeModel.connect(provider),
    };
}
exports.saturnInstanceFromDescriptor = saturnInstanceFromDescriptor;
async function updateOptions(proofReceiver, numProofs, options) {
    const value = options && options.value !== undefined && options.value !== null
        ? options.value
        : await proofReceiver.estimateFee(numProofs);
    return { ...options, value };
}
exports.updateOptions = updateOptions;
async function populateSubmitProof(proofReceiver, circuitId, proof, instance, options) {
    return proofReceiver.submit.populateTransaction([circuitId], [proof.solidity()], [instance], await updateOptions(proofReceiver, 1, options));
}
exports.populateSubmitProof = populateSubmitProof;
async function submitProof(proofReceiver, circuitId, proof, instance, options) {
    return proofReceiver.submit([circuitId], [proof.solidity()], [instance], await updateOptions(proofReceiver, 1, options));
}
exports.submitProof = submitProof;
async function populateSubmitProofs(proofReceiver, circuitIds, proofs, instances, options) {
    const numProofs = circuitIds.length;
    (0, assert_1.strict)(proofs.length == numProofs);
    (0, assert_1.strict)(instances.length == numProofs);
    return proofReceiver.submit.populateTransaction(circuitIds, proofs.map((pf) => pf.solidity()), instances, await updateOptions(proofReceiver, numProofs, options));
}
exports.populateSubmitProofs = populateSubmitProofs;
async function submitProofs(proofReceiver, circuitIds, proofs, instances, options) {
    const numProofs = circuitIds.length;
    (0, assert_1.strict)(proofs.length == numProofs);
    (0, assert_1.strict)(instances.length == numProofs);
    return proofReceiver.submit(circuitIds, proofs.map((pf) => pf.solidity()), instances, await updateOptions(proofReceiver, numProofs, options));
}
exports.submitProofs = submitProofs;
async function waitForProofVerified(saturnInstance, tx, proofId, progress) {
    const provider = saturnInstance.proofReceiver.runner.provider;
    const submission = submission_1.Submission.fromTransactionReceipt(saturnInstance.proofReceiver, tx);
    const submissionId = submission.submissionId;
    const submissionIdx = await saturnInstance.proofReceiver.getSubmissionIdx(submissionId);
    if (submission.proofIds.indexOf(proofId) < 0) {
        throw new Error(`proofId ${proofId} not found.`);
    }
    // Poll from submittedBlock onwards
    let startBlock = tx.blockNumber;
    const verifiedEventGetter = new events_1.ProofVerifiedEventGetter(saturnInstance.verifier, proofId);
    // Initialize progress indicator.
    const startVerifiedIdx = (await saturnInstance.verifier.nextSubmissionIdxToVerify()) - 1n;
    const intervalId = setInterval(async () => {
        const curVerifiedIdx = (await saturnInstance.verifier.nextSubmissionIdxToVerify()) - 1n;
        if (progress) {
            progress(Number(curVerifiedIdx - startVerifiedIdx) /
                Number(submissionIdx - startVerifiedIdx));
        }
    }, 10000);
    let lastBlock = startBlock - 1;
    const maxBlockPerQuery = 10;
    for (;;) {
        startBlock = lastBlock + 1;
        const curBlock = await provider.getBlockNumber();
        if (curBlock < startBlock) {
            await new Promise((r) => setTimeout(r, 1000));
            continue;
        }
        const endBlock = Math.min(curBlock, lastBlock + maxBlockPerQuery - 1);
        const evs = await verifiedEventGetter.getFull(startBlock, endBlock);
        for (const ev of evs) {
            if (ev.event.proofId == proofId) {
                clearInterval(intervalId);
                return true;
            }
        }
        lastBlock = endBlock;
    }
}
exports.waitForProofVerified = waitForProofVerified;
//# sourceMappingURL=saturn.js.map