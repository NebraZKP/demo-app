import * as ethers from "ethers";
import { command } from "cmd-ts";
import * as fs from "fs";
import assert from "assert";
import { instance, saturnInstance, SimpleAppInstance, vkFile } from "./utils";
import { SimpleApp__factory } from "../typechain-types";
import { tool, utils } from "saturn-contracts";
const { keyfile, endpoint, password } = tool.options;
const { loadWallet, saturnFromInstanceFile } = tool.config;

export const deploy = command({
  name: "deploy",
  args: {
    endpoint: endpoint(),
    keyfile: keyfile(),
    password: password(),
    instance: instance("Output file for instance information"),
    saturnInstance: saturnInstance(),
    vkFile: vkFile(),
  },
  description: "Deploy the SimpleApp contract.",
  handler: async function ({
    endpoint,
    keyfile,
    password,
    instance,
    saturnInstance,
    vkFile,
  }): Promise<void> {
    const provider = new ethers.JsonRpcProvider(endpoint);
    const wallet = await loadWallet(keyfile, password, provider);

    const saturn = saturnFromInstanceFile(saturnInstance, provider);
    const vk = utils.loadAppVK(vkFile);
    const circuitId = await saturn.proofReceiver.computeCircuitId(vk);

    const SimpleApp = new SimpleApp__factory(wallet);
    const simpleApp = await SimpleApp.deploy(saturn.verifier, circuitId);
    await simpleApp.waitForDeployment();

    assert(circuitId == (await simpleApp.circuitId()));

    // Write the instance information to disk
    const instanceData: SimpleAppInstance = {
      simpleApp: await simpleApp.getAddress(),
      circuitId: circuitId.toString(),
    };
    fs.writeFileSync(instance, JSON.stringify(instanceData));

    console.log(`SimpleApp was deployed to address \
    ${instanceData.simpleApp}, circuitId is \
    ${instanceData.circuitId}`);
  },
});
