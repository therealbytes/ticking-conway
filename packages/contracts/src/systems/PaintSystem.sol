// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById } from "solecs/utils.sol";

import { GridConfig, GridConfigComponent, ID as GridConfigComponentID } from "../components/GridConfigComponent.sol";
import { CanvasComponent, ID as CanvasComponentID } from "../components/CanvasComponent.sol";

uint256 constant ID = uint256(keccak256("conway.system.paint"));

contract PaintSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory arguments) public returns (bytes memory) {
    (uint256 entity, uint256 value, Coord[] memory coords) = abi.decode(arguments, (uint256, uint256, Coord[]));

    GridConfig memory config = GridConfigComponent(getAddressById(components, GridConfigComponentID)).get(entity);

    require(config.drawable, "PaintSystem: grid is not drawable");
    require(value < 2**config.cellBitSize, "PaintSystem: value too large for cell bit size");

    bytes memory state = canvasComponent.getValue(entity);

    bytes1 v = bytes1(uint8(value));

    for (uint256 ii = 0; ii < coords.length; ii++) {
      Coord memory coord = coords[ii];
      uint256 offset = cellBitSize * uint256(int256((coord.y * dimensions.x) + coord.x));
      uint256 byteOffset = offset / 8;
      uint256 bitOffset = offset % 8;
      bytes1 b = state[byteOffset];
      bytes1 mask = bytes1(uint8(2**cellBitSize - 1)) << (8 - bitOffset - cellBitSize);
      bytes1 nb = (b & ~mask) | (v << (8 - bitOffset - cellBitSize));
      state[byteOffset] = nb;
    }
    canvasComponent.setValue(entity, state);
  }

  function executeTyped(
    uint256 entity,
    uint256 value,
    Coord[] memory coords
  ) public returns (bytes memory) {
    return execute(abi.encode(entity, value, coords));
  }
}
