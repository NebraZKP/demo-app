export type SnarkJSG1 = [string, string, string];
export type SnarkJSG2 = [[string, string], [string, string], [string, string]];
export type SnarkJSVKey = {
    vk_alpha_1: SnarkJSG1;
    vk_beta_2: SnarkJSG2;
    vk_gamma_2: SnarkJSG2;
    vk_delta_2: SnarkJSG2;
    IC: SnarkJSG1[];
    nPublic: number;
    curve: string;
    protocol: string;
};
export type SnarkJSProof = {
    pi_a: SnarkJSG1;
    pi_b: SnarkJSG2;
    pi_c: SnarkJSG1;
    protocol: string;
    curve: string;
};
export type SnarkJSProveOutput = {
    proof: SnarkJSProof;
    publicSignals: bigint[];
};
export type SignalValueType = string | number | bigint | SignalValueType[];
export interface ProveInputSignals {
    [signal: string]: SignalValueType;
}
export declare const groth16: {
    fullProve: (input: ProveInputSignals, wasmFile: string, zkeyFileName: string, logger?: any) => Promise<SnarkJSProveOutput>;
    verify: (vk: SnarkJSVKey, publicSignals: (string | bigint)[], proof: SnarkJSProof, logger?: any) => Promise<boolean>;
};
