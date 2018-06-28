let util = require('./survive-util');

var init = async () => {
	let surviveContract = await util.getContract(util.getWeb3("ws://127.0.0.1:8545"));

	//Player Infected Event
	surviveContract.events.playerAttemptInfectEvent({
		fromBlock: 0
	}, async (error, event) => {
		console.log(event);
	}).on('data', (event) => {
		console.log(event); // same results as the optional callback above
	}).on('changed', (event) => {
		console.log(event);
	}).on('error', console.error);
};

init().then((resolve, reject) => {
	console.log("Attempt-Infected-Event registered");
});
