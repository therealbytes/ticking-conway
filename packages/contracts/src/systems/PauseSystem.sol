// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById } from "solecs/utils.sol";

import { GridConfig, GridConfigComponent, ID as GridConfigComponentID } from "../components/GridConfigComponent.sol";
import { PausedComponent, ID as PausedComponentID } from "../components/PausedComponent.sol";

uint256 constant ID = uint256(keccak256("conway.system.pause"));

contract PauseSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory arguments) public returns (bytes memory) {
    (uint256 entity, bool pause) = abi.decode(arguments, (uint256, bool));
    GridConfig memory config = GridConfigComponent(getAddressById(components, GridConfigComponentID)).getValue(entity);
    require(config.pausable, "PauseSystem: grid is not pausable");
    PausedComponent(getAddressById(components, PausedComponentID)).set(entity, pause);
  }

  function executeTyped(uint256 entity, bool pause) public returns (bytes memory) {
    return execute(abi.encode(entity, pause));
  }
}
