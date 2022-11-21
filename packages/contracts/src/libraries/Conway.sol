// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;

contract Conway {
  function step(
    uint256 x,
    uint256 y,
    uint256 cellSize,
    bytes memory state
  ) public view returns (bytes memory) {
    uint256 len = state.length;
    uint256 rem = len % 32;
    uint256 nWords = len / 32 + (rem == 0 ? 0 : 1);
    bytes memory result;
    uint256 p;
    // set pointer and store x, y, and cellSize in free memory
    assembly {
      // set free memory pointer
      p := mload(0x40)
      // store data
      mstore(p, x) // X
      mstore(add(p, 0x20), y) // Y
      mstore(add(p, 0x40), cellSize) // cellSize
    }
    // copy state to free memory
    for (uint256 ii = 0; ii < nWords; ii++) {
      assembly {
        let temp := mload(add(state, mul(0x20, add(0x01, ii))))
        mstore(add(p, mul(0x20, add(0x03, ii))), temp)
      }
    }
    // call precompiled contract and store result in memory and set result pointer
    assembly {
      if iszero(staticcall(not(0x00), 0x80, p, add(0x60, len), add(0x20, p), len)) {
        revert(0, 0)
      }
      mstore(p, len)
      result := p
      mstore(0x40, add(p, mul(0x20, add(0x01, nWords))))
    }
    return result;
  }
}
