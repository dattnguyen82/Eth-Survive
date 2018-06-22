pragma solidity ^0.4.17;

// ----------------------------------------------------------------------------------
// Survive is a survival game, in which payers pay to stay alive
// Dat Nguyen - 2017
// ----------------------------------------------------------------------------------

import "../installed/SafeMath.sol";
import "../installed/Withdrawable.sol";
import "../installed/Pausable.sol";
import "../installed/Refundable.sol";

contract Survive is  Withdrawable, Pausable, Refundable {

    using SafeMath for uint;

    uint entryFee;
    uint cureFee;
    uint killTime;
    uint cooldown;

    struct Player {
        address owner;
        bool isAlive;
        bool isInfected;
        uint infectedTime;
        uint immuneTime;
        uint balance;
        bool initialized;
    }

    address[] playerAddresses;
    mapping(address => Player) playerMap;

    modifier idValid(uint _id) {
        require(_id >= 0 && _id < playerAddresses.length);
        _;
    }

    constructor(uint _entryFee, uint _cureFee, uint _killTime, uint _cooldown) public {
        entryFee = _entryFee;
        cureFee = _cureFee;
        cooldown = _cooldown;
        killTime = _killTime;
    }

    function join() isNotPaused() public payable returns (bool _joined) {
        require(msg.value >= entryFee);
        uint balance = msg.value.sub(entryFee);
        playerAddresses.push(msg.sender);
        playerMap[msg.sender] = Player(msg.sender, true, false, 0,  0, balance, true);
        emit playerJoinedEvent(msg.sender, now);
        return true;
    }

    function cure() public isNotPaused() payable returns (bool _cured){
        return _cure(msg.sender, msg.value);
    }

    function infect(address _owner)  public isNotPaused() isOwner() returns (uint _infectedCount, bool _infected) {
        return _infect(_owner);
    }

    function settleGame() public isNotPaused() isOwner() returns (uint _prize) {
        uint prize = 0;
        address winner = address(0);
        uint alive = getAliveCount();
        uint prizeBalance = address(this).balance;
        if (address(this).balance >= entryFee.mul(2))
        {
            prize = prizeBalance.div(alive+1); //survive game contract keeps the equivalent of 1 entry fee for processing
            for (uint i=0; i<playerAddresses.length; i++)  {
                if (playerMap[playerAddresses[i]].isAlive==true)  {
                    playerMap[playerAddresses[i]].owner.transfer(prize);
                    winner = playerMap[playerAddresses[i]].owner;
                    emit playerAwardedEvent(playerMap[playerAddresses[i]].owner, prize);
                }
            }
        }
        emit gameSettledEvent(alive, prize, address(this).balance);
        return prize;
    }

    function getPlayer(address _ownerAddress) public view returns( address _owner, bool _isAlive, bool _isInfected, uint _infectedTime, uint _immuneTime, uint _balance, bool _initialized ){
        return ( playerMap[_ownerAddress].owner, playerMap[_ownerAddress].isAlive, playerMap[_ownerAddress].isInfected, playerMap[_ownerAddress].infectedTime, playerMap[_ownerAddress].immuneTime,  playerMap[_ownerAddress].balance,  playerMap[_ownerAddress].initialized  );
    }

    function getGameData() public view returns (uint _entryFee, uint _cureFee, uint _killTime, uint _cooldown){
        return (entryFee, cureFee, killTime, cooldown);
    }

    function getInfectedCount() public view returns (uint _infectedCount) {
        uint infected=0;
        for (uint i=0; i<playerAddresses.length; i++)  {
            if (playerMap[playerAddresses[i]].isInfected==true) {
                infected++;
            }
        }
        return infected;
    }

    function getAliveCount() public view returns (uint _aliveCount) {
        uint alive=0;
        for (uint i=0; i<playerAddresses.length; i++)  {
            if ( playerMap[playerAddresses[i]].isAlive==true ) {
                alive++;
            }
        }
        return alive;
    }

    function getPlayerCount() public view returns (uint _playerCount) {
        return playerAddresses.length;
    }

    function () isNotPaused() public payable {
        if (playerMap[msg.sender].initialized == false)
        {
            join();
        }
        else
        {
            cure();
        }
    }

    function _cure(address _owner, uint fee) internal returns (bool _cured) {
        bool cured = false;
        uint cureTime = now;

        if (playerMap[_owner].balance + fee < cureFee) {
            revert();
        }

        playerMap[_owner].balance = playerMap[_owner].balance.add(fee);

        if ( playerMap[_owner].isInfected )
        {
            playerMap[_owner].isInfected = false;
            playerMap[_owner].immuneTime = cureTime + cooldown;
            playerMap[_owner].balance = playerMap[_owner].balance.sub(cureFee);
            cured = true;
        }

        emit playerBalanceUpdatedEvent(playerMap[_owner].owner, playerMap[_owner].balance);
        emit playerCuredEvent(playerMap[_owner].owner, cured, cureTime);

        return cured;
    }

    function _infect(address _owner) internal returns (uint _infectedCount, bool _infected) {
        bool infected = false;

        if ( playerMap[_owner].isInfected != true && playerMap[_owner].immuneTime < now) {
            playerMap[_owner].isInfected = true;
            playerMap[_owner].infectedTime = now;

            emit playerInfectedEvent(playerMap[_owner].owner, playerMap[_owner].infectedTime);
        }

        if ( playerMap[_owner].balance > cureFee ) {
            _cure(playerMap[_owner].owner, 0);
        }

        uint count = getInfectedCount();

        killInfectedPlayers();

        return (count, infected);
    }

    function killInfectedPlayers() internal returns (uint _aliveCount)
    {
        for (uint i=0; i<playerAddresses.length; i++)  {
            if (playerMap[playerAddresses[i]].isInfected && playerMap[playerAddresses[i]].infectedTime + killTime <= now) {
                playerMap[playerAddresses[i]].isInfected = false;
                playerMap[playerAddresses[i]].infectedTime = 0;
                playerMap[playerAddresses[i]].isAlive = false;
                playerMap[playerAddresses[i]].immuneTime = 0;

                emit playerKilledEvent(playerMap[playerAddresses[i]].owner, now);
            }
        }

        return getAliveCount();
    }

    function reset() internal returns (bool _reset)
    {
        for (uint i=0; i<playerAddresses.length; i++)  {
            playerMap[playerAddresses[i]].isInfected = false;
            playerMap[playerAddresses[i]].isAlive = false;
            playerMap[playerAddresses[i]].infectedTime = 0;
            playerMap[playerAddresses[i]].immuneTime = 0;
        }
        return true;
    }

    event playerInfectedEvent(address owner, uint infectedTime);
    event playerKilledEvent(address owner, uint killTime);
    event playerAwardedEvent(address owner, uint prize);
    event gameSettledEvent(uint winners, uint prize, uint contractBalance);
    event playerCuredEvent(address owner, bool cured, uint cureTime);
    event playerBalanceUpdatedEvent(address owner, uint balance);
    event playerJoinedEvent(address player, uint joinTime);
}
