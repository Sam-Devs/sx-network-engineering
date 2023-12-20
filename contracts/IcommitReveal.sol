// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.19;

interface IcommitReveal {
    function commitVote(bytes32 voteCommit) external;
    function revealVote(string memory vote, bytes32 voteCommit) external;
    function getWinner() external view returns (string memory winner);
    function getVoteCommitsArray() external view returns (bytes32[] memory);
}