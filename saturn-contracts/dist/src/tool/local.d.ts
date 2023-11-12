export declare const ethkeygen: Partial<import("cmd-ts/dist/cjs/argparser").Register> & {
    parse(context: import("cmd-ts/dist/cjs/argparser").ParseContext): Promise<import("cmd-ts/dist/cjs/argparser").ParsingResult<{
        keyfile: string;
        password: string;
    }>>;
} & import("cmd-ts/dist/cjs/helpdoc").PrintHelp & import("cmd-ts/dist/cjs/helpdoc").ProvidesHelp & import("cmd-ts/dist/cjs/helpdoc").Named & Partial<import("cmd-ts/dist/cjs/helpdoc").Versioned> & import("cmd-ts/dist/cjs/argparser").Register & import("cmd-ts/dist/cjs/runner").Handling<{
    keyfile: string;
    password: string;
}, Promise<void>> & {
    run(context: import("cmd-ts/dist/cjs/argparser").ParseContext): Promise<import("cmd-ts/dist/cjs/argparser").ParsingResult<Promise<void>>>;
} & Partial<import("cmd-ts/dist/cjs/helpdoc").Versioned & import("cmd-ts/dist/cjs/helpdoc").Descriptive & import("cmd-ts/dist/cjs/helpdoc").Aliased>;
export declare const send: Partial<import("cmd-ts/dist/cjs/argparser").Register> & {
    parse(context: import("cmd-ts/dist/cjs/argparser").ParseContext): Promise<import("cmd-ts/dist/cjs/argparser").ParsingResult<{
        endpoint: string;
        keyfile: string;
        password: string;
        destination: string;
        amount: string;
    }>>;
} & import("cmd-ts/dist/cjs/helpdoc").PrintHelp & import("cmd-ts/dist/cjs/helpdoc").ProvidesHelp & import("cmd-ts/dist/cjs/helpdoc").Named & Partial<import("cmd-ts/dist/cjs/helpdoc").Versioned> & import("cmd-ts/dist/cjs/argparser").Register & import("cmd-ts/dist/cjs/runner").Handling<{
    endpoint: string;
    keyfile: string;
    password: string;
    destination: string;
    amount: string;
}, Promise<void>> & {
    run(context: import("cmd-ts/dist/cjs/argparser").ParseContext): Promise<import("cmd-ts/dist/cjs/argparser").ParsingResult<Promise<void>>>;
} & Partial<import("cmd-ts/dist/cjs/helpdoc").Versioned & import("cmd-ts/dist/cjs/helpdoc").Descriptive & import("cmd-ts/dist/cjs/helpdoc").Aliased>;
export declare const balance: Partial<import("cmd-ts/dist/cjs/argparser").Register> & {
    parse(context: import("cmd-ts/dist/cjs/argparser").ParseContext): Promise<import("cmd-ts/dist/cjs/argparser").ParsingResult<{
        endpoint: string;
        keyfile: string;
        address: string | undefined;
    }>>;
} & import("cmd-ts/dist/cjs/helpdoc").PrintHelp & import("cmd-ts/dist/cjs/helpdoc").ProvidesHelp & import("cmd-ts/dist/cjs/helpdoc").Named & Partial<import("cmd-ts/dist/cjs/helpdoc").Versioned> & import("cmd-ts/dist/cjs/argparser").Register & import("cmd-ts/dist/cjs/runner").Handling<{
    endpoint: string;
    keyfile: string;
    address: string | undefined;
}, Promise<void>> & {
    run(context: import("cmd-ts/dist/cjs/argparser").ParseContext): Promise<import("cmd-ts/dist/cjs/argparser").ParsingResult<Promise<void>>>;
} & Partial<import("cmd-ts/dist/cjs/helpdoc").Versioned & import("cmd-ts/dist/cjs/helpdoc").Descriptive & import("cmd-ts/dist/cjs/helpdoc").Aliased>;
export declare const local: Partial<import("cmd-ts/dist/cjs/argparser").Register> & {
    parse(context: import("cmd-ts/dist/cjs/argparser").ParseContext): Promise<import("cmd-ts/dist/cjs/argparser").ParsingResult<{
        command: "ethkeygen";
        args: {
            keyfile: string;
            password: string;
        };
    } | {
        command: "send";
        args: {
            endpoint: string;
            keyfile: string;
            password: string;
            destination: string;
            amount: string;
        };
    } | {
        command: "balance";
        args: {
            endpoint: string;
            keyfile: string;
            address: string | undefined;
        };
    } | {
        command: "fund";
        args: {
            endpoint: string;
            address: string;
        };
    } | {
        command: "trace";
        args: {
            endpoint: string;
            traceFile: string;
            txHash: string;
        };
    } | {
        command: "get-receipt";
        args: {
            endpoint: string;
            txHash: string;
        };
    } | {
        command: "gas-price";
        args: {
            endpoint: string;
        };
    } | {
        command: "interval-mining";
        args: {
            endpoint: string;
            interval: string | undefined;
        };
    }>>;
} & import("cmd-ts/dist/cjs/helpdoc").Named & Partial<import("cmd-ts/dist/cjs/helpdoc").Descriptive & import("cmd-ts/dist/cjs/helpdoc").Versioned> & import("cmd-ts/dist/cjs/helpdoc").PrintHelp & Partial<import("cmd-ts/dist/cjs/helpdoc").Versioned> & import("cmd-ts/dist/cjs/argparser").Register & import("cmd-ts/dist/cjs/runner").Handling<{
    command: "ethkeygen";
    args: {
        keyfile: string;
        password: string;
    };
} | {
    command: "send";
    args: {
        endpoint: string;
        keyfile: string;
        password: string;
        destination: string;
        amount: string;
    };
} | {
    command: "balance";
    args: {
        endpoint: string;
        keyfile: string;
        address: string | undefined;
    };
} | {
    command: "fund";
    args: {
        endpoint: string;
        address: string;
    };
} | {
    command: "trace";
    args: {
        endpoint: string;
        traceFile: string;
        txHash: string;
    };
} | {
    command: "get-receipt";
    args: {
        endpoint: string;
        txHash: string;
    };
} | {
    command: "gas-price";
    args: {
        endpoint: string;
    };
} | {
    command: "interval-mining";
    args: {
        endpoint: string;
        interval: string | undefined;
    };
}, {
    command: "ethkeygen";
    value: Promise<void>;
} | {
    command: "send";
    value: Promise<void>;
} | {
    command: "balance";
    value: Promise<void>;
} | {
    command: "fund";
    value: Promise<undefined>;
} | {
    command: "trace";
    value: Promise<void>;
} | {
    command: "get-receipt";
    value: Promise<void>;
} | {
    command: "gas-price";
    value: Promise<void>;
} | {
    command: "interval-mining";
    value: Promise<void>;
}> & {
    run(context: import("cmd-ts/dist/cjs/argparser").ParseContext): Promise<import("cmd-ts/dist/cjs/argparser").ParsingResult<{
        command: "ethkeygen";
        value: Promise<void>;
    } | {
        command: "send";
        value: Promise<void>;
    } | {
        command: "balance";
        value: Promise<void>;
    } | {
        command: "fund";
        value: Promise<undefined>;
    } | {
        command: "trace";
        value: Promise<void>;
    } | {
        command: "get-receipt";
        value: Promise<void>;
    } | {
        command: "gas-price";
        value: Promise<void>;
    } | {
        command: "interval-mining";
        value: Promise<void>;
    }>>;
};
