pragma solidity 0.5.11;

import "@openzeppelin/contracts/access/Roles.sol";

contract Membership {
  /** @notice Defines the roles of the actors. */
  using Roles for Roles.Role;
  Roles.Role[] private memberships;
}
