pragma solidity 0.5.11;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract chai is IERC20 {
  function join(address dst, uint wad) external;
  function exit(address src, uint wad) public;
}

contract TeaParty {

  using SafeMath for uint256;

  chai public CHAI;
  IERC20 public DAI;
  mapping (address => uint) public userToStake;
  address public owner;
  address public beneficiary;

  modifier onlyOwner(){
    require(msg.sender == owner, "Needs to be the owner of the contract");
    _;
  }

  constructor(chai _chai, IERC20 _dai, address _beneficiary) public {
    CHAI = _chai;
    DAI = _dai;
    owner = msg.sender;
    beneficiary = _beneficiary;
  }

  /**
    * @notice receive dai
    * transform into chai
    * update balance
    */
  function stakeDai(uint _amount) public {
    DAI.approve(address(CHAI), _amount);
    DAI.transferFrom(msg.sender, address(this), _amount);
    CHAI.join(address(this), _amount);
    userToStake[msg.sender] = userToStake[msg.sender].add(_amount);
  }

  /**
    * @notice transform chai into dai
    * update balance
    * give back dai
    */
  function retrieveStake() public {
    uint amount = userToStake[msg.sender];
    userToStake[msg.sender] = userToStake[msg.sender].sub(amount);
    CHAI.exit(address(this), amount);
    DAI.transfer(msg.sender, amount);
  }

  /** @notice returns money to the beneficiary of contract */
  function retrieveFunds() public {
    uint balance = DAI.balanceOf(address(this));
    DAI.transfer(beneficiary, balance);
  }
}

