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
exports.convertvk = void 0;
const cmd_ts_1 = require("cmd-ts");
const utils_1 = require("../sdk/utils");
const application_1 = require("../sdk/application");
const fs = __importStar(require("fs"));
exports.convertvk = (0, cmd_ts_1.command)({
    name: "convert-vk",
    args: {
        snarkjsVkFile: (0, cmd_ts_1.option)({
            type: cmd_ts_1.string,
            long: "snarkjs-vk",
            description: "The verifying key output by SnarkJS, to be converted into\
       a Saturn VK",
        }),
        saturnVkFile: (0, cmd_ts_1.option)({
            type: cmd_ts_1.string,
            long: "saturn-vk",
            description: "The destination for output Saturn verifying key",
        }),
    },
    description: "Convert Groth16 verifying key from SnarkJS to Saturn format",
    handler: async function ({ snarkjsVkFile, saturnVkFile }) {
        const snarkjsVk = (0, utils_1.loadSnarkjsVK)(snarkjsVkFile);
        const saturnVk = application_1.VerifyingKey.from_snarkjs(snarkjsVk);
        fs.writeFileSync(saturnVkFile, JSON.stringify(saturnVk));
    },
});
//# sourceMappingURL=convertVK.js.map