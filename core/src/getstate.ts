import * as ethers from "ethers";
import { command } from "cmd-ts";
import { options } from "@nebrazkp/upa/tool";
const { endpoint } = options;
import { demoAppFromInstance, instance } from "./utils";

export const getstate = command({
  name: "getstate",
  args: {
    endpoint: endpoint(),
    instance: instance(),
  },
  description: "Query the DemoApp contract state.",
  handler: async function ({ endpoint, instance }): Promise<void> {
    let demoApp = demoAppFromInstance(instance);
    const provider = new ethers.JsonRpcProvider(endpoint);
    demoApp = demoApp.connect(provider);

    const proofsVerified = await demoApp.proofsVerified();
    const jsonData = { proofsVerified: proofsVerified.toString() };
    console.log(JSON.stringify(jsonData));
  },
});
