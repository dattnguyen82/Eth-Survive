
let scheduler = require("node-schedule");
let ethContract = require("./contract-interface");
let surviveEvents = require("./survive-events");
let persistence = require("./game-persistence");


exports.getGameData = async () => {
	result = {};

	var gameData = await ethContract.getGameData();

	result.entryFee = gameData._entryFee;
	result.cureFee = gameData._cureFee;
	result.killTime = gameData._killTime;
	result.cooldown = gameData._cooldown;
	result.totalPlayers = await gamePersistence.getPlayerCount();
	result.totalPrizePool = await ethContract.getPrizePool();

	return result;
};

exports.infectRandomPlayer = async () => {
	var count = await persistence.getPlayerCount();
	var randomCount = Math.min(count / 10, 1);
	var result = await persistence.getRandomPlayers(randomCount+1);

	for (var i=0; i<result.length; i++)
	{
		var r = await ethContract.infect(result[i]);
		console.log(r);
	}

	// var settleGameResult = await ethContract.settleGame();
	// // console.log(settleGameResult);
	//
	// var resetGameResult = await ethContract.resetGame();
	// // console.log(resetGameResult);
};

var settleGameJob = scheduler.scheduleJob('* * 0 * * *', async () => {

	var gameData = await exports.getGameData();

	console.log("Setting Game");
	console.log(gameData);

	var result = await ethContract.settleGame();
	console.log(result);
});


var infectJob = scheduler.scheduleJob('00 * * * *', async () => {
	exports.infectRandomPlayer();
});



// ethContract.infect('0xA6EA26C1F7cCe98Ae736Ba441642Efe003a02f92').then((error, result)=>{
// 	console.log(result);
// });


