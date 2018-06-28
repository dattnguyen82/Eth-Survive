var Survive = artifacts.require("./Survive.sol");

contract('Survive', function(accounts) {

    let entryFee = web3.toWei(1, "ether");
    let cureFee = web3.toWei(1, "ether");

    let killTime = 0;
    let cureTime = 0;

	it("Test Settle, 0 players", ()=> {
		return Survive.new( entryFee, cureFee, killTime, cureTime )
			.then(function(instance) {
				var gameSettledEvent = instance.gameSettledEvent();
				instance.settleGame().then((results) => {
                    if (gameSettledEvent.get().length >= 1) {
	                    assert.equal(gameSettledEvent.get()[0].args.winners.toNumber(), 0, "No winners, must be more than 2 players to settle game");
	                    assert.equal(gameSettledEvent.get()[0].args.prize.toNumber(), 0, "No prize, must be more than 2 players to settle game");
                    }});
			});
	});

});
truffle
