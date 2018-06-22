pragma solidity ^0.4.0;

contract Ownable {

    address owner;

    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor () public {
        owner = msg.sender;
    }

    function transferOwnership(address newOwner) public isOwner() {
        require(newOwner != address(0));
        owner = newOwner;
        emit ownerTransferred(msg.sender, owner);
    }

    event ownerTransferred(address currentOwner, address newOwner);
}
