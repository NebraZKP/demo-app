export declare const submitAggregatedProof: Partial<import("cmd-ts/dist/cjs/argparser").Register> & {
    parse(context: import("cmd-ts/dist/cjs/argparser").ParseContext): Promise<import("cmd-ts/dist/cjs/argparser").ParsingResult<{
        endpoint: string;
        keyfile: string;
        password: string;
        instance: string;
        wait: boolean;
        estimateGas: boolean;
        dumpTx: boolean;
        maxFeePerGasGwei: string;
        calldataFile: string;
        proofIdsFile: string;
        submissionProofFiles: string[];
    }>>;
} & import("cmd-ts/dist/cjs/helpdoc").PrintHelp & import("cmd-ts/dist/cjs/helpdoc").ProvidesHelp & import("cmd-ts/dist/cjs/helpdoc").Named & Partial<import("cmd-ts/dist/cjs/helpdoc").Versioned> & import("cmd-ts/dist/cjs/argparser").Register & import("cmd-ts/dist/cjs/runner").Handling<{
    endpoint: string;
    keyfile: string;
    password: string;
    instance: string;
    wait: boolean;
    estimateGas: boolean;
    dumpTx: boolean;
    maxFeePerGasGwei: string;
    calldataFile: string;
    proofIdsFile: string;
    submissionProofFiles: string[];
}, Promise<void>> & {
    run(context: import("cmd-ts/dist/cjs/argparser").ParseContext): Promise<import("cmd-ts/dist/cjs/argparser").ParsingResult<Promise<void>>>;
} & Partial<import("cmd-ts/dist/cjs/helpdoc").Versioned & import("cmd-ts/dist/cjs/helpdoc").Descriptive & import("cmd-ts/dist/cjs/helpdoc").Aliased>;
