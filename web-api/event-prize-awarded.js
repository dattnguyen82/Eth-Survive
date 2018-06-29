let util = require('./survive-util');
let gamePersistence = require('./game-persistence');

var init = async () => {
	let surviveContract = await util.getContract(util.getWeb3("ws://127.0.0.1:8545"));
	//Player Awarded Event
	surviveContract.events.playerAwardedEvent({
		fromBlock: 0
	}, async (error, event) =>  {
		console.log("Player " + event.returnValues.owner + " awarded: " + event.returnValues.prize);
	}).on ('data', (event) => {
		// console.log(event); // same results as the optional callback above
	}).on('changed', (event) => {
		// console.log(event);
	}).on('error', console.error);
};

init().then((resolve, reject) => {
	console.log("Player-Awarded-Prize-Event registered");
});
