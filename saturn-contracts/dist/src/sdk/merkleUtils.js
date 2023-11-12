"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeMerkleProof = exports.computeMerkleRoot = exports.createMerkleIntervalProof = exports.verifyMerkelInterval = exports.computeMerkleIntervalRoot = exports.evmHashFn = void 0;
const ethers_1 = require("ethers");
const assert_1 = require("assert");
function evmHashFn(l, r) {
    return (0, ethers_1.keccak256)((0, ethers_1.concat)([l, r]));
}
exports.evmHashFn = evmHashFn;
/// Given a contiguous series (an "interval") of leaf digests and a proof for
/// it, compute the root of a Merkle tree.
function computeMerkleIntervalRoot(hashFn, depth, offset, interval, intervalProof) {
    // Repeatedly process our known interval from each row, pulling extra
    // entries from the proof as required.  After d iterations, we have a single
    // entry - the Merkle root.
    let proofIdx = 0;
    for (let d = depth; d > 0; --d) {
        const newRow = [];
        const newOffset = offset >> 1;
        //   newRow:    AB    CD    EF    GH
        //              /\    /\    /\    /\
        //   row:      A  B  C  D  E  F  G  H
        //
        // Example 1:
        //
        // If we have [B, C, D] (offset = 1), we compute [AB, CD] in the next row,
        // and thus require A from the proof.
        //
        // Example 2:
        //
        // If we have [B, C, D, E] (offset = 1), we compute [AB, CD, EF] in the
        // next row, and thus require A and F from proof.
        let entryIdx = 0; // index within out interval (not the row)
        let remainingEntries = interval.length; // unconsumed entries in interval
        // If offset is odd, absorb an element on the left.
        if (offset & 1) {
            newRow.push(hashFn(intervalProof[proofIdx++], interval[entryIdx++]));
            --remainingEntries;
        }
        // Process all remaining pairs in the current interval (potentially
        // leaving one entry).
        while (remainingEntries > 1) {
            newRow.push(hashFn(interval[entryIdx++], interval[entryIdx++]));
            remainingEntries -= 2;
        }
        // If an element remains, we absorb an element from the proof to use on
        // the right.
        (0, assert_1.strict)(remainingEntries === 0 || remainingEntries === 1);
        if (remainingEntries === 1) {
            newRow.push(hashFn(interval[entryIdx], intervalProof[proofIdx++]));
        }
        interval = newRow;
        offset = newOffset;
    }
    (0, assert_1.strict)(interval.length === 1);
    return interval[0];
}
exports.computeMerkleIntervalRoot = computeMerkleIntervalRoot;
/// Verify a Merkle proof for a tree with a given interval of leaf elements
/// and expected root.
function verifyMerkelInterval(hashFn, root, depth, offset, interval, intervalProof) {
    const merkleRoot = computeMerkleIntervalRoot(hashFn, depth, offset, interval, intervalProof);
    return root == merkleRoot;
}
exports.verifyMerkelInterval = verifyMerkelInterval;
/// Return a (proof, root) pair for a Merkle tree in which the verifier knows
/// the contiguous series ("interval") of leaf nodes specified by `offset` and
/// `numEntries`.
function createMerkleIntervalProof(hashFn, leafNodes, offset, numEntries) {
    //           ABCDEFGH
    //           /      \
    //       ABCD        EFGH
    //       /  \        /  \
    //     AB    CD    EF    GH
    //     /\    /\    /\    /\
    //    A  B  C  D  E  F  G  H
    const proof = [];
    const depth = Math.ceil(Math.log2(leafNodes.length));
    (0, assert_1.strict)(leafNodes.length == 1 << depth);
    let row = leafNodes;
    for (let d = depth; d > 0; --d) {
        // console.log(`depth: ${d}, row: ${JSON.stringify(row)}`);
        // console.log(`offset: ${offset}, numEntries: ${numEntries}`);
        const rowLength = row.length;
        // In each iteration, as well as computing the next row, we add enough
        // elements to the proof so that the verifier can compute sufficient
        // elements of the next row.
        //
        //   newRow:    AB    CD    EF    GH
        //              /\    /\    /\    /\
        //   row:      A  B  C  D  E  F  G  H
        //
        // Example:
        //
        // If the verifier knows [B, C, D] (offset = 1, numEntries = 3), he will
        // compute [AB, CD] in the next row.  He therefore needs A from this row.
        //
        // If the verifier knows [B, C, D, E] (offset = 1, numEntries = 4), he
        // will compute [AB, CD, EF] in the next row.  He therefore needs both A
        // and F from this row.
        // Track the number of entries the verifier will have, including entries
        // from the proof.
        let numAvailableEntries = numEntries;
        // If `offset` is odd, push an element on the left from this row.
        if (offset & 1) {
            proof.push(row[offset - 1]);
            ++numAvailableEntries;
        }
        // Compute the index of the final entry in this rows.  If it is even, we
        // need a proof element on the right.
        const finalEntryIdx = offset + numEntries - 1;
        if (!(finalEntryIdx & 1)) {
            proof.push(row[finalEntryIdx + 1]);
            ++numAvailableEntries;
        }
        // Compute the entire next row
        const newRow = [];
        for (let i = 0; i < rowLength;) {
            newRow.push(hashFn(row[i++], row[i++]));
        }
        // Determine what information the verifier has about the next row, and
        // iterate.  `offset` in the next row will always be (floor) `offset/2`, and
        // the verifier will have computed exactly `numAvailableEntries / 2` entries
        // in the next row.
        offset = offset >> 1;
        numEntries = numAvailableEntries >> 1;
        row = newRow;
    }
    (0, assert_1.strict)(row.length === 1);
    return { proof, root: row[0] };
}
exports.createMerkleIntervalProof = createMerkleIntervalProof;
function computeMerkleRoot(hashFn, leafNodes) {
    let numEntries = leafNodes.length;
    (0, assert_1.strict)(((numEntries - 1) & numEntries) == 0, "assert POT");
    while (numEntries > 1) {
        // allocate a new array
        const entries = [];
        let destIdx = 0;
        for (let srcIdx = 0; srcIdx < numEntries;) {
            entries[destIdx++] = hashFn(leafNodes[srcIdx++], leafNodes[srcIdx++]);
        }
        leafNodes = entries;
        numEntries = entries.length;
    }
    return leafNodes[0];
}
exports.computeMerkleRoot = computeMerkleRoot;
function computeMerkleProof(hashFn, leafNodes, location) {
    const proof = [];
    let numEntries = leafNodes.length;
    while (numEntries > 1) {
        (0, assert_1.strict)(((numEntries - 1) & numEntries) == 0, "assert POT");
        // select the left of right value for the proof
        if ((location & 1) == 0) {
            proof.push(leafNodes[location + 1]);
        }
        else {
            proof.push(leafNodes[location - 1]);
        }
        // compute the next row
        const entries = [];
        let destIdx = 0;
        for (let srcIdx = 0; srcIdx < numEntries;) {
            entries[destIdx++] = hashFn(leafNodes[srcIdx++], leafNodes[srcIdx++]);
        }
        location = location >> 1;
        leafNodes = entries;
        numEntries = entries.length;
    }
    return { root: leafNodes[0], proof };
}
exports.computeMerkleProof = computeMerkleProof;
//# sourceMappingURL=merkleUtils.js.map