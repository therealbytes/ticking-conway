// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById } from "solecs/utils.sol";

import { GridId, GridStepsPerTick, GridCellBitSize, GridDrawable, GridPausable, GridDevMode, GridPosX, GridPosY, GridDimX, GridDimY, GridPaused } from "../constants.sol";
import { GridConfig, GridConfigComponent, ID as GridConfigComponentID } from "../components/GridConfigComponent.sol";
import { PausedComponent, ID as PausedComponentID } from "../components/PausedComponent.sol";
import { CanvasComponent, ID as CanvasComponentID } from "../components/CanvasComponent.sol";
import { ConwayStateComponent, ID as ConwayStateComponentID } from "../components/ConwayStateComponent.sol";

uint256 constant ID = uint256(keccak256("conway.system.init"));

contract InitSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory) public returns (bytes memory) {
    uint256 entity = GridId;
    // Check constants
    require(GridStepsPerTick <= 8, "InitSystem: GridStepsPerTick must be <= 8");
    require(GridCellBitSize <= 8, "InitSystem: GridCellBitSize must be <= 8");
    // Set config
    GridConfigComponent configComponent = GridConfigComponent(getAddressById(components, GridConfigComponentID));
    require(!configComponent.has(entity), "InitSystem: grid already exists");
    GridConfig memory config = GridConfig({
      stepsPerTick: GridStepsPerTick,
      cellBitSize: GridCellBitSize,
      drawable: GridDrawable,
      pausable: GridPausable,
      devMode: GridDevMode,
      posX: GridPosX,
      posY: GridPosY,
      dimX: GridDimX,
      dimY: GridDimY
    });
    configComponent.set(entity, config);
    // Set paused
    if (GridPausable) {
      PausedComponent(getAddressById(components, PausedComponentID)).set(entity, GridPaused);
    }
    // Randomize initial conway state from block hash
    uint256 nCells = uint256(int256(GridDimX)) * uint256(int256(GridDimY));
    uint256 stateSize = (nCells * GridCellBitSize) / 8;
    if ((8 * stateSize) / GridCellBitSize < nCells) {
      stateSize += 1;
    }
    bytes memory state = new bytes(stateSize);
    if (GridDrawable) {
      CanvasComponent(getAddressById(components, CanvasComponentID)).setValue(entity, state);
    }
    randomizeState(state);
    ConwayStateComponent(getAddressById(components, ConwayStateComponentID)).setValue(entity, state);
  }

  function randomizeState(bytes memory state) internal view {
    bytes32 rnd = blockhash(block.number);
    for (uint256 ii = 0; ii < state.length; ii++) {
      if (ii % 32 == 0) {
        rnd = bytes32(uint256(keccak256(abi.encodePacked(rnd))));
      }
      state[ii] = rnd[ii % 32];
      // if (gasleft() < 1000000) break;
    }
  }
}
