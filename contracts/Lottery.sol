pragma solidity ^0.4.17;

contract Lottery{
    
    address public manager;
    address[] public players;
    
    function Lottery() public {
        manager = msg.sender;
    }
    
    function enter() public payable{
        
        // require() is used for validation if the condn inside require is true then rest of the fun. executes else not
        require(msg.value > .01 ether);
        
        players.push(msg.sender);
    }
    
    function random() private view returns(uint){
        
        return uint(keccak256(block.difficulty, now, players)); //now is time
    }
    
    function pickWinner() public restricted {
        
        
        uint index = random() % players.length; //picked winner's index
        
        players[index].transfer(this.balance);  // transfering money to the winner
        
        //for reseting players array
        players = new address[](0); // creates new Dyn array of type address
    }
    
    modifier restricted(){
        require(msg.sender == manager);
        _;
    }
    
    function getPlayers() public view returns(address[]){
        return players;
    }
}