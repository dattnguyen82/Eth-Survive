
var Survive = artifacts.require("./Survive.sol");

let entryFee = web3.toWei(1, "ether");
let cureFee = web3.toWei(1, "ether");
let killTime = 14400;
let cureTime = 43200;


module.exports = function(deployer) {
  deployer.deploy(Survive, entryFee, cureFee, killTime, cureTime);
};
