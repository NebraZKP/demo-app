import { application, upa, typechain } from "@nebrazkp/upa/sdk";
import { options, config } from "@nebrazkp/upa/tool";
import {
  instance,
  circuitWasm,
  circuitZkey,
  generateProof,
  upaInstance,
  loadDemoAppInstance,
  sleep,
} from "./utils";
import * as ethers from "ethers";
import { command, option, number, boolean, flag } from "cmd-ts";
import { PayableOverrides } from "../typechain-types/common";

export const batchFiller = command({
  name: "batch-filler",
  args: {
    endpoint: options.endpoint(),
    keyfile: options.keyfile(),
    password: options.password(),
    maxFeePerGasGwei: options.maxFeePerGasGwei(),
    instance: instance(),
    upaInstance: upaInstance(),
    circuitWasm: circuitWasm(),
    circuitZkey: circuitZkey(),
    onlyOnce: flag({
      type: boolean,
      long: "only-once",
      description:
        "If true, it fills the batches only once, then stops execution.",
    }),
    timeBetweenIterations: option({
      type: number,
      long: "time-between-iterations",
      defaultValue: () => DEFAULT_TIME_BETWEEN_ITERATIONS,
      description:
        "The time between iterations of the batch filling algorithm.",
    }),
    maxFalseProofCounter: option({
      type: number,
      long: "max-false-proof-counter",
      defaultValue: () => MAX_FALSE_PROOF_COUNTER,
      description: "If the counter reaches this number, we send a full batch.",
    }),
    numBatchesToBeFilled: option({
      type: number,
      long: "num-batches",
      defaultValue: () => 1,
      description: "The number of batches to be filled.",
    }),
  },
  description: "Send a number of demo-app proofs to UPA to be verified.",
  handler: async function ({
    endpoint,
    keyfile,
    password,
    instance,
    upaInstance,
    circuitWasm,
    circuitZkey,
    maxFeePerGasGwei,
    timeBetweenIterations,
    maxFalseProofCounter,
    onlyOnce,
    numBatchesToBeFilled,
  }): Promise<void> {
    const maxFeePerGas = maxFeePerGasGwei
      ? ethers.parseUnits(maxFeePerGasGwei, "gwei")
      : undefined;

    const provider = new ethers.JsonRpcProvider(endpoint);
    const wallet = await config.loadWallet(keyfile, password, provider);

    const demoAppInstance = loadDemoAppInstance(instance);
    const circuitId = demoAppInstance.circuitId;

    const { verifier, proofReceiver } = config.upaFromInstanceFile(
      upaInstance,
      wallet
    );

    await fillBatch(
      verifier,
      proofReceiver,
      circuitId,
      circuitWasm,
      circuitZkey,
      timeBetweenIterations,
      maxFalseProofCounter,
      onlyOnce,
      numBatchesToBeFilled,
      maxFeePerGas
    );
  },
});

/// UPA Aggregated Batch Size
const BATCH_SIZE: number = 40;
/// Default time between iterations
const DEFAULT_TIME_BETWEEN_ITERATIONS: number = 30;
/// Max false proof counter. If the false proof counter
/// reaches this number, we send a full batch.
const MAX_FALSE_PROOF_COUNTER: number = 10;

/// Rejection Reason
enum RejectionReason {
  NoProofsNeeded,
  NoProofsPending,
}

/// Proofs and Public inputs type
type ProofsAndPublicInputs = {
  proof: application.Proof;
  publicInputs: string[];
}[];

/// Generates proofs to fill the last batch if needed, unless
/// there are more pending proofs than in `numBatchesToBeFilled` batches.
async function tryGenerateProofsForLastBatch(
  lastSubmittedProofIdx: bigint,
  lastVerifiedProofIdx: bigint,
  circuitWasm: string,
  circuitZkey: string,
  numBatchesToBeFilled: number,
  state: { areThereFalseProofs: boolean; falseProofCounter: number }
): Promise<ProofsAndPublicInputs> {
  const numProofsPending = lastSubmittedProofIdx - lastVerifiedProofIdx;
  console.log(`${numProofsPending} pending proofs`);
  const proofsAndPublicInputs = [];
  if (
    numProofsPending >= BATCH_SIZE * numBatchesToBeFilled ||
    (numProofsPending % BigInt(BATCH_SIZE) == 0n && numProofsPending !== 0n)
  ) {
    // If we hit this branch, under normal conditions
    // we don't need to fill the last batch, as more proofs
    // may come while the worker verifies the existing full
    // batches.
    // However, if a lot of time has passed and the
    // `lastVerifiedProofIdx` hasn't changed, we assume the
    // submissions are invalid proofs and send an entire batch.
    if (state.areThereFalseProofs) {
      console.log("Invalid proofs detected with high likelihood.");
      console.log("Submitting a full batch to flush");
      for (let i = 0; i < BATCH_SIZE; i++) {
        const [proof, publicInputs] = await generateProof(
          circuitWasm,
          circuitZkey
        );
        proofsAndPublicInputs.push({ proof, publicInputs });
      }
      state.areThereFalseProofs = false;
      state.falseProofCounter = 0;
    } else {
      // do nothing.
      return Promise.reject(RejectionReason.NoProofsNeeded);
    }
  } else if (numProofsPending == 0n) {
    // if no proofs are pending, no need to send any
    return Promise.reject(RejectionReason.NoProofsPending);
  } else {
    const numProofs =
      BigInt(BATCH_SIZE) - (numProofsPending % BigInt(BATCH_SIZE));
    console.log(`Generating ${numProofs} proofs`);
    for (let i = 0; i < numProofs; i++) {
      const [proof, publicInputs] = await generateProof(
        circuitWasm,
        circuitZkey
      );
      proofsAndPublicInputs.push({ proof, publicInputs });
    }
  }
  return proofsAndPublicInputs;
}

/// Generates proofs to fill the last batch. If no proofs need to be
/// generated, it returns undefined.
async function generateProofsForLastBatch(
  lastSubmittedProofIdx: bigint,
  lastVerifiedProofIdx: bigint,
  circuitWasm: string,
  circuitZkey: string,
  numBatchesToBeFilled: number,
  maxFalseProofCounter: number,
  state: { areThereFalseProofs: boolean; falseProofCounter: number }
): Promise<ProofsAndPublicInputs | undefined> {
  let proofsAndPublicInputs;
  try {
    proofsAndPublicInputs = await tryGenerateProofsForLastBatch(
      lastSubmittedProofIdx,
      lastVerifiedProofIdx,
      circuitWasm,
      circuitZkey,
      numBatchesToBeFilled,
      state
    );
  } catch (rejection) {
    if (typeof rejection === "number" && RejectionReason[rejection]) {
      switch (rejection) {
        case RejectionReason.NoProofsNeeded:
          console.log("No proofs need to be filled.");
          state.falseProofCounter++;
          if (state.falseProofCounter >= maxFalseProofCounter) {
            state.areThereFalseProofs = true;
          }
          return undefined;
        case RejectionReason.NoProofsPending:
          console.log("No proofs are pending.");
          return undefined;
        default:
          console.error("Unknown rejection reason:", rejection);
          throw rejection;
      }
    }
  }
  return proofsAndPublicInputs;
}

/// Submits `numFullChunks` of `maxNumProofsPerSubmission` proofs to
/// `proofReceiver`.
async function submitFullChunks(
  proofReceiver: typechain.UpaProofReceiver,
  numFullChunks: number,
  maxNumProofsPerSubmission: number,
  circuitId: string,
  proofsAndPublicInputs: ProofsAndPublicInputs,
  options: PayableOverrides
): Promise<void> {
  for (let chunkIdx = 0; chunkIdx < numFullChunks; chunkIdx++) {
    const circuitIdArray = Array.from(
      { length: maxNumProofsPerSubmission },
      () => circuitId
    );
    const proofs = proofsAndPublicInputs
      .slice(
        chunkIdx * maxNumProofsPerSubmission,
        (chunkIdx + 1) * maxNumProofsPerSubmission
      )
      .map((obj) => obj.proof);
    const publicInputs = proofsAndPublicInputs
      .slice(
        chunkIdx * maxNumProofsPerSubmission,
        (chunkIdx + 1) * maxNumProofsPerSubmission
      )
      .map((obj) => obj.publicInputs);
    await upa.submitProofs(
      proofReceiver,
      circuitIdArray,
      proofs,
      publicInputs,
      options
    );
  }
}

/// Submits `numProofsInLastChunk` to `proofReceiver`.
async function submitRemainder(
  proofReceiver: typechain.UpaProofReceiver,
  numProofsInLastChunk: number,
  circuitId: string,
  proofsAndPublicInputs: ProofsAndPublicInputs,
  options: PayableOverrides
): Promise<void> {
  if (numProofsInLastChunk == 0) {
    // do nothing
  } else if (numProofsInLastChunk == 1) {
    const { proof, publicInputs } = proofsAndPublicInputs[0];
    await upa.submitProof(
      proofReceiver,
      circuitId,
      proof,
      publicInputs,
      options
    );
  } else {
    const circuitIdArray = Array.from(
      { length: numProofsInLastChunk },
      () => circuitId
    );
    const proofs = proofsAndPublicInputs.map((obj) => obj.proof);
    const publicInputs = proofsAndPublicInputs.map((obj) => obj.publicInputs);
    await upa.submitProofs(
      proofReceiver,
      circuitIdArray,
      proofs,
      publicInputs,
      options
    );
  }
}

/// Submits `proofsAndPublicInputs` to `proofReceiver`.
async function submitGeneratedProofs(
  proofReceiver: typechain.UpaProofReceiver,
  circuitId: string,
  proofsAndPublicInputs: ProofsAndPublicInputs,
  options: PayableOverrides
): Promise<void> {
  const maxNumProofsPerSubmission = Number(
    await proofReceiver.MAX_NUM_PROOFS_PER_SUBMISSION()
  );
  const numProofsToSubmit = proofsAndPublicInputs.length;
  console.log(`Submitting ${numProofsToSubmit} proofs`);
  const numFullChunks = Math.floor(
    numProofsToSubmit / maxNumProofsPerSubmission
  );
  await submitFullChunks(
    proofReceiver,
    numFullChunks,
    maxNumProofsPerSubmission,
    circuitId,
    proofsAndPublicInputs,
    options
  );
  const numProofsInLastChunk = numProofsToSubmit % maxNumProofsPerSubmission;
  await submitRemainder(
    proofReceiver,
    numProofsInLastChunk,
    circuitId,
    proofsAndPublicInputs.slice(numFullChunks * maxNumProofsPerSubmission),
    options
  );
  console.log(`Successfully submitted ${numProofsToSubmit} proofs`);
}

/// If `onlyOnce` is true, fills the next batch (if necessary)
/// and quits. If false, it tries to fill the next batch every
/// `timeBetweenIterations`.
export async function fillBatch(
  upaVerifier: typechain.UpaVerifier,
  proofReceiver: typechain.UpaProofReceiver,
  circuitId: string,
  circuitWasm: string,
  circuitZkey: string,
  timeBetweenIterations: number,
  maxFalseProofCounter: number,
  onlyOnce: boolean,
  numBatchesToBeFilled: number,
  maxFeePerGas?: bigint
) {
  const options: PayableOverrides = { maxFeePerGas };
  let lastVerifiedProofIdx = 0n;
  const state = {
    areThereFalseProofs: false,
    falseProofCounter: 0,
  };
  for (;;) {
    console.log("Scanning the blockchain for pending proofs");
    const newLastVerifiedProofIdx = await upa.lastVerifiedProofIdx(
      upaVerifier,
      proofReceiver
    );
    const lastSubmittedProofIdx = (await proofReceiver._nextProofIdx()) - 1n;
    if (newLastVerifiedProofIdx !== lastVerifiedProofIdx) {
      state.falseProofCounter = 0;
      state.areThereFalseProofs = false;
      lastVerifiedProofIdx = newLastVerifiedProofIdx;
    }
    const proofsAndPublicInputs = await generateProofsForLastBatch(
      lastSubmittedProofIdx,
      lastVerifiedProofIdx,
      circuitWasm,
      circuitZkey,
      numBatchesToBeFilled,
      maxFalseProofCounter,
      state
    );
    if (proofsAndPublicInputs) {
      await submitGeneratedProofs(
        proofReceiver,
        circuitId,
        proofsAndPublicInputs,
        options
      );
    }
    if (onlyOnce) {
      console.log(`Quitting`);
      break;
    }
    await sleep(timeBetweenIterations);
  }
}
