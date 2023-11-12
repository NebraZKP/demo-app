import * as ethers from "ethers";
import { command } from "cmd-ts";
import { tool } from "saturn-contracts";
const { endpoint } = tool.options;
import { simpleAppFromInstance, instance } from "./utils";

export const getstate = command({
  name: "getstate",
  args: {
    endpoint: endpoint(),
    instance: instance(),
  },
  description: "Query the SimpleApp contract state.",
  handler: async function ({ endpoint, instance }): Promise<void> {
    let simpleApp = simpleAppFromInstance(instance);
    const provider = new ethers.JsonRpcProvider(endpoint);
    simpleApp = simpleApp.connect(provider);

    const proofsVerified = await simpleApp.proofsVerified();
    const jsonData = { proofsVerified: proofsVerified.toString() };
    console.log(JSON.stringify(jsonData));
  },
});
