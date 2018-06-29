var Survive = artifacts.require("./Survive.sol");

contract('Survive', function(accounts) {

    let entryFee = web3.toWei(1, "ether");
    let cureFee = web3.toWei(1, "ether");

    let killTime = 1000;
    let cureTime = 1000;

    it("Test Payable Fallback", ()=> {
        return Survive.new( entryFee, cureFee, killTime, cureTime )
            .then(function(instance) {

	            var playerCuredEvent = instance.playerCuredEvent();
	            var playerInfectedEvent =  instance.playerInfectedEvent();

                instance.sendTransaction({from:accounts[1], value: web3.toWei(1, "ether")}).then(()=> {
		            instance.sendTransaction({from:accounts[2], value: web3.toWei(1, "ether")}).then(()=> {
                        instance.infect(accounts[1]).then((results)=>{
                        	assert.equal(playerInfectedEvent.get()[0].args.owner, accounts[1], "Player infected should be " + accounts[1]);
                        	instance.sendTransaction({from:accounts[1], value: web3.toWei(1, "ether")}).then(()=> {
                                    assert.equal(playerCuredEvent.get()[0].args.owner, accounts[1], "Player cured should be " + accounts[1]);
		                        });
	                        });
                        });
                });
            });
        });
});
