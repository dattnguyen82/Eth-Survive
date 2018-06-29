let util = require('./survive-util');
let Web3 = require('web3');
let gamePersistence = require('./game-persistence');
let environment = require('./environment');

var init = async () => {
	let surviveContract = await util.getContract(util.getWeb3(environment.web3Provider_ws));

	//Player Balance Event
	surviveContract.events.playerBalanceUpdatedEvent({
		fromBlock: 0
	}, async (error, event) =>  {
		let player = {
			address: event.returnValues.owner,
			balance: Web3.utils.fromWei(event.returnValues.balance, "ether")
		};
		var result = await gamePersistence.updatePlayerBalance(player);
		console.log("Player " + player.address + " balanced updated: " + player.balance);
	}).on ('data', (event) => {
		// console.log(event); // same results as the optional callback above
	}).on('changed', (event) => {
		// console.log(event);
	}).on('error', console.error);
};

init().then((resolve, reject) => {
	console.log("Player-Infected-Event registered");
});
