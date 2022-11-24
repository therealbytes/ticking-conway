// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById } from "solecs/utils.sol";

import { Coord } from "../types.sol";
import { DimensionsComponent, ID as DimensionsComponentID } from "../components/DimensionsComponent.sol";
import { CellBitSizeComponent, ID as CellBitSizeComponentID } from "../components/CellBitSizeComponent.sol";
import { NewCellsComponent, ID as NewCellsComponentID } from "../components/NewCellsComponent.sol";

uint256 constant ID = uint256(keccak256("conway.system.init"));

contract InitSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory arguments) public returns (bytes memory) {
    (uint256 entity, uint256 value, Coord[] memory coords) = abi.decode(arguments, (uint256, uint256, Coord[]));

    DimensionsComponent dimensionsComponent = DimensionsComponent(getAddressById(components, DimensionsComponentID));
    CellBitSizeComponent cellBitSizeComponent = CellBitSizeComponent(
      getAddressById(components, CellBitSizeComponentID)
    );
    NewCellsComponent newCellsComponent = NewCellsComponent(getAddressById(components, NewCellsComponentID));

    Coord memory dimensions = dimensionsComponent.getValue(entity);
    uint256 cellBitSize = cellBitSizeComponent.getValue(entity);
    bytes memory state = newCellsComponent.getValue(entity);

    require(value < 2**cellBitSize, "PaintSystem: Value too large for cell bit size");

    bytes1 v = bytes1(uint8(value));

    for (uint256 ii = 0; ii < coords.length; ii++) {
      Coord memory coord = coords[ii];
      uint256 offset = cellBitSize * uint256(int256((coord.y * dimensions.x) + coord.x));
      uint256 byteOffset = offset / 8;
      uint256 bitOffset = offset % 8;
      bytes1 b = state[byteOffset];
      bytes1 mask = (bytes1(uint8(2**bitOffset - 1)) << (8 - bitOffset)) | bytes1(uint8(2**cellBitSize - 1));
      bytes1 nb = (b & mask) | (v << (8 - bitOffset - cellBitSize));
      state[byteOffset] = nb;
    }
    newCellsComponent.setValue(entity, state);
  }

  function executeTyped(
    uint256 entity,
    uint256 value,
    Coord[] memory coords
  ) public returns (bytes memory) {
    return execute(abi.encode(entity, value, coords));
  }
}
