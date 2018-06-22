pragma solidity ^0.4.0;

import "./Ownable.sol";

contract Pausable is Ownable {
    bool paused;

    modifier isNotPaused() {
        require(!paused);
        _;
    }

    constructor() public {
        paused = false;
    }

    function pause() public isOwner() returns (bool _paused){
        paused = true;
        return paused;
    }

    function unpause() public isOwner() returns (bool _paused){
        paused = false;
        return paused;
    }

    function isPaused() public view returns (bool _paused) {
        return paused;
    }

}
