import * as ethers from "ethers";
import { command } from "cmd-ts";
const snarkjs = require("snarkjs");
import {
  generateRandomProofInputs,
  simpleAppFromInstance,
  instance,
  circuitWasm,
  circuitZkey,
  saturnInstance
} from "./utils";
import { tool, application, SaturnClient } from "saturn-contracts";
const { keyfile, endpoint, password } = tool.options;
const { loadWallet } = tool.config;
const { Proof } = application;

export const submit = command({
  name: "submit",
  args: {
    endpoint: endpoint(),
    keyfile: keyfile(),
    password: password(),
    instance: instance(),
    saturnInstance: saturnInstance(),
    circuitWasm: circuitWasm(),
    circuitZkey: circuitZkey(),
  },
  description:
    "Send one Simple-app proof to Saturn, then when it's verified, " +
    "submit the corresponding solution to Simple-app.",
  handler: async function ({
    endpoint,
    keyfile,
    password,
    instance,
    saturnInstance,
    circuitWasm,
    circuitZkey,
  }): Promise<void> {
    let simpleApp = simpleAppFromInstance(instance);
    const provider = new ethers.JsonRpcProvider(endpoint);
    const wallet = await loadWallet(keyfile, password, provider);
    simpleApp = simpleApp.connect(wallet);

    const saturnClient = new SaturnClient(saturnInstance, wallet);

    console.log(`Generating a solution and its proof.`);
    const proofData = await snarkjs.groth16.fullProve(
      generateRandomProofInputs(),
      circuitWasm,
      circuitZkey
    );

    const circuitId = await simpleApp.circuitId();
    const proof = Proof.from_snarkjs(proofData.proof);
    const publicInputs = proofData.publicSignals.map((x: string) => BigInt(x));

    let currFeeData = await provider.getFeeData();
    const submissionHandle = await saturnClient.submitProof(
      circuitId,
      proof,
      publicInputs,
      { 
        maxFeePerGas: currFeeData.maxFeePerGas! + 50_000_000_000n,
        maxPriorityFeePerGas: currFeeData.maxPriorityFeePerGas! + 40_000_000_000n 
      }
    );

    console.log(`Submitting proof to Saturn...`);
    const tx = await submissionHandle.txResponse.wait();
    console.log(`Proof submitted to Saturn: https://sepolia.etherscan.io/tx/${tx?.hash}`);

    console.log(`Waiting for Saturn to verify proof...`);
    await saturnClient.waitForProofVerified(submissionHandle);
    console.log(`Proof was verified!`);

    console.log(`Submitting solution to simple-app contract`);
    const submitSolutionTxResponse = await simpleApp.submitSolution(
      publicInputs
    );
    const submitSolutionTxReceipt = await submitSolutionTxResponse.wait();
    console.log(`Solution successfully submitted: ${submitSolutionTxReceipt?.hash}`);
    console.log("Gas Cost Summary:");
        console.table({
      "Submit proof to UPA": { "Gas Cost": `${tx!.gasUsed}` },
      "Submit solution to app contract": { "Gas Cost": `${submitSolutionTxReceipt?.gasUsed}` }
    });
    console.log(
      `Simple-app proofsVerified after submitting: ` +
        `${await simpleApp.proofsVerified()}`
    );
  },
});
