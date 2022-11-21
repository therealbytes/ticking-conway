// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;
import "./BytesComponent.sol";

uint256 constant ID = uint256(keccak256("conway.component.conwayState"));

contract ConwayStateComponent is BytesComponent {
  constructor(address world) BytesComponent(world, ID) {}
}
