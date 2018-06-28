let util = require('./survive-util');
let gamePersistence = require('./game-persistence');

let joinedEvent = require('./joined-event');
let infectedEvent = require('./infected-event');
let attemptInfectedEvent = require('./attempt-infected-event');


let init = async() => {
	let surviveContract = await util.getContract(util.getWeb3("ws://127.0.0.1:8545"));

	// All Events
	surviveContract.events.allEvents({
		fromBlock: 0,
		toBlock: 'latest'
	    },
		(error, event) => { console.log(event); })
		.on('data', function(event){
			// console.log(event); // same results as the optional callback above
		})
		.on('changed', function(event){
			// remove event from local database
			console.log(event);
		})
		.on('error', console.error);
};

init().then((resolve, reject) => {
	console.log("All-Events registered");
});

//
// let surviveContract = util.getContract(util.getWeb3("ws://127.0.0.1:8545"));
//
// // event playerAttemptInfectEvent(address owner);
// // event playerInfectedEvent(address owner, uint infectedTime);
// // event playerKilledEvent(address owner, uint killTime);
// // event playerAwardedEvent(address owner, uint prize);
// // event playerCuredEvent(address owner, bool cured, uint cureTime);
// // event playerBalanceUpdatedEvent(address owner, uint balance);
// // event playerJoinedEvent(address player, uint joinTime, uint balance);
// //
// // event gameSettledEvent(uint winners, uint prize, uint contractBalance);
// // event gameResetEvent(uint timestamp);
//
// // surviveContract.getPastEvents('playerInfectedEvent', {
// // 	fromBlock: 0,
// // 	toBlock: 75
// // }, (error, events) => { console.log(events); })
// // 	.then(function(events){
// // 		console.log(events) // same results as the optional callback above
// // 	});
//
//
// // All Events
// // surviveContract.events.allEvents({
// // 	fromBlock: 0,
// // 	toBlock: 'latest'
// // }, function(error, event){ console.log(event); })
// // 	.on('data', function(event){
// // 		// console.log(event); // same results as the optional callback above
// // 	})
// // 	.on('changed', function(event){
// // 		// remove event from local database
// // 		console.log(event);
// // 	})
// // 	.on('error', console.error);
//
// // event playerAttemptInfectEvent(address owner);
// //
// // surviveContract.events.playerAttemptInfectEvent({
// // 	fromBlock: "0"
// // }, async (error, event) =>  {
// // 	console.log("playerAttemptInfectEvent");
// // 	console.log(event);
// // }).on ('data', (event) => {
// // 	console.log(event); // same results as the optional callback above
// // }).on('changed', (event) => {
// // 	// console.log(event);
// // }).on('error', console.error);
// //
// // //Player Joined Event
// surviveContract.events.playerJoinedEvent({
// 	fromBlock: "latest"
// 	}, async (error, event) =>  {
// 		// console.log('playerJoinedEvent');
// 		console.log(event);
// 		let player = {
// 			address: event.returnValues.player,
// 			joinTime: parseInt(event.returnValues.joinTime),
// 			blockIdx: event.blockNumber,
// 			balance: event.returnValues.balance,
// 			blockHash: event.blockHash
// 		};
// 		var result = await gamePersistence.upsertPlayer(player);
// 	}).on ('data', (event) => {
// 		// console.log(event); // same results as the optional callback above
// 	}).on('changed', (event) => {
// 		// console.log(event);
// 	}).on('error', (error) => console.error(error));
// //
// //
// // //Player Killed Event
// // surviveContract.events.playerKilledEvent({
// // 	fromBlock: "latest"
// // }, async (error, event) =>  {
// // 	console.log(event);
// // 	let player = {
// // 		address: event.returnValues.owner,
// // 		status: 0,
// // 		statusTime:  event.returnValues.killTime
// // 	};
// // 	var result = await gamePersistence.updatePlayerStatus(player);
// // }).on ('data', (event) => {
// // 	console.log(event); // same results as the optional callback above
// // }).on('changed', (event) => {
// // 	console.log(event);
// // }).on('error', console.error);
// //
// //
// // //Player Awarded Event
// // surviveContract.events.playerAwardedEvent({
// // 	fromBlock: "latest"
// // }, (error, event) =>  {
// // 	console.log(event);
// // }).on ('data', (event) => {
// // 	console.log(event); // same results as the optional callback above
// // }).on('changed', (event) => {
// // 	console.log(event);
// // }).on('error', console.error);
// //
// //
// // //Player Cured Event
// // surviveContract.events.playerCuredEvent({
// // 	fromBlock: "latest"
// // }, async (error, event) =>  {
// // 	console.log(event);
// // 	if (event.returnValues.cured) {
// // 		let player = {
// // 			address: event.returnValues.owner,
// // 			status: 1,
// // 			statusTime: event.returnValues.cureTime
// // 		};
// // 		var result = await gamePersistence.updatePlayerStatus(player);
// // 	}
// // }).on ('data', (event) => {
// // 	console.log(event); // same results as the optional callback above
// // }).on('changed', (event) => {
// // 	console.log(event);
// // }).on('error', console.error);
// //
// //
// // //Game Settled Event
// // surviveContract.events.gameSettledEvent({
// // 	fromBlock: "latest"
// // }, (error, event) =>  {
// // 	console.log(event);
// // }).on ('data', (event) => {
// // 	console.log(event); // same results as the optional callback above
// // }).on('changed', (event) => {
// // 	console.log(event);
// // }).on('error', console.error);
// //
// //
// // //Balance Updated Event
// // surviveContract.events.playerBalanceUpdatedEvent({
// // 	fromBlock: "latest"
// // }, (error, event) =>  {
// // 	console.log(event);
// // }).on ('data', (event) => {
// // 	console.log(event); // same results as the optional callback above
// // }).on('changed', (event) => {
// // 	console.log(event);
// // }).on('error', console.error);
// //
// //
// //Player Infected Event
// surviveContract.events.playerInfectedEvent({
// 	fromBlock: 'latest'
// }, async (error, event) =>  {
// 	console.log(event);
// 	let player = {
// 		address: event.returnValues.owner,
// 		status: 2,
// 		statusTime:  event.returnValues.infectedTime
// 	};
// 	var result = await gamePersistence.updatePlayerStatus(player);
// }).on ('data', (event) => {
// 	console.log(event); // same results as the optional callback above
// }).on('changed', (event) => {
// 	console.log(event);
// }).on('error', console.error);
