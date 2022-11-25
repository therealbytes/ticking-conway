// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;
import "./BytesGhostBareComponent.sol";

uint256 constant ID = uint256(keccak256("conway.component.canvas"));

contract CanvasComponent is BytesGhostBareComponent {
  constructor(address world) BytesGhostBareComponent(world, ID) {}
}
