// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById } from "solecs/utils.sol";

import { Coord } from "../types.sol";
import { GridId, GridDimX, GridDimY, GridCellBitSize } from "../constants.sol";
import { DimensionsComponent, ID as DimensionsComponentID } from "../components/DimensionsComponent.sol";
import { CellBitSizeComponent, ID as CellBitSizeComponentID } from "../components/CellBitSizeComponent.sol";

uint256 constant ID = uint256(keccak256("conway.system.init"));

contract InitSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory) public returns (bytes memory) {
    uint256 entity = GridId;
    // Get components
    DimensionsComponent dimensionsComponent = DimensionsComponent(getAddressById(components, DimensionsComponentID));
    CellBitSizeComponent cellBitSizeComponent = CellBitSizeComponent(
      getAddressById(components, CellBitSizeComponentID)
    );
    // Get values
    dimensionsComponent.set(entity, Coord(GridDimX, GridDimY));
    cellBitSizeComponent.set(entity, GridCellBitSize);
  }
}
