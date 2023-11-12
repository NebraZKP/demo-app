"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFeeOrDefault = exports.computeProofId = exports.requestWithRetry = exports.JSONstringify = exports.loadVKProofAndInputsBatchFile = exports.loadProofAndInputsBatchFile = exports.loadProofAndInputsFile = exports.loadSnarkjsVK = exports.loadAppVK = exports.deployBinaryContract = exports.bigintToBytes32 = exports.bigintToHex32 = void 0;
const ethers_1 = require("ethers");
const fs_1 = require("fs");
const ethers_2 = require("ethers");
const application_1 = require("./application");
const ethers_3 = require("ethers");
const zeroes = "0".repeat(64);
/// Converts a bigint into 32 byte hex string (big endian)
function bigintToHex32(b) {
    const hex = b.toString(16);
    if (hex.length > 64) {
        throw "bigint too large to convert to 32 bytes";
    }
    return zeroes.slice(hex.length) + hex;
}
exports.bigintToHex32 = bigintToHex32;
/// Converts a bigint into 32 bytes (big endian)
function bigintToBytes32(b) {
    const hex = bigintToHex32(b);
    const u8 = new Uint8Array(32);
    for (let i = 0, j = 0; i < 32; i++, j += 2) {
        u8[i] = parseInt(hex.slice(j, j + 2), 16);
    }
    return u8;
}
exports.bigintToBytes32 = bigintToBytes32;
// Read and deploy bytecode as a contract
async function deployBinaryContract(deployer, bin_file, nonce) {
    const contract_hex = "0x" + (0, fs_1.readFileSync)(bin_file, "utf-8").trim();
    const factory = new ethers_1.ContractFactory([], contract_hex, deployer);
    const contract = await factory.deploy({ nonce: nonce });
    await contract.waitForDeployment();
    return contract.getAddress();
}
exports.deployBinaryContract = deployBinaryContract;
/// Load application VK
function loadAppVK(filename) {
    const json = (0, fs_1.readFileSync)(filename, "ascii");
    return application_1.VerifyingKey.from_json(JSON.parse(json));
}
exports.loadAppVK = loadAppVK;
/// Load SnarkJS VK
function loadSnarkjsVK(filename) {
    return JSON.parse((0, fs_1.readFileSync)(filename, "ascii"));
}
exports.loadSnarkjsVK = loadSnarkjsVK;
/// Load a file containing a proofs with public inputs
function loadProofAndInputsFile(filename) {
    const proofWithInputs = JSON.parse((0, fs_1.readFileSync)(filename, "ascii"));
    const proof = application_1.Proof.from_json(proofWithInputs.proof);
    const inputsJSON = proofWithInputs.inputs;
    const inputs = inputsJSON.map(BigInt);
    return { proof, inputs };
}
exports.loadProofAndInputsFile = loadProofAndInputsFile;
/// Load a file containing a proofs with public inputs
function loadProofAndInputsBatchFile(filename) {
    const proofsWithInputs = JSON.parse((0, fs_1.readFileSync)(filename, "ascii"));
    return proofsWithInputs.map((pi) => {
        const proof = application_1.Proof.from_json(pi.proof);
        const inputsJSON = pi.inputs;
        const inputs = inputsJSON.map(BigInt);
        return { proof, inputs };
    });
}
exports.loadProofAndInputsBatchFile = loadProofAndInputsBatchFile;
function loadVKProofAndInputsBatchFile(filename) {
    const proofsWithInputs = JSON.parse((0, fs_1.readFileSync)(filename, "ascii"));
    return proofsWithInputs.map((vpi) => {
        const vk = application_1.VerifyingKey.from_json(vpi.vk);
        const proof = application_1.Proof.from_json(vpi.proof);
        const inputs = vpi.inputs.map(BigInt);
        return { vk, proof, inputs };
    });
}
exports.loadVKProofAndInputsBatchFile = loadVKProofAndInputsBatchFile;
/// JSON.stringify handling bigints as (decimal) strings.  If forceDecimal is
/// true, strings of the form: "0x<hex-string>" are also converted to
/// decimals.
function JSONstringify(obj, spacing, forceDecimal = false) {
    if (forceDecimal) {
        return JSON.stringify(obj, (_key, value) => {
            if (typeof value === "bigint") {
                return value.toString(10);
            }
            else if (typeof value == "string" && value.startsWith("0x")) {
                return BigInt(value).toString(10);
            }
        }, spacing);
    }
    else {
        return JSON.stringify(obj, (_key, value) => (typeof value === "bigint" ? value.toString(10) : value), spacing);
    }
}
exports.JSONstringify = JSONstringify;
// Helper function that performs retries and error handling for RPC calls.
// `requestFn` can be any operation that queries the attached node.
async function requestWithRetry(requestFn, requestLabel, maxRetries = 5, timeoutMs, onFail) {
    const retryWaitMs = 10000;
    for (let retries = 1; retries <= maxRetries; retries++) {
        try {
            const promises = [requestFn()];
            // Add timeout promise only if a timeout is provided
            if (timeoutMs) {
                promises.push(new Promise((_, reject) => setTimeout(() => reject(new Error(`Request timeout for ${requestLabel}`)), timeoutMs)));
            }
            return await Promise.race(promises);
        }
        catch (error) {
            if (((0, ethers_3.isError)(error, "UNKNOWN_ERROR") ||
                (0, ethers_3.isError)(error, "NETWORK_ERROR") ||
                (0, ethers_3.isError)(error, "CALL_EXCEPTION")) &&
                retries <= maxRetries) {
                console.error(error.message);
                console.log(`Known error: ${error.code} for ${requestLabel} ` +
                    `(Retry ${retries}/${maxRetries})...`);
            }
            else {
                console.error(`Unknown error: ${error} for ${requestLabel} ` +
                    `(Retry ${retries}/${maxRetries})...`);
            }
            await new Promise((resolve) => setTimeout(resolve, retryWaitMs));
        }
    }
    if (onFail) {
        onFail();
    }
    throw new Error(`Max retries reached for ${requestLabel}.`);
}
exports.requestWithRetry = requestWithRetry;
function computeProofId(circuitId, appPublicInputs) {
    const data = [
        bigintToHex32(circuitId),
        ...appPublicInputs.map(bigintToHex32),
    ].join("");
    return (0, ethers_3.keccak256)("0x" + data);
}
exports.computeProofId = computeProofId;
function parseFeeOrDefault(feeInWei) {
    let fee;
    try {
        fee = feeInWei ? (0, ethers_2.getUint)(feeInWei) : undefined;
    }
    catch (error) {
        console.log("Error while parsing the fee", error);
        throw error;
    }
    return fee;
}
exports.parseFeeOrDefault = parseFeeOrDefault;
//# sourceMappingURL=utils.js.map