let util = require('./survive-util');
let gamePersistence = require('./game-persistence');

var init = async () => {
	let surviveContract = await util.getContract(util.getWeb3("ws://127.0.0.1:8545"));

	//Player Infected Event
	surviveContract.events.playerJoinedEvent({
		fromBlock: 0
	}, async (error, event) => {
		let player = {
			address: event.returnValues.player,
			joinTime: parseInt(event.returnValues.joinTime),
			blockIdx: event.blockNumber,
			balance: event.returnValues.balance,
			blockHash: event.blockHash
		};
		var result = await gamePersistence.upsertPlayer(player);
		console.log("Player " + player.address + " joined" + " at block " + player.blockIdx);
	}).on('data', (event) => {
		// console.log(event); // same results as the optional callback above
	}).on('changed', (event) => {
		// console.log(event);
	}).on('error', (error) => console.error(error));
};


init().then((resolve, reject) => {
	console.log("Player-Joined-Event registered");
});
