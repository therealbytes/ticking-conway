// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;
import "std-contracts/components/BoolBareComponent.sol";

uint256 constant ID = uint256(keccak256("conway.component.paused"));

contract PausedComponent is BoolBareComponent {
  constructor(address world) BoolBareComponent(world, ID) {}

  function set(uint256 entity, bool value) public virtual {
    set(entity, abi.encode(value));
  }
}
