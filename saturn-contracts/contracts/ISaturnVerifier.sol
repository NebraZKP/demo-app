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

import "./ISaturnProofReceiver.sol";

/// Reference to a single proof in a Submission.  Used by clients to show that
/// a given proof appears in a submission which has been verified as part of
/// an aggregated proof.  Not required for single-proof submissions, since in
/// this case `submissionId == proofId`, and the `merkleProof` and `location`
/// are trivial.
struct ProofReference {
    bytes32 submissionId;
    bytes32[] merkleProof;
    /// Index into the proofs in the submission.  The sequence of proofs
    /// within the submission starts at this index.
    uint16 location;
}

// Contract which verified aggregated proofs.
interface ISaturnVerifier {
    /// Emitted when an application proof is verified as part of an aggregated
    /// proof.  After this event is emitted, `isVerified` will return true for
    /// the given proof.
    event ProofVerified(bytes32 indexed proofId);

    function proofReceiverContract()
        external
        view
        returns (ISaturnProofReceiver);

    function nextSubmissionIdxToVerify() external view returns (uint64);

    // Checks if Saturn has verified a proof that publicInputs is valid for
    // the circuit `circuitId`.
    function isVerified(
        uint256 circuitId,
        uint256[] calldata publicInputs
    ) external view returns (bool);

    // Checks if Saturn has verified a proof that publicInputs is valid for
    // the circuit `circuitId`, where the proof belongs to a multi-proof
    // submission.
    function isVerified(
        uint256 circuitId,
        uint256[] calldata publicInputs,
        ProofReference calldata proofReference
    ) external view returns (bool);

    /// Make a censorship claim that `proof` for `circuitId` with public
    /// inputs `publicInputs` has been skipped by the aggregator.  If the
    /// claim is upheld by the contract (according to the protocol rules - see
    /// the protocol spec), the aggregator will be punished and the claimant
    /// rewarded.
    function challenge(
        uint256 circuitId,
        Proof calldata proof,
        uint256[] calldata publicInputs
    ) external returns (bool challengeSuccessful);
}
