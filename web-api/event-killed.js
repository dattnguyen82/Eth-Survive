let util = require('./survive-util');
let gamePersistence = require('./game-persistence');

var init = async () => {
	let surviveContract = await util.getContract(util.getWeb3("ws://127.0.0.1:8545"));

	//Player Killed Event
	surviveContract.events.playerKilledEvent({
		fromBlock: 0
	}, async (error, event) =>  {
		let player = {
			address: event.returnValues.owner,
			status: 3,
			statusTime:  event.returnValues.killTime
		};
		var result = await gamePersistence.updatePlayerStatus(player);
		console.log("Player " + player.address + " killed at: " + player.statusTime);
	}).on ('data', (event) => {
		// console.log(event); // same results as the optional callback above
	}).on('changed', (event) => {
		// console.log(event);
	}).on('error', console.error);
};

init().then((resolve, reject) => {
	console.log("Player-Killed-Event registered");
});
