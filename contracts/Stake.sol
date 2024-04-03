// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "./ExternalContract.sol";

contract Stake {
    mapping(address => uint256) public balances;
    uint256 public constant threshold = 1 ether;
    uint256 public deadline = block.timestamp + 72 hours;
    uint public totalStaked;

    function stake() public payable {
        require(block.timestamp < deadline, " Staking Period is Over");
        balances[msg.sender] += msg.value;
        totalStaked += msg.value;
    }

    function withdraw() public {
        require(block.timestamp >= deadline, "Staking period is not over");
        require(
            totalStaked < 1 ether,
            "threshold is already reached, you have succeded! But can't withdraw anymore."
        );

        (bool success, ) = msg.sender.call{value: balances[msg.sender]}("");
        require(success, "Transfer Failed");
        balances[msg.sender] = 0;
        totalStaked -= balances[msg.sender];
        //
    }

    function execute() public {
        require(block.timestamp >= deadline, "Staking periond is not over");
        require(
            totalStaked >= 1 ether,
            "threshold is not reached you can withdraw your funds"
        );

        ExternalContract externalContract = new ExternalContract();
        externalContract.complete{value: address(this).balance}();
        balances[msg.sender] = 0;
        totalStaked = 0;
    }

    function timeLeft() public view returns (uint256) {
        if (block.timestamp >= deadline) {
            return 0;
        } else {
            {
                return deadline - block.timestamp;
            }
        }
    }

    function userBalance() public view returns (uint256) {
        return balances[msg.sender];
    }

    function totalBalance() public view returns (uint256) {
        return totalStaked;
    }

    function tresholdReached() public view returns (bool) {
        return totalStaked >= 1 ether;
    }
}
