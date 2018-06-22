pragma solidity ^0.4.0;

import "./Ownable.sol";

contract Refundable is Ownable {

    mapping(address => uint) paid;

    constructor() public { }

    function refund(address payer) public isOwner() returns (bool _refunded) {
        return refund(payer, paid[payer]);
    }

    function refund(address payer, uint amount) public isOwner() returns (bool _refunded) {
        require(amount <= paid[payer]);
        payer.transfer(amount);
        emit refundIssued(payer, amount);
        return true;
    }

    event refundIssued(address payer, uint amount);

}
