require('babel-register');

module.exports = {
    networks: {
        development: {
            host: '127.0.0.1',
            port: 8545,
            network_id: '*',
            gas: 6721975
        },
        ropsten: {
            host: "localhost",
            port: 8545,
            network_id: "3",
	        gas:   3900000
        },
        local: {
            host: "localhost",
            port: 9545,
            network_id: '*',
            gas: 6721975
        }
    }
};
