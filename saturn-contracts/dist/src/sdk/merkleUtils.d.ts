import { BytesLike } from "ethers";
export declare function evmHashFn(l: BytesLike, r: BytesLike): BytesLike;
export declare function computeMerkleIntervalRoot<Digest>(hashFn: (l: Digest, r: Digest) => Digest, depth: number, offset: number, interval: Digest[], intervalProof: Digest[]): Digest;
export declare function verifyMerkelInterval<Digest>(hashFn: (l: Digest, r: Digest) => Digest, root: Digest, depth: number, offset: number, interval: Digest[], intervalProof: Digest[]): boolean;
export declare function createMerkleIntervalProof<Digest>(hashFn: (l: Digest, r: Digest) => Digest, leafNodes: Digest[], offset: number, numEntries: number): {
    proof: Digest[];
    root: Digest;
};
export declare function computeMerkleRoot<Digest>(hashFn: (l: Digest, r: Digest) => Digest, leafNodes: Digest[]): Digest;
export declare function computeMerkleProof<Digest>(hashFn: (l: Digest, r: Digest) => Digest, leafNodes: Digest[], location: number): {
    root: Digest;
    proof: Digest[];
};
