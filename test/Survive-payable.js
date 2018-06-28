var Survive = artifacts.require("./Survive.sol");

contract('Survive', function(accounts) {

    let entryFee = web3.toWei(1, "ether");
    let cureFee = web3.toWei(1, "ether");

    let killTime = 0;
    let cureTime = 0;

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
