// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;
import "std-contracts/components/CoordBareComponent.sol";

uint256 constant ID = uint256(keccak256("conway.component.dimensions"));

contract DimensionsComponent is CoordBareComponent {
  constructor(address world) CoordBareComponent(world, ID) {}
}
