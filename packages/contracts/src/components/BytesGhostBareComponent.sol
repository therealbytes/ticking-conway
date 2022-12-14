// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;
import "solecs/BareComponent.sol";
import "./GhostComponent.sol";

contract BytesGhostBareComponent is BareComponent, GhostComponent {
  constructor(address world, uint256 id) BareComponent(world, id) {}

  function getSchema() public pure override returns (string[] memory keys, LibTypes.SchemaValue[] memory values) {
    keys = new string[](1);
    values = new LibTypes.SchemaValue[](1);

    keys[0] = "value";
    values[0] = LibTypes.SchemaValue.BYTES;
  }

  function setGhostValue(uint256 entity, bytes memory value) public {
    setGhost(entity, abi.encode(value));
  }

  function setValue(uint256 entity, bytes memory value) public {
    set(entity, abi.encode(value));
  }

  function getValue(uint256 entity) public view returns (bytes memory) {
    bytes memory value = abi.decode(getRawValue(entity), (bytes));
    return value;
  }
}
