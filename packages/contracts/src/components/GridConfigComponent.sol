import "solecs/BareComponent.sol";
import { Coord } from "../types.sol";

uint256 constant ID = uint256(keccak256("conway.component.gridConfig"));

struct GridConfig {
  uint8 stepsPerTick;
  uint8 cellBitSize;
  bool drawable;
  int32 dimX;
  int32 dimY;
  int32 posX;
  int32 posY;
}

contract GridConfigComponent is BareComponent {
  constructor(address world) BareComponent(world, ID) {}

  function getSchema() public pure override returns (string[] memory keys, LibTypes.SchemaValue[] memory values) {
    keys = new string[](1);
    values = new LibTypes.SchemaValue[](1);

    keys[0] = "stepsPerTick";
    values[0] = LibTypes.SchemaValue.UINT8;

    keys[1] = "cellBitSize";
    values[1] = LibTypes.SchemaValue.UINT8;

    keys[2] = "drawable";
    values[2] = LibTypes.SchemaValue.BOOL;

    keys[3] = "dimX";
    values[3] = LibTypes.SchemaValue.INT32;

    keys[4] = "dimY";
    values[4] = LibTypes.SchemaValue.INT32;

    keys[5] = "posX";
    values[5] = LibTypes.SchemaValue.INT32;

    keys[6] = "posY";
    values[6] = LibTypes.SchemaValue.INT32;
  }

  function set(uint256 entity, GridConfig memory gridConfig) public {
    set(entity, abi.encode(gridConfig));
  }

  function getValue(uint256 entity) public view returns (GridConfig memory) {
    GridConfig memory gridConfig = abi.decode(getRawValue(entity), (GridConfig));
    return gridConfig;
  }
}
