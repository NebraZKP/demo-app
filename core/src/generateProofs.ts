import { command, option, number } from "cmd-ts";
import {
  circuitWasm,
  circuitZkey,
  proofOutputFile,
  generateProof,
} from "./utils";
import * as fs from "fs";

export const generateProofs = command({
  name: "generate-proofs",
  args: {
    numProofs: option({
      type: number,
      long: "num",
      short: "n",
      defaultValue: () => 1,
      description: "The number of proofs to generate.",
    }),
    circuitWasm: circuitWasm(),
    circuitZkey: circuitZkey(),
    proofOutputFile: proofOutputFile(),
  },
  description: "Generate a number of demo-app proofs and write them to file.",
  handler: async function ({
    numProofs,
    circuitWasm,
    circuitZkey,
    proofOutputFile,
  }): Promise<undefined> {
    const startTimeMilliseconds = Date.now();

    const proofsAndPublicInputs = [];

    for (let i = 0; i < numProofs; i++) {
      const [proof, publicInputs] = await generateProof(
        circuitWasm,
        circuitZkey
      );
      proofsAndPublicInputs.push({ proof, inputs: publicInputs });

      console.log(`Generated proof ${i}.`);
    }

    const endTimeMilliseconds = Date.now(); // Record the end time
    const elapsedTimeSeconds =
      (endTimeMilliseconds - startTimeMilliseconds) / 1000;

    console.log(
      `Generated ${numProofs} proofs in ${elapsedTimeSeconds} seconds.`
    );

    fs.writeFileSync(
      proofOutputFile,
      JSON.stringify(proofsAndPublicInputs, null, 2)
    );

    console.log(`Generated proofs written to file ${proofOutputFile}.`);
  },
});
