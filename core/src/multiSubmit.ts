import {
  generateRandomProofInputs,
  loadDemoAppInstance,
  upaInstance,
  instance,
  circuitWasm,
  circuitZkey,
} from "./utils";
import {
  utils,
  snarkjs,
  UpaClient,
  CircuitIdProofAndInputs,
  Proof,
} from "@nebrazkp/upa/sdk";
import * as ethers from "ethers";
import { ContractTransactionReceipt } from "ethers";
import { command, option, number, boolean, flag } from "cmd-ts";
import { options, config } from "@nebrazkp/upa/tool";
import { PayableOverrides } from "../typechain-types/common";
import { Sema, RateLimit } from "async-sema";
import { strict as assert } from "assert";
const { loadInstance } = config;
import { DemoApp__factory } from "../typechain-types";

export const multiSubmit = command({
  name: "multi-submit",
  args: {
    endpoint: options.endpoint(),
    keyfile: options.keyfile(),
    password: options.password(),
    maxFeePerGasGwei: options.maxFeePerGasGwei(),
    instance: instance(),
    upaInstance: upaInstance(),
    submissionSize: option({
      type: number,
      long: "submission-size",
      short: "s",
      defaultValue: () => 1,
      description: "Number of proofs per submission.",
    }),
    numProofs: option({
      type: number,
      long: "num",
      short: "n",
      defaultValue: () => 0,
      description: "The number of proofs to send. If 0, send unlimited proofs.",
    }),
    circuitWasm: circuitWasm(),
    circuitZkey: circuitZkey(),
    submitRate: option({
      type: number,
      long: "submit-rate",
      defaultValue: () => 0.5,
      description: "The maximum submission rate per second.",
    }),
    skipSolutions: flag({
      type: boolean,
      long: "skip-solutions",
      defaultValue: () => false,
      description: "Submit proofs to UPA without submitting app solutions",
    }),
  },
  description: "Send a number of Demo-app proofs to UPA to be verified.",
  handler: async function ({
    endpoint,
    keyfile,
    password,
    instance,
    upaInstance,
    numProofs,
    circuitWasm,
    circuitZkey,
    submissionSize,
    submitRate,
    maxFeePerGasGwei,
    skipSolutions,
  }): Promise<void> {
    const maxFeePerGas = maxFeePerGasGwei
      ? ethers.parseUnits(maxFeePerGasGwei, "gwei")
      : undefined;

    const provider = new ethers.JsonRpcProvider(endpoint);
    const wallet = await config.loadWallet(keyfile, password, provider);

    const demoAppInstance = loadDemoAppInstance(instance);
    const circuitId = BigInt(demoAppInstance.circuitId);
    const demoApp = DemoApp__factory.connect(
      demoAppInstance.demoApp
    ).connect(wallet);

    const maxConcurrency = 5;
    const semaphore = new Sema(maxConcurrency);

    const submitProofTxPromises: Promise<void>[] = [];
    const waitTxReceiptPromises: Promise<ContractTransactionReceipt | null>[] =
      [];
    const submitSolutionTxReceipts: ContractTransactionReceipt[] = [];

    let nonce = await wallet.getNonce();

    const startTimeMilliseconds = Date.now();

    // `submitRate` is in proofs/s.  Convert to submissions/s.
    submitRate = submitRate / submissionSize;
    const rateLimiter = RateLimit(submitRate, { uniformDistribution: true });

    // Cache some information instead of querying node to save on compute units
    // per transaction.
    let currFeeData = await provider.getFeeData();

    const updateFeeData = async () => {
      console.log("Updating fee data");
      currFeeData = await provider.getFeeData();
    };

    const feeDataRefreshIntervalMs = 600_000; // 10 minutes
    const updateFeeDataId = setInterval(
      updateFeeData,
      feeDataRefreshIntervalMs
    );

    // We need to estimate and cache the gas limit for the first proof.
    let cachedGasLimit: bigint;

    // Initialize a `UpaClient` for submitting proofs to the UPA.
    const upaClient = new UpaClient(wallet, loadInstance(upaInstance));

    // TODO(#515): This will round up to a multiple of `submissionSize`. Make
    // this submit the exact number of proofs.
    //
    // Send submissions of `submissionSize` proofs to the UPA until at least
    // `numProofs` proofs have been submitted. Once a submission has been
    // verified, send the corresponding solution to the demo-app contract.
    for (let i = 0; i < numProofs || numProofs == 0; i += submissionSize) {
      // Start the proof generation for each solution.
      const proofDataP: Promise<snarkjs.SnarkJSProveOutput>[] = [];
      for (let j = 0; j < submissionSize; ++j) {
        proofDataP.push(
          snarkjs.groth16.fullProve(
            generateRandomProofInputs(),
            circuitWasm,
            circuitZkey
          )
        );
      }
      assert(proofDataP.length === submissionSize);

      // For each proof gen, wait for it to complete and construct the
      // CircuitIdProofAndInputs struct required to create the Submission
      // object.
      const cidProofPIs: CircuitIdProofAndInputs[] = [];
      for (const pdp of proofDataP) {
        const pd = await pdp;
        cidProofPIs.push({
          circuitId: circuitId,
          proof: Proof.from_snarkjs(pd.proof),
          inputs: pd.publicSignals,
        });
      }
      assert(cidProofPIs.length === submissionSize);

      // Estimate the fee due for each submission.
      const value = await upaClient.estimateFee(submissionSize);

      if (i == 0) {
        cachedGasLimit = (await upaClient.estimateGas(cidProofPIs)) + 100n;
        console.log("Setting cached gas limit as ", cachedGasLimit);
      }

      // Uses `upaClient` to submit this bundle of proofs to the UPA.
      const submitTxFn = () => {
        const options: PayableOverrides = {
          nonce: nonce++,
          value: value,
          maxFeePerGas:
            !maxFeePerGas || !currFeeData.maxFeePerGas
              ? undefined
              : Math.min(
                  Number(maxFeePerGas),
                  Number(currFeeData.maxFeePerGas)
                ),
          maxPriorityFeePerGas: currFeeData.maxPriorityFeePerGas,
          gasLimit: cachedGasLimit,
        };
        return upaClient.submitProofs(cidProofPIs, options);
      };

      // Wrap `submitTxFn` with retry logic and acquire/release of `sema`.
      const doSubmitTx = async () => {
        try {
          await semaphore.acquire();
          await rateLimiter();

          const submissionHandle = await utils.requestWithRetry(
            submitTxFn,
            `${i}` /* proofLabel*/,
            10 /* maxRetries*/,
            60 * 1000 /* timeoutMs */
          );
          const { txResponse, submission } = submissionHandle;

          // Print this submission's proofIds and corresponding solutions.
          const proofIds = submission.getProofIds();
          for (let j = 0; j < submissionSize; ++j) {
            const solution = submission.inputs[j];
            console.log(`  proofId: ${proofIds[j]} , solution ${solution}`);
          }

          if (skipSolutions) {
            waitTxReceiptPromises.push(txResponse.wait());
          } else {
            const waitThenSubmitSolution = async () => {
              // Use `upaClient` to wait for this submission to be verified.
              const waitTxReceipt =
                await upaClient.waitForSubmissionVerified(submissionHandle);

              // Submit all of the solutions in the submission to demo-app
              for (let j = 0; j < submissionSize; ++j) {
                const solution = submissionHandle.submission.inputs[j];

                const submitSolutionTxResponse = await (async () => {
                  // Apps will typically choose one of single-proof or
                  // multi-proof submission. We show both cases here for
                  // completeness.
                  if (submissionHandle.submission.isMultiProofSubmission()) {
                    // If the proof was part of a multi-proof submission, we
                    // need to pass a proof reference to the demo-app
                    // contract so it can check the proof's verification
                    // status.
                    return demoApp.submitSolutionWithProofReference(
                      solution,
                      submissionHandle.submission
                        .computeProofReference(j)!
                        .solidity(),
                      { nonce: nonce++ }
                    );
                  } else {
                    // If the proof was sent in a single-proof submission, we
                    // only need to pass the solution. A proof reference is not
                    // necessary.
                    return demoApp.submitSolution(solution, {
                      nonce: nonce++,
                    });
                  }
                })();

                submitSolutionTxReceipts.push(
                  (await submitSolutionTxResponse.wait())!
                );
              }

              return waitTxReceipt;
            };
            waitTxReceiptPromises.push(waitThenSubmitSolution());
          }
        } finally {
          semaphore.release();
        }
      };

      // Only accumulate if we are not looping infinitely.
      const submitTxP = doSubmitTx();
      if (numProofs) {
        submitProofTxPromises.push(submitTxP);
      }
    }

    clearInterval(updateFeeDataId);

    await Promise.all(submitProofTxPromises);
    const txReceipts = await Promise.all(waitTxReceiptPromises);

    const endTimeMilliseconds = Date.now(); // Record the end time
    const elapsedTimeSeconds =
      (endTimeMilliseconds - startTimeMilliseconds) / 1000;

    console.log(
      `All ${numProofs} proofs submitted in ${elapsedTimeSeconds} seconds.`
    );

    const totalGasUsedSubmittingProofs = txReceipts.reduce(
      (total, receipt) => total + receipt!.gasUsed,
      0n
    );
    const totalGasUsedSubmittingSolutions = submitSolutionTxReceipts.reduce(
      (total, receipt) => total + receipt!.gasUsed,
      0n
    );
    console.table({
      "Gas used for submitting all proofs to UPA": {
        "Gas Cost": `${totalGasUsedSubmittingProofs}`,
      },
      "Gas used for submitting all solutions to demo-app": {
        "Gas Cost": `${totalGasUsedSubmittingSolutions}`,
      },
      Total: {
        "Gas Cost": `${
          totalGasUsedSubmittingProofs + totalGasUsedSubmittingSolutions
        }`,
      },
    });
  },
});
