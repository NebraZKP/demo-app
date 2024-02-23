//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.17;

import "./CircuitVerifier.sol";
import "./ISaturnVerifier.sol";

contract SimpleApp is Groth16Verifier {
    string public name = "A Simple App";

    uint256 public proofsVerified = 0;

    // Stores keccak of submitted solutions to prevent duplicates.
    mapping(bytes32 => bool) private solutions;

    // NEBRA's Saturn contract
    ISaturnVerifier public saturnContract;
    // Circuit Identifier for Saturn
    uint256 public circuitId;

    constructor(ISaturnVerifier _saturnContract, uint256 _circuitId) {
        saturnContract = _saturnContract;
        circuitId = _circuitId;
    }

    // Verifies that the given inputs correspond to a solution to the
    // SimpleApp equation (see circuit.circom). Updates the `proofsVerified`
    // count if the solution is correct (where the solution is checked via a
    // zk proof).
    ///
    /// @return r bool true if the given inputs satisfy the equation (as shown
    /// by the associated proof).
    function submitSolution(
        uint256[] calldata solution
    ) public returns (bool r) {
        bool isProofCorrect = saturnContract.isVerified(circuitId, solution);
        require(isProofCorrect, "Proof was not correct");

        bytes32 solutionHash = keccak256(abi.encode(solution));
        require(!solutions[solutionHash], "Solution already submitted");
        solutions[solutionHash] = true;

        proofsVerified++;

        return isProofCorrect;
    }
}
