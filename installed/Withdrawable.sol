pragma solidity ^0.4.17;
import "./Ownable.sol";

contract Withdrawable is Ownable{

    constructor() public { }

    function withdraw() isOwner public {
        owner.transfer(address(this).balance);
    }
}

