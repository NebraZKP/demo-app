// SPDX-License-Identifier: UNLICENSED
/*
    Saturn is Nebra's first generation proof aggregation engine
                                         _.oo.
                 _.u[[/;:,.         .odMMMMMM'
              .o888UU[[[/;:-.  .o@P^    MMM^
             oN88888UU[[[/;::-.        dP^
            dNMMNN888UU[[[/;:--.   .o@P^
           ,MMMMMMN888UU[[/;::-. o@^
           NNMMMNN888UU[[[/~.o@P^
           888888888UU[[[/o@^-..
          oI8888UU[[[/o@P^:--..
       .@^  YUU[[[/o@^;::---..
     oMP     ^/o@P^;:::---..
  .dMMM    .o@^ ^;::---...
 dMMMMMMM@^`       `^^^^
YMMMUP^
 ^^
*/
pragma solidity ^0.8.17;

/// A Groth16 proof (with Fq2 elements reversed, to be compatible with the EVM
/// precompiled contracts).
struct Proof {
    uint256[2] pA;
    uint256[2][2] pB;
    uint256[2] pC;
}

/// A Groth16 verification key.  This is primarily used by off-chain
/// aggregators, and therefore Fq2 elements use the "natural" ordering, not
/// the EVM-precompiled-contract-compatible ordering.  The generic
/// IGroth16Verifier contract is expected to fix the ordering internally.
struct VK {
    uint256[2] alpha;
    uint256[2][2] beta;
    uint256[2][2] gamma;
    uint256[2][2] delta;
    uint256[2][] s;
}

// Contract receiving proofs to be aggregated.
interface ISaturnProofReceiver {
    /// Emitted when an application VK is registered.
    event VKRegistered(uint256 indexed circuitId, VK vk);

    /// Emitted when an application proof is submitted to the receiver
    /// contract.
    event ProofSubmitted(
        uint256 indexed circuitId,
        bytes32 indexed proofId,
        uint64 submissionIdx,
        uint64 proofIdx,
        Proof proof,
        uint256[] publicInputs
    );

    /// Returns the maximum number of proofs that can be submitted at once.  0
    /// indicates that the contract itself does not impose a limit.
    function maxNumProofsPerSubmission() external view returns (uint256);

    /// Register a circuit.  A circuit must be registered before proofs for it
    /// can be submitted.
    function registerVK(VK calldata vk) external returns (uint256 circuitId);

    /// Submit a proof that publicInputs is valid for the circuit `circuitId`.
    function submit(
        uint256[] calldata circuitIds,
        Proof[] calldata proofs,
        uint256[][] calldata publicInputs
    ) external payable returns (bytes32 submissionId);

    /// Estimate the fee required to submit `numProofs`.
    function estimateFee(uint16 numProofs) external view returns (uint256);
}
