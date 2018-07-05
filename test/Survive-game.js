var SurviveGame = artifacts.require("./Survive.sol");

contract('Survive', function(accounts) {

    let entryFee = web3.toWei(0.001, "ether");
    let cureFee = web3.toWei(0.001, "ether");

    let killTime = 0;
    let cureTime = 0;

    it("Test Players", ()=> {
        return SurviveGame.new( entryFee, cureFee, killTime, cureTime )
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
                                                                instance.settleGame(false).then((results) => {
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

});
