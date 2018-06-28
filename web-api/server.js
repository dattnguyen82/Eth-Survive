let express = require('express');
let bodyParser = require('body-parser');
let ethContract = require('./contract-interface');
let gamePersistence = require('./game-persistence');
let gameEngine = require('./game-engine');

let app = express();
let jsonParser = bodyParser.json();

app.set('port', (process.env.PORT || 5000));

app.post('/bet', jsonParser, async (req, res) =>
{
  return res.json("{}")
});

app.get('/results', async (req, res) =>
{
    return res.json("{}")
});

app.get('/players', async (req, res) =>
{
    var result = {};

    result.playerCount = await ethContract.getPlayerCount();
    result.infectedCount = await ethContract.getPlayerInfectedCount();
    result.aliveCount = await ethContract.getPlayerAliveCount();

    return res.json(result);
});

// s( address _owner, bool _isAlive, bool _isInfected, uint _infectedTime, uint _immuneTime, uint _balance, bool _initialized )
app.get('/players/:address', async (req, res) => {
	var playerInfo = {
	    address: req.params.address
    };

    var player = await ethContract.getPlayer(playerInfo);

    console.log(player);

	var result = {
	    address: player._owner,
	    isAlive: player._isAlive,
	    isInfected: player._isInfected,
	    infectedTime: player._infectedTime,
	    immuneTime: player._immuneTime,
		balance: player._balance,
		initialized: player._initialized
    };

	return res.json(result);
});

app.get('/game', async (req, res) =>
{
    var result = await gameEngine.getGameData();
    return res.json(result);
});

app.get('/infect', async (req, res) =>
{
	var result = await exports.infectRandomPlayer();
	return res.json(result);
});


app.get('/settle', async (req, res) =>
{
	var result = await ethContract.settleGame();
	return res.json(result);
});


app.get('/clock', (req, res) =>
{
  var date = new Date();
  res.json({"timestamp": date.getTime() })
});

//////////////////////////////////////////
////////    APP
//////////////////////////////////////////

app.listen(app.get('port'), () => console.log('Survive API') );
