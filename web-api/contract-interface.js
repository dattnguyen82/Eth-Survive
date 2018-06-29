let util = require('./survive-util');
let environment = require('./environment');

let ownerAccount = environment.owner;

let callContractMethod = async (f, account) => {
	var result = null;
	try {
		result = await f.call({from: account});
	}
	catch (err) {
		console.log(err);
	}
	return result;
};

let sendContractMethod = async (f, account) => {
	var result = null;
	try {
		result = await f.send({from: account, gas: 3000000});
	}
	catch (err) {
		console.log(err);
	}
	return result;
};

let init = async () => {
	let surviveContract = await util.getContract(util.getWeb3(environment.web3Provider_http));

	//View Methods
	exports.getPlayer = async (playerInfo) => {
		var result = await callContractMethod(surviveContract.methods.getPlayer(playerInfo.address), ownerAccount);
		return result;
	};

	exports.getPlayerCount = async () => {
		var result = await callContractMethod(surviveContract.methods.getPlayerCount(), ownerAccount);
		return result;
	};

	exports.getPlayerAliveCount = async () => {
		var result = await callContractMethod(surviveContract.methods.getAliveCount(), ownerAccount);
		return result;
	};

	exports.getPlayerInfectedCount = async () => {
		var result = await callContractMethod(surviveContract.methods.getInfectedCount(), ownerAccount);
		return result;
	};

	exports.getGameData = async () => {
		var result = await callContractMethod(surviveContract.methods.getGameData(), ownerAccount);
		return result;
	};

	exports.getPrizePool = async () => {
		var result = await callContractMethod(surviveContract.methods.getPrizePool(), ownerAccount);
		return result;
	};

	//Send Methods
	exports.settleGame = async (forceKill) => {
		var result = await sendContractMethod(surviveContract.methods.settleGame(forceKill), ownerAccount);
		return result;
	};

	exports.infect = async (playerInfo) => {
		var result = await sendContractMethod(surviveContract.methods.infect(playerInfo.address), ownerAccount);
		return result;
	};

	exports.kill = async (playerInfo) => {
		var result = await sendContractMethod(surviveContract.methods.killPlayer(playerInfo.address), ownerAccount);
		return result;
	};

	exports.resetGame = async () => {
		var result = await sendContractMethod(surviveContract.methods.resetGame(), ownerAccount);
		return result;
	};
};

init().then((resolve, reject) => {
	console.log("Contract Interface intialized");
});
