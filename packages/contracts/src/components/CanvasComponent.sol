// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;
import "./BytesBareComponent.sol";

uint256 constant ID = uint256(keccak256("conway.component.canvas"));

contract CanvasComponent is BytesBareComponent {
  constructor(address world) BytesBareComponent(world, ID) {}
}
