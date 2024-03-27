import * as ethers from "ethers";
import { DemoApp, DemoApp__factory } from "../typechain-types";
import * as fs from "fs";
import * as path from "path";
import { string, option } from "cmd-ts";
import { application, snarkjs } from "@nebrazkp/upa/sdk";
const { Proof } = application;

export type Option = ReturnType<typeof option>;

export function instance(description?: string | undefined): Option {
  return option({
    type: string,
    long: "instance",
    short: "i",
    defaultValue: () => "demo-app.instance",
    description: description || "demo-app instance file",
  });
}

export function circuitWasm(description?: string | undefined): Option {
  return option({
    type: string,
    long: "circuit-wasm",
    defaultValue: () => {
      return findCircuitFile("circuit_js/circuit.wasm");
    },
    description:
      description || "The .wasm file for demo-app generated by Circom",
  });
}

export function circuitZkey(description?: string | undefined): Option {
  return option({
    type: string,
    long: "circuit-zkey",
    defaultValue: () => {
      return findCircuitFile("circuit.zkey");
    },
    description: description || "The .zkey file generated by SnarkJS",
  });
}

export function upaInstance(description?: string | undefined): Option {
  return option({
    type: string,
    long: "upa-instance",
    defaultValue: () => `upa.instance`,
    description: description || "The UPA instance used by demo-app",
  });
}

export function proofOutputFile(description?: string | undefined): Option {
  return option({
    type: string,
    long: "proof-output",
    defaultValue: () => "generated_proofs.json",
    description: description || "Destination file for generated proof data",
  });
}

export function vkFile(description?: string | undefined): Option {
  return option({
    type: string,
    long: "vk-file",
    short: "v",
    defaultValue: () => findCircuitFile("upa_verification_key.json"),
    description: description || "demo-app's verifying key file",
  });
}

export type DemoAppInstance = {
  /// Address of the demo-app contract
  demoApp: string;
  circuitId: string;
};

export function loadDemoAppInstance(
  instance_file: string
): DemoAppInstance {
  return JSON.parse(
    fs.readFileSync(instance_file, "ascii")
  ) as DemoAppInstance;
}

export function demoAppFromInstance(instance_file: string): DemoApp {
  const instance = loadDemoAppInstance(instance_file);
  return DemoApp__factory.connect(instance.demoApp);
}

// Generates a random non-negative solution to the equation a*b = c*d + e + f.
export function generateRandomProofInputs(): {
  a: bigint;
  b: bigint;
  c: bigint;
  d: bigint;
  e: bigint;
  f: bigint;
} {
  const c = BigInt(ethers.hexlify(ethers.randomBytes(4)));
  const d = BigInt(ethers.hexlify(ethers.randomBytes(4)));
  const a = c + 1n;
  const b = d + 1n;
  const e = c;
  const f = d + 1n;
  return { a, b, c, d, e, f };
}

// Attempt to find a file in the `circuits` directory
function findCircuitFile(filename: string): string {
  // Try the expected locations, based on this file being either in /src
  // or /dist/src directories in the package root.

  let f = path.normalize(path.join(__dirname, "..", "circuits", filename));
  if (!fs.existsSync(f)) {
    f = path.normalize(path.join(__dirname, "..", "..", "circuits", filename));
    if (!fs.existsSync(f)) {
      throw "unable to find " + filename + ".  Specify explicitly with flags.";
    }
  }
  return f;
}

/// Generates a random valid snarkjs proof.
export async function generateProof(
  circuitWasm: string,
  circuitZkey: string
): Promise<[application.Proof, string[]]> {
  const proofData = await snarkjs.groth16.fullProve(
    generateRandomProofInputs(),
    circuitWasm,
    circuitZkey
  );

  const proof = Proof.from_snarkjs(proofData.proof);
  const publicInputs: string[] = proofData.publicSignals;

  return [proof, publicInputs];
}

/// Pauses execution for `s` seconds, then resumes.
export function sleep(s: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 1000 * s));
}