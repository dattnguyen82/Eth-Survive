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

    //Game Functions
    function join() isNotPaused() public payable returns (bool _joined) {
        require(msg.value >= entryFee);
        uint balance = msg.value.sub(entryFee);
        playerAddresses.push(msg.sender);
        playerMap[msg.sender] = Player(msg.sender, true, false, 0,  0, balance, true);
        emit playerJoinedEvent(playerMap[msg.sender].owner, now, balance);
        return true;
    }

    function cure() public isNotPaused() payable returns (bool _cured){
        return _cure(msg.sender, msg.value);
    }

    function infect(address _owner) public isNotPaused() isOwner() returns (uint _infectedCount, bool _infected) {
        emit playerAttemptInfectEvent(playerMap[_owner].owner);
        return _infect(_owner);
    }

    function killPlayer(address _ownerAddress) public isOwner() returns (address _owner) {
        return _kill(_ownerAddress);
    }

    function settleGame(bool _forceKillInfectedPlayers) public isNotPaused() isOwner() returns (uint _prize) {
        uint prize = 0;
        address winner = address(0);
        uint alive = getAliveCount();
        uint prizeBalance = address(this).balance;

        if (_forceKillInfectedPlayers) {
            _killInfectedPlayers(true);
        }

        if (address(this).balance >= entryFee.mul(2)) {
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

        reset();

        return prize;
    }

    function resetGame() public isNotPaused() isOwner() returns (bool _reset) {
        return reset();
    }

    //Game/Player Info
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

    function getPrizePool() public view returns (uint _prize) {
        return address(this).balance;
    }

    function getPlayerByIndex(uint index) public isOwner() view returns ( address _owner, bool _isAlive, bool _isInfected, uint _infectedTime, uint _immuneTime, uint _balance, bool _initialized ) {

        return getPlayer(playerAddresses[index]);
    }

    //Payable Fallback
    function () isNotPaused() public payable {
        if (playerMap[msg.sender].initialized == false){
            join();
        }
        else if ( playerMap[msg.sender].isAlive == true && playerMap[msg.sender].isInfected ) {
            _cure(msg.sender,msg.value );
        }
        else {
            _reentry(msg.sender, msg.value);
        }
    }

    //Internal Functions
    function _updateBalance(address _ownerAddress, uint amount, bool add) internal {
        if (add==true){
            playerMap[_ownerAddress].balance = playerMap[_ownerAddress].balance.add(amount);
        }
        else {
            playerMap[_ownerAddress].balance = playerMap[_ownerAddress].balance.sub(amount);
        }

        emit playerBalanceUpdatedEvent(playerMap[_ownerAddress].owner, playerMap[_ownerAddress].balance);
    }

    function _reentry(address _ownerAddress, uint amount) internal returns (address _owner, bool _isAlive, bool _isInfected, uint _infectedTime, uint _immuneTime, uint _balance, bool _initialized) {
        _updateBalance(_ownerAddress, amount, true);
        return getPlayer(_ownerAddress);
    }

    function _cure(address _owner, uint fee) internal returns (bool _cured) {
        bool cured = false;
        uint cureTime = now;

        _updateBalance(_owner, fee, true);

        if (  playerMap[_owner].balance + fee < cureFee  ) {
            revert();
        }

        if ( playerMap[_owner].isInfected )
        {
            playerMap[_owner].isInfected = false;
            playerMap[_owner].immuneTime = cureTime + cooldown;
            _updateBalance(_owner, cureFee, false);
            cured = true;
        }

        emit playerCuredEvent(playerMap[_owner].owner, cured, cureTime);

        return cured;
    }

    function _infect(address _owner) internal returns (uint _infectedCount, bool _infected) {
        bool infected = false;

        if ( playerMap[_owner].isInfected == false && playerMap[_owner].immuneTime < now) {
            playerMap[_owner].isInfected = true;
            playerMap[_owner].infectedTime = now;

            emit playerInfectedEvent(playerMap[_owner].owner, playerMap[_owner].infectedTime);

            infected = true;
        }

        if ( playerMap[_owner].balance > cureFee ) {
            _cure(playerMap[_owner].owner, 0);
        }

        uint count = getInfectedCount();

        _killInfectedPlayers(false);

        return (count, infected);
    }

    function _kill(address _ownerAddress) internal returns ( address _owner ) {
        playerMap[_ownerAddress].isInfected = false;
        playerMap[_ownerAddress].infectedTime = 0;
        playerMap[_ownerAddress].isAlive = false;
        playerMap[_ownerAddress].immuneTime = 0;

        emit playerKilledEvent(playerMap[_ownerAddress].owner, now);

        return playerMap[_ownerAddress].owner;
    }

    function _killInfectedPlayers(bool force) internal returns (uint _aliveCount)
    {
        for (uint i=0; i<playerAddresses.length; i++)  {
            address owner = playerAddresses[i];
            if ( (playerMap[owner].isInfected && playerMap[owner].infectedTime + killTime <= now) || (playerMap[owner].isInfected && force==true)) {
                _kill(owner);
            }
        }

        return getAliveCount();
    }

    function reset() internal returns (bool _reset)
    {
        for (uint i=0; i<playerAddresses.length; i++)  {
            address owner = playerAddresses[i];

            if (playerMap[owner].balance >= entryFee) {
                playerMap[owner].isAlive = true;
                _updateBalance(owner, entryFee, false);
            }

            playerMap[owner].isInfected = false;
            playerMap[owner].infectedTime = 0;
            playerMap[owner].immuneTime = 0;
        }

        emit gameResetEvent(now);

        return true;
    }


    //Player Events
    event playerAttemptInfectEvent(address owner);
    event playerInfectedEvent(address owner, uint infectedTime);
    event playerKilledEvent(address owner, uint killTime);
    event playerAwardedEvent(address owner, uint prize);
    event playerCuredEvent(address owner, bool cured, uint cureTime);
    event playerBalanceUpdatedEvent(address owner, uint balance);
    event playerJoinedEvent(address player, uint joinTime, uint balance);

    //Game Events
    event gameSettledEvent(uint winners, uint prize, uint contractBalance);
    event gameResetEvent(uint timestamp);
}
