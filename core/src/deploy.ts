import * as ethers from "ethers";
import { command } from "cmd-ts";
import * as fs from "fs";
import assert from "assert";
import { instance, upaInstance, DemoAppInstance, vkFile } from "./utils";
import { DemoApp__factory } from "../typechain-types";
import { options, config } from "@nebrazkp/upa/tool";
const { keyfile, endpoint, password } = options;
const { loadWallet, upaFromInstanceFile } = config;

export const deploy = command({
  name: "deploy",
  args: {
    endpoint: endpoint(),
    keyfile: keyfile(),
    password: password(),
    instance: instance("Output file for instance information"),
    upaInstance: upaInstance(),
    vkFile: vkFile(),
  },
  description: "Deploy the DemoApp contract.",
  handler: async function ({
    endpoint,
    keyfile,
    password,
    instance,
    upaInstance,
    vkFile,
  }): Promise<void> {
    const provider = new ethers.JsonRpcProvider(endpoint);
    const wallet = await loadWallet(keyfile, password, provider);

    const upa = upaFromInstanceFile(upaInstance, provider);
    const vk = config.loadAppVK(vkFile);
    const circuitId = await upa.proofReceiver.computeCircuitId(vk);

    const DemoApp = new DemoApp__factory(wallet);
    const demoApp = await DemoApp.deploy(upa.verifier, circuitId);
    await demoApp.waitForDeployment();

    assert(circuitId == (await demoApp.circuitId()));

    // Write the instance information to disk
    const instanceData: DemoAppInstance = {
      demoApp: await demoApp.getAddress(),
      circuitId: circuitId.toString(),
    };
    fs.writeFileSync(instance, JSON.stringify(instanceData));

    console.log(`DemoApp was deployed to address \
    ${instanceData.demoApp}, circuitId is \
    ${instanceData.circuitId}`);
  },
});
