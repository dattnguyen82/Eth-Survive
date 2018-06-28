let util = require('./survive-util');
let gamePersistence = require('./game-persistence');

var init = async () => {
	let surviveContract = await util.getContract(util.getWeb3("ws://127.0.0.1:8545"));

	//Player Infected Event
	surviveContract.events.playerInfectedEvent({
		fromBlock: 0
	}, async (error, event) =>  {
		console.log(event);
		let player = {
			address: event.returnValues.owner,
			status: 2,
			statusTime:  event.returnValues.infectedTime
		};
		var result = await gamePersistence.updatePlayerStatus(player);
	}).on ('data', (event) => {
		console.log(event); // same results as the optional callback above
	}).on('changed', (event) => {
		console.log(event);
	}).on('error', console.error);
};

init().then((resolve, reject) => {
	console.log("Player-Infected-Event registered");
});
