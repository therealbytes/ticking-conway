// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;
import "solecs/BareComponent.sol";

uint256 constant ID = uint256(keccak256("conway.component.gridConfig"));

struct GridConfig {
  uint8 stepsPerTick;
  uint8 cellBitSize;
  bool drawable;
  bool pausable;
  bool devMode;
  int32 dimX;
  int32 dimY;
  int32 posX;
  int32 posY;
}

contract GridConfigComponent is BareComponent {
  constructor(address world) BareComponent(world, ID) {}

  function getSchema() public pure override returns (string[] memory keys, LibTypes.SchemaValue[] memory values) {
    keys = new string[](9);
    values = new LibTypes.SchemaValue[](9);

    keys[0] = "stepsPerTick";
    values[0] = LibTypes.SchemaValue.UINT8;

    keys[1] = "cellBitSize";
    values[1] = LibTypes.SchemaValue.UINT8;

    keys[2] = "drawable";
    values[2] = LibTypes.SchemaValue.BOOL;

    keys[3] = "pausable";
    values[3] = LibTypes.SchemaValue.BOOL;

    keys[4] = "devMode";
    values[4] = LibTypes.SchemaValue.BOOL;

    keys[5] = "dimX";
    values[5] = LibTypes.SchemaValue.INT32;

    keys[6] = "dimY";
    values[6] = LibTypes.SchemaValue.INT32;

    keys[7] = "posX";
    values[7] = LibTypes.SchemaValue.INT32;

    keys[8] = "posY";
    values[8] = LibTypes.SchemaValue.INT32;
  }

  function set(uint256 entity, GridConfig memory gridConfig) public {
    set(entity, abi.encode(gridConfig));
  }

  function getValue(uint256 entity) public view returns (GridConfig memory) {
    GridConfig memory gridConfig = abi.decode(getRawValue(entity), (GridConfig));
    return gridConfig;
  }
}
