import {
  generateRandomProofInputs,
  loadDemoAppInstance,
  upaInstance,
  instance,
  circuitWasm,
  circuitZkey,
} from "./utils";
import {
  Proof,
  snarkjs,
  UpaClient,
  CircuitIdProofAndInputs,
} from "@nebrazkp/upa/sdk";
import { options, config } from "@nebrazkp/upa/tool";
const { keyfile, endpoint, password } = options;
const { loadWallet, loadInstance } = config;
import * as ethers from "ethers";
import { command } from "cmd-ts";
import { DemoApp__factory } from "../typechain-types";

export const submit = command({
  name: "submit",
  args: {
    endpoint: endpoint(),
    keyfile: keyfile(),
    password: password(),
    instance: instance(),
    upaInstance: upaInstance(),
    circuitWasm: circuitWasm(),
    circuitZkey: circuitZkey(),
  },
  description:
    "Send one demo-app proof to UPA, then when it's verified, " +
    "submit the corresponding solution to demo-app.",
  handler: async function ({
    endpoint,
    keyfile,
    password,
    instance,
    upaInstance,
    circuitWasm,
    circuitZkey,
  }): Promise<void> {
    const provider = new ethers.JsonRpcProvider(endpoint);
    const wallet = await loadWallet(keyfile, password, provider);

    const demoAppInstance = loadDemoAppInstance(instance);
    const circuitId = BigInt(demoAppInstance.circuitId);
    const demoApp = DemoApp__factory.connect(demoAppInstance.demoApp).connect(
      wallet
    );

    // Generate random public inputs along with a proof that they are valid.
    const proofData = await snarkjs.groth16.fullProve(
      generateRandomProofInputs(),
      circuitWasm,
      circuitZkey
    );
    const proof = Proof.from_snarkjs(proofData.proof);
    const publicInputs: bigint[] = proofData.publicSignals.map(BigInt);

    // Initialize a `UpaClient` for submitting proofs to the UPA.
    const upaClient = new UpaClient(wallet, loadInstance(upaInstance));

    // Wrap `circuitId`, `proof`, and `publicInputs` in a type
    const circuitIdProofAndInputs: CircuitIdProofAndInputs[] = [
      { circuitId, proof, inputs: publicInputs },
    ];
    // Submit `circuitIdProofAndInputs` using the `UpaClient`.
    const submissionHandle = await upaClient.submitProofs(
      circuitIdProofAndInputs
    );

    // Wait for an off-chain prover to send an aggregated proof to the UPA
    // contract showing that our submitted `circuitIdProofAndInputs` was valid.
    const submitProofTxReceipt = await upaClient.waitForSubmissionVerified(
      submissionHandle
    );

    // Our submitted `circuitIdProofAndInputs` is now marked as valid in the
    // UPA contract so we can now submit the solution to demo-app's contract.
    const submitSolutionTxResponse = await demoApp.submitSolution(publicInputs);

    const submitSolutionTxReceipt = await submitSolutionTxResponse.wait();

    console.log("Gas Cost Summary:");
    console.table({
      "Submit proof to UPA": { "Gas Cost": `${submitProofTxReceipt!.gasUsed}` },
      "Submit solution to app contract": {
        "Gas Cost": `${submitSolutionTxReceipt?.gasUsed}`,
      },
    });
  },
});
