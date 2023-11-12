"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.local = exports.balance = exports.send = exports.ethkeygen = void 0;
const cmd_ts_1 = require("cmd-ts");
const config_1 = require("./config");
const options_1 = require("./options");
const log = __importStar(require("../sdk/log"));
const ethers = __importStar(require("ethers"));
const fs = __importStar(require("fs"));
const child_process_1 = require("child_process");
exports.ethkeygen = (0, cmd_ts_1.command)({
    name: "ethkeygen",
    args: {
        keyfile: (0, options_1.keyfile)("Keyfile to write to"),
        password: (0, options_1.password)(),
    },
    description: "Generate an ethereum key and save to an encrypted keyfile",
    handler: async function ({ keyfile, password }) {
        if (fs.existsSync(keyfile)) {
            throw "refusing to overwrite file: " + keyfile;
        }
        const wallet = ethers.Wallet.createRandom();
        const keystore = await wallet.encrypt((0, options_1.getPassword)(password));
        log.debug("generated keyfile: " + keystore);
        fs.writeFileSync(keyfile, keystore);
        const keystoreParsed = JSON.parse(keystore);
        const address = ethers.getAddress(keystoreParsed.address);
        console.log(address);
        console.log("Fund address from faucet: www.sepoliafaucet.com");
    },
});
exports.send = (0, cmd_ts_1.command)({
    name: "send",
    args: {
        endpoint: (0, options_1.endpoint)(),
        keyfile: (0, options_1.keyfile)(),
        password: (0, options_1.password)(),
        destination: (0, cmd_ts_1.option)({
            type: cmd_ts_1.string,
            long: "dest",
            short: "d",
            description: "Destination address",
        }),
        amount: (0, cmd_ts_1.option)({
            type: cmd_ts_1.string,
            long: "amount",
            short: "a",
            description: "ETH amount to send",
        }),
    },
    description: "Send ETH",
    handler: async function ({ endpoint, keyfile, password, destination, amount, }) {
        const provider = new ethers.JsonRpcProvider(endpoint);
        const wallet = await (0, config_1.loadWallet)(keyfile, (0, options_1.getPassword)(password), provider);
        const value = ethers.parseUnits(amount);
        const tx = await wallet.sendTransaction({
            to: destination,
            from: wallet.address,
            value,
        });
        console.log(tx.hash);
    },
});
exports.balance = (0, cmd_ts_1.command)({
    name: "balance",
    args: {
        endpoint: (0, options_1.endpoint)(),
        keyfile: (0, options_1.keyfile)(),
        address: (0, cmd_ts_1.positional)({
            type: (0, cmd_ts_1.optional)(cmd_ts_1.string),
            description: "Address to check (DEFAULT: address from keyfile)",
        }),
    },
    description: "Get the balance for an address (or keyfile)",
    handler: async function ({ endpoint, keyfile, address }) {
        const provider = new ethers.JsonRpcProvider(endpoint);
        const addr = (() => {
            if (address) {
                return ethers.getAddress(address);
            }
            const keystoreJSON = JSON.parse(fs.readFileSync(keyfile, "ascii"));
            return ethers.getAddress(keystoreJSON.address);
        })();
        const balanceWei = await provider.getBalance(addr);
        const balanceEth = ethers.formatEther(balanceWei);
        console.log(balanceEth);
    },
});
const fund = (0, cmd_ts_1.command)({
    name: "fund",
    args: {
        endpoint: (0, options_1.endpoint)(),
        address: (0, cmd_ts_1.option)({
            type: cmd_ts_1.string,
            long: "address",
            short: "a",
            description: "Address to fund",
        }),
    },
    description: "Send a single ETH from a hosted address",
    handler: async function ({ endpoint, address }) {
        const provider = new ethers.JsonRpcProvider(endpoint);
        const signer = await provider.getSigner(0);
        const result = await signer.sendTransaction({
            to: address,
            value: 1000000000000000000n, // 1 ETH (10^18 WEI)
        });
        log.debug("result: " + JSON.stringify(result));
        await result.wait();
    },
});
const trace = (0, cmd_ts_1.command)({
    name: "trace",
    args: {
        endpoint: (0, options_1.endpoint)(),
        traceFile: (0, cmd_ts_1.option)({
            type: cmd_ts_1.string,
            long: "trace-file",
            short: "t",
            defaultValue: () => "trace.json",
            description: "File to dump a trace to (default: trace.json)",
        }),
        txHash: (0, cmd_ts_1.positional)({
            type: cmd_ts_1.string,
            displayName: "tx-hash",
            description: "Hash of the tx to trace",
        }),
    },
    description: "Dump a trace of the given tx",
    handler: async function ({ endpoint, traceFile, txHash }) {
        const cmd = `curl -s -X POST ${endpoint} -H "Content-Type:application-json" ` +
            `--data '{"method":"debug_traceTransaction","params":["${txHash}"],` +
            `"id":1,"jsonrpc":"2.0"}' > ${traceFile}`;
        console.log("cmd: " + cmd);
        (0, child_process_1.execSync)(cmd);
    },
});
const getReceipt = (0, cmd_ts_1.command)({
    name: "get-receipt",
    args: {
        endpoint: (0, options_1.endpoint)(),
        txHash: (0, cmd_ts_1.positional)({
            type: cmd_ts_1.string,
            displayName: "tx-hash",
            description: "Get the receipt for a given tx.",
        }),
    },
    description: "Get the gas cost for a given tx",
    handler: async function ({ endpoint, txHash }) {
        const provider = new ethers.JsonRpcProvider(endpoint);
        const receipt = await provider.getTransactionReceipt(txHash);
        console.log(JSON.stringify(receipt));
    },
});
const gasPrice = (0, cmd_ts_1.command)({
    name: "gas-price",
    args: {
        endpoint: (0, options_1.endpoint)(),
    },
    description: "Get the gas price estimates from the node",
    handler: async function ({ endpoint }) {
        const provider = new ethers.JsonRpcProvider(endpoint);
        const feeData = await provider.getFeeData();
        console.log(JSON.stringify(feeData));
    },
});
const intervalMining = (0, cmd_ts_1.command)({
    name: "interval-mining",
    args: {
        endpoint: (0, options_1.endpoint)(),
        interval: (0, cmd_ts_1.positional)({
            type: (0, cmd_ts_1.optional)(cmd_ts_1.string),
            displayName: "interval-ms",
            description: "Mining interval (ms).  0 = disable interval mining.",
        }),
    },
    description: "Enable interval mining on a debug chain",
    handler: async function ({ endpoint, interval }) {
        const intervalMS = parseInt(interval || "1000");
        const provider = new ethers.JsonRpcProvider(endpoint);
        await provider.send("evm_setAutomine", [false]);
        await provider.send("evm_setIntervalMining", [intervalMS]);
    },
});
exports.local = (0, cmd_ts_1.subcommands)({
    name: "local",
    description: "Commands for local (debug) networks",
    cmds: {
        ethkeygen: exports.ethkeygen,
        fund,
        trace,
        "interval-mining": intervalMining,
        "get-receipt": getReceipt,
        send: exports.send,
        balance: exports.balance,
        "gas-price": gasPrice,
    },
});
//# sourceMappingURL=local.js.map