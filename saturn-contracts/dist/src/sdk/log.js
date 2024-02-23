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
exports.error = exports.warning = exports.info = exports.debug = void 0;
const winston_1 = require("winston");
const process = __importStar(require("node:process"));
let logger;
function getLogger() {
    if (!logger) {
        const level = process.env["SATURN_LOG_LEVEL"] || "info";
        const levels = ["debug", "info", "warning", "error"];
        logger = (0, winston_1.createLogger)({
            level: level,
            transports: [
                new winston_1.transports.Console({
                    consoleWarnLevels: levels,
                    stderrLevels: levels,
                    debugStdout: false,
                }),
            ],
            format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.timestamp(), winston_1.format.printf(({ timestamp, level, message }) => {
                return `[${timestamp}] ${level}: ${message}`;
            })),
        });
    }
    return logger;
}
function debug(msg) {
    getLogger().debug(msg);
}
exports.debug = debug;
function info(msg) {
    getLogger().info(msg);
}
exports.info = info;
function warning(msg) {
    getLogger().warning(msg);
}
exports.warning = warning;
function error(msg) {
    getLogger().error(msg);
}
exports.error = error;
//# sourceMappingURL=log.js.map