import * as ethers from "ethers";
import { command } from "cmd-ts";
import * as fs from "fs";
import { instance, SimpleAppInstance } from "./utils";
import { SimpleApp__factory } from "../typechain-types";
import { tool } from "saturn-contracts";
const { keyfile, endpoint, password } = tool.options;
const { loadWallet } = tool.config;

export const deploy = command({
  name: "deploy",
  args: {
    endpoint: endpoint(),
    keyfile: keyfile(),
    password: password(),
    instance: instance("Output file for instance information"),
  },
  description: "Deploy the SimpleApp contract.",
  handler: async function ({
    endpoint,
    keyfile,
    password,
    instance,
  }): Promise<void> {
    const provider = new ethers.JsonRpcProvider(endpoint);
    const wallet = await loadWallet(keyfile, password, provider);

    const SimpleApp = new SimpleApp__factory(wallet);
    const simpleApp = await SimpleApp.deploy();
    await simpleApp.waitForDeployment();

    // Write the instance information to disk
    const instanceData: SimpleAppInstance = {
      simpleApp: await simpleApp.getAddress(),
    };
    fs.writeFileSync(instance, JSON.stringify(instanceData));

    console.log(`SimpleApp was deployed to address \
    ${instanceData.simpleApp}`);
  },
});
