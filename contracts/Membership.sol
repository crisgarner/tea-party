pragma solidity 0.5.11;

import "@openzeppelin/contracts/access/Roles.sol";
import "./TeaParty.sol";

contract MembershipFactory {
  /** @notice Defines the roles of the actors. */
  using Roles for Roles.Role;

  Roles.Role private _starter;
  Roles.Role private _medium;
  Roles.Role private _pro;
  Roles.Role private _yolo;
  TeaParty public teaParty;

  address public owner;

  modifier onlyOwner(){
    require(msg.sender == owner, "Needs to be the owner of the contract");
    _;
  }

  constructor(TeaParty _teaParty) public {
    teaParty = _teaParty;
    owner = msg.sender;
  }

  function addToRole(address _user) public onlyOwner {
    cleanRole(_user);
    uint amount = teaParty.userToStake(_user);
    if(amount > 1000 ether){
      _yolo.add(_user);
    }

    if(amount > 100 ether){
      _pro.add(_user);
    }

    if(amount > 10 ether){
      _medium.add(_user);
    }

    if(amount > 1 ether){
      _starter.add(_user);
    }
  }

  function updateRole(address _user) public onlyOwner {
    cleanRole(_user);
    addToRole(_user);
  }

  function cleanRole(address _user) public onlyOwner{
    _yolo.remove(_user);
    _pro.remove(_user);
    _medium.remove(_user);
    _starter.remove(_user);
  }

  function getRole(address _user) public view returns (string memory) {
    if(_yolo.has(_user)){
      return "YOLO";
    }else if(_pro.has(_user)){
      return "PRO";
    }else if(_medium.has(_user)){
      return "MEDIUM";
    }else if(_starter.has(_user)){
      return "STARTER";
    }
    return "NO STAKER";
  }
}
