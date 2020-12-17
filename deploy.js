const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

const { inteface , bytecode } = require('./compile');

const provider = new HDWalletProvider(
    'floor wedding mobile input wire lounge lend matter camp mouse volcano onion',
    'https://rinkeby.infura.io/v3/6cbf63f7c6e64db1a2ebf4781aa7125e'
);

const web3 = new Web3(provider);

const deploy = async () => {

    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))  //interface here is ABI
        .deploy({ data: bytecode, arguments: ['Hi there! ']})
        .send({ gas: '1000000' , from: accounts[0] });

    console.log('Contract Deployed to', result.options.address);
};

deploy();