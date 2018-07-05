
var Survive = artifacts.require("./Survive.sol");

let entryFee = web3.toWei(0.001, "ether");
let cureFee = web3.toWei(0.001, "ether");
let killTime = 7200;
let cureTime = 7200;

module.exports = function(deployer) {
  deployer.deploy(Survive, entryFee, cureFee, killTime, cureTime);
};
