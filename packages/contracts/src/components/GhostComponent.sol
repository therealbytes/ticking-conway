// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;
import "solecs/BareComponent.sol";

abstract contract GhostComponent is BareComponent {
  function setGhost(uint256 entity, bytes memory value) public onlyWriter {
    _setGhost(entity, value);
  }

  function _setGhost(uint256 entity, bytes memory value) internal virtual {
    IWorld(world).registerComponentValueSet(entity, value);
  }
}
