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

    it("Test Players", ()=> {
        return Survive.new( entryFee, cureFee, killTime, cureTime )
            .then(function(instance) {
                var playerAwardedEvent = instance.playerAwardedEvent();
	            var playerInfectedEvent =  instance.playerInfectedEvent();
	            var playerKilledEvent = instance.playerKilledEvent();

                instance.getGameData().then((results) => {
                    assert.equal(results[0].toNumber(), entryFee, "entryFee should be " + entryFee);
                    assert.equal(results[1].toNumber(), cureFee, "cureFee should be " + cureTime);
                    assert.equal(results[2].toNumber(), killTime, "killTime should be" + killTime);
                    assert.equal(results[3].toNumber(), cureTime, "should be " + cureTime);
                });

                instance.join({from: accounts[1], value: web3.toWei(1, "ether")}).then((result)=>{
                    instance.join({from: accounts[2], value: web3.toWei(1, "ether")}).then((result)=>{
                        instance.join({from: accounts[3], value: web3.toWei(1, "ether")}).then((result)=>{
                            instance.join({from: accounts[4], value: web3.toWei(1, "ether")}).then((result)=>{
                                instance.join({from: accounts[5], value: web3.toWei(1, "ether")}).then((result)=>{
                                    instance.join({from: accounts[6], value: web3.toWei(1, "ether")}).then((result)=>{
                                        instance.getAliveCount().then((results)=>{
                                            assert.equal(results.toNumber(), 6, "getAliveCount should be " + 6);
                                            instance.infect(accounts[6]).then((results)=>{
                                                assert.equal(playerInfectedEvent.get()[0].args.owner, accounts[6], "Player infected should be " + accounts[6]);
	                                            assert.equal(playerKilledEvent.get()[0].args.owner, accounts[6], "Player killed should be " + accounts[6]);
                                                instance.infect(accounts[5]).then((results)=>{
	                                                assert.equal(playerInfectedEvent.get()[0].args.owner, accounts[5], "Player infected should be " + accounts[5]);
	                                                assert.equal(playerKilledEvent.get()[0].args.owner, accounts[5], "Player killed should be " + accounts[5]);
                                                    instance.infect(accounts[4]).then((results)=>{
	                                                    assert.equal(playerInfectedEvent.get()[0].args.owner, accounts[4], "Player infected should be " + accounts[4]);
	                                                    assert.equal(playerKilledEvent.get()[0].args.owner, accounts[4], "Player killed should be " + accounts[4]);
                                                        instance.infect(accounts[3]).then((results)=>{
	                                                        assert.equal(playerInfectedEvent.get()[0].args.owner, accounts[3], "Player infected should be " + accounts[3]);
	                                                        assert.equal(playerKilledEvent.get()[0].args.owner, accounts[3], "Player killed should be " + accounts[3]);
                                                            instance.infect(accounts[2]).then((results)=>{
	                                                            assert.equal(playerInfectedEvent.get()[0].args.owner, accounts[2], "Player infected should be " + accounts[2]);
	                                                            assert.equal(playerKilledEvent.get()[0].args.owner, accounts[2], "Player killed should be " + accounts[2]);
                                                                instance.settleGame().then((results) => {
                                                                    assert.equal(playerAwardedEvent.get()[0].args.owner, accounts[1], "Prize owner should be " + accounts[1]);
                                                                    assert.equal(playerAwardedEvent.get()[0].args.prize.toNumber() > 0, true, "Prize should be greater than 0");
                                                                })
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
    });

    it("Test Payable Fallback", ()=> {
        return Survive.new( entryFee, cureFee, killTime, cureTime )
            .then(function(instance) {

	            var playerCuredEvent = instance.playerCuredEvent();
	            var playerInfectedEvent =  instance.playerInfectedEvent();

	            instance.sendTransaction({from:accounts[1], value: web3.toWei(3, "ether")}).then(()=> {
		            instance.sendTransaction({from:accounts[2], value: web3.toWei(1, "ether")}).then(()=> {
                        instance.getAliveCount().then((results) => {
                            assert.equal(results.toNumber(), 2, "Players joined should be " + 2);
                        });
                        instance.getPlayer(accounts[1]).then(results => {
                            assert.equal(results[5] > 0, true, "Player [Account1] should have a balance.");
	                        instance.infect(accounts[1]).then((results)=>{
		                        assert.equal(playerInfectedEvent.get()[0].args.owner, accounts[1], "Player infected should be " + accounts[1]);
		                        assert.equal(playerCuredEvent.get()[0].args.owner, accounts[1], "Player cured should be " + accounts[1]);
		                        instance.getPlayer(accounts[1]).then(results => {
			                        assert.equal(results[5] > 0, true, "Player [Account1] should have a balance.");
                                });

	                        });
                        });
                    });
                });
            });
        });
});
