let util = require('./survive-util');
let gamePersistence = require('./game-persistence');

var init = async () => {
	let surviveContract = await util.getContract(util.getWeb3("ws://127.0.0.1:8545"));

	// event gameSettledEvent(uint winners, uint prize, uint contractBalance);
	//Game Reset Event
	surviveContract.events.gameSettledEvent({
		fromBlock: 0
	}, async (error, event) =>  {
		console.log("Game settled: " + event.returnValues);
	}).on ('data', (event) => {
		// console.log(event); // same results as the optional callback above
	}).on('changed', (event) => {
		// console.log(event);
	}).on('error', console.error);
};

init().then((resolve, reject) => {
	console.log("Game-Reset-Event registered");
});
