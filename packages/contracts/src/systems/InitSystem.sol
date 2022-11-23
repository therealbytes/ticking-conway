// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById } from "solecs/utils.sol";

import { Coord } from "../types.sol";
import { GridId, GridDimX, GridDimY, GridCellBitSize } from "../constants.sol";
import { DimensionsComponent, ID as DimensionsComponentID } from "../components/DimensionsComponent.sol";
import { CellBitSizeComponent, ID as CellBitSizeComponentID } from "../components/CellBitSizeComponent.sol";
import { ConwayStateComponent, ID as ConwayStateComponentID } from "../components/ConwayStateComponent.sol";

uint256 constant ID = uint256(keccak256("conway.system.init"));

contract InitSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory) public returns (bytes memory) {
    uint256 entity = GridId;
    // Check constants
    // Get components
    DimensionsComponent dimensionsComponent = DimensionsComponent(getAddressById(components, DimensionsComponentID));
    CellBitSizeComponent cellBitSizeComponent = CellBitSizeComponent(
      getAddressById(components, CellBitSizeComponentID)
    );
    ConwayStateComponent conwayStateComponent = ConwayStateComponent(
      getAddressById(components, ConwayStateComponentID)
    );
    // Set values
    dimensionsComponent.set(entity, Coord(GridDimX, GridDimY));
    cellBitSizeComponent.set(entity, GridCellBitSize);
    uint256 nCells = uint256(int256(GridDimX)) * uint256(int256(GridDimY));
    uint256 stateSize = (nCells * GridCellBitSize) / 8;
    if ((8 * stateSize) / GridCellBitSize < nCells) {
      stateSize += 1;
    }
    bytes memory state = new bytes(stateSize);
    bytes32 rnd = blockhash(block.number);
    for (uint256 ii = 0; ii < state.length; ii++) {
      if (ii % 32 == 0) {
        rnd = bytes32(uint256(keccak256(abi.encodePacked(rnd))));
      }
      state[ii] = rnd[ii % 32];
    }
    conwayStateComponent.setValue(entity, state);
  }
}
