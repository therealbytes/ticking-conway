// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;

library ConwayEVM {
  function step(
    uint256 w,
    uint256 h,
    bytes memory state
  ) public pure returns (bytes memory) {
    bytes memory newState = new bytes(state.length);
    for (uint256 ii = 0; ii < state.length; ii++) {
      uint256[8] memory bits;
      uint8 b = uint8(state[ii]);
      for (uint256 jj = 0; jj < 8; jj++) {
        uint256 idx = ii * 8 + jj;
        uint256 x = idx % w;
        uint256 y = idx / w;
        if (ii == state.length - 1 && !inBounds(w, h, int256(x), int256(y))) {
          break;
        }
        uint256 alive = getBit(b, jj);
        uint256 neighbors = countNeighbors(state, w, h, x, y);
        if (alive == 1) {
          if (neighbors == 2 || neighbors == 3) {
            bits[jj] = 1;
          }
        } else {
          if (neighbors == 3) {
            bits[jj] = 1;
          }
        }
      }
      newState[ii] = bytes1(toByte(bits));
    }
    return newState;
  }

  function countNeighbors(
    bytes memory state,
    uint256 w,
    uint256 h,
    uint256 x,
    uint256 y
  ) internal pure returns (uint256) {
    uint256 count = 0;
    for (int256 dx = -1; dx <= 1; dx++) {
      for (int256 dy = -1; dy <= 1; dy++) {
        if (dx == 0 && dy == 0) {
          continue;
        }
        int256 nx = int256(x) + dx;
        int256 ny = int256(y) + dy;
        if (!inBounds(w, h, nx, ny)) {
          continue;
        }
        if (getBit(state, uint256(ny) * w + uint256(nx)) == 1) {
          count++;
        }
      }
    }
    return count;
  }

  function inBounds(
    uint256 w,
    uint256 h,
    int256 x,
    int256 y
  ) internal pure returns (bool) {
    return x >= 0 && uint256(x) < w && y >= 0 && uint256(y) < h;
  }

  function getBit(bytes memory arr, uint256 idx) internal pure returns (uint256) {
    uint8 b = uint8(arr[idx / 8]);
    uint256 bit = getBit(b, idx % 8);
    return bit;
  }

  function getBit(uint8 b, uint256 idx) internal pure returns (uint256) {
    return uint256((b >> (7 - idx)) & 1);
  }

  function toByte(uint256[8] memory b) internal pure returns (uint8) {
    return
      (uint8(b[0]) << 7) |
      (uint8(b[1]) << 6) |
      (uint8(b[2]) << 5) |
      (uint8(b[3]) << 4) |
      (uint8(b[4]) << 3) |
      (uint8(b[5]) << 2) |
      (uint8(b[6]) << 1) |
      uint8(b[7]);
  }
}
