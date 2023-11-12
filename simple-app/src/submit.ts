import * as ethers from "ethers";
import { command } from "cmd-ts";
const snarkjs = require("snarkjs");
import { application, tool } from "saturn-contracts";
const { Proof } = application;
import {
  generateRandomProofInputs,
  simpleAppFromInstance,
  instance,
  circuitWasm,
  circuitZkey,
} from "./utils";
const { keyfile, endpoint, password } = tool.options;
const { loadWallet } = tool.config;

export const submit = command({
  name: "submit",
  args: {
    endpoint: endpoint(),
    keyfile: keyfile(),
    password: password(),
    instance: instance(),
    circuitWasm: circuitWasm(),
    circuitZkey: circuitZkey(),
  },
  description: "Send a proof to SimpleApp's verifier.",
  handler: async function ({
    endpoint,
    keyfile,
    password,
    instance,
    circuitWasm,
    circuitZkey,
  }): Promise<void> {
    let simpleApp = simpleAppFromInstance(instance);
    const provider = new ethers.JsonRpcProvider(endpoint);
    const wallet = await loadWallet(keyfile, password, provider);
    simpleApp = simpleApp.connect(wallet);

    console.log(`Generating a solution and its proof.`);
    const proofData = await snarkjs.groth16.fullProve(
      generateRandomProofInputs(),
      circuitWasm,
      circuitZkey
    );
    const calldataBlob = await snarkjs.groth16.exportSolidityCallData(
      proofData.proof,
      proofData.publicSignals
    );
    const calldataJSON = JSON.parse("[" + calldataBlob + "]");

    const proof = new Proof(calldataJSON[0], calldataJSON[1], calldataJSON[2]);
    const publicSignals = calldataJSON[3];

    console.log(`Submitting solution to simple-app contract`);
    let submitSolutionTxResponse = await simpleApp.submitSolution(
      proof.pi_a,
      proof.pi_b,
      proof.pi_c,
      publicSignals
    );
    const submitSolutionTxReceipt = await submitSolutionTxResponse.wait();
    const submitGasCost = submitSolutionTxReceipt?.gasUsed;
    console.log(`Solution successfully submitted: ${submitSolutionTxReceipt?.hash}`);
    console.log("Gas Cost Summary:");
    console.table({
      "Submit Solution": { "Gas Cost": `${submitGasCost} gas` }
    });
    console.log(
      `Simple-app proofsVerified after submitting: ` +
        `${await simpleApp.proofsVerified()}`
    );
  },
});
