const assert = require('assert');   // helper liabrary
const { EIDRM } = require('constants');
const ganache = require('ganache-cli');//local test nw
const Web3 = require('web3');//required in the const. func
const web3 = new Web3(ganache.provider());//instance of web3
const {interface, bytecode} =  require('../compile');// we require an obj which has interface and bytecode properties


let lottery;
let accounts;

beforeEach(async () => {

    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode})
        .send({from: accounts[0], gas: '1000000'});
});

describe('Lottery Contract', () => {
    it('deploys a contract', () =>{
        assert.ok(lottery.options.address);//add that the contrct was deplyd to on the local Tnw
    });

    it('allows one account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether') // ether to wei conversion
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length);
    });

    it('allows multiple account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether') // ether to wei conversion
        });

        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether') // ether to wei conversion
        });

        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02', 'ether') // ether to wei conversion
        });
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        
        assert.equal(3, players.length);
    });

    it('requires a minimum amount of ether to enter', async () => {
        try{
            await lottery.methods.enter().send({
                from: accounts[0],
                value: 0
            });
            assert(false);
        }catch(err){
            assert(err);
        }
    });

    it('only manager can pickWinner', async () =>{
        try{
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
            assert(false);
        }catch(err){
            assert(err);
        }
    }); 

    it('sends money to the winner and resets the player array', async () =>{
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });

        const initialBalance = await web3.eth.getBalance(accounts[0]);

        await lottery.methods.pickWinner().send({
            from: accounts[0]
        });

        const finalBalance = await web3.eth.getBalance(accounts[0]);

        const difference = finalBalance - initialBalance;

        // console.log(finalBalance - initialBalance);
        assert(difference > web3.utils.toWei('1.8', 'ether'));
    });
    
});