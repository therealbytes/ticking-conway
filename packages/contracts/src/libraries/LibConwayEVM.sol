// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;

bytes1 constant byte1 = bytes1(0x01);

library ConwayEVMUnpacked {
  function step(
    uint256 w,
    uint256 h,
    bytes memory state
  ) public pure returns (bytes memory) {
    return pack(stepUnpacked(w, h, unpack(state)));
  }

  function stepUnpacked(
    uint256 w,
    uint256 h,
    bytes memory state
  ) internal pure returns (bytes memory) {
    bytes memory newState = new bytes(state.length);
    for (uint256 ii = 0; ii < state.length; ii++) {
      uint256 x = ii % w;
      uint256 y = ii / w;
      if (ii == state.length - 1 && !inBounds(w, h, int256(x), int256(y))) {
        break;
      }
      uint256 neighbors = countNeighbors(state, w, h, x, y);
      if (state[ii] == byte1) {
        if (neighbors == 2 || neighbors == 3) {
          newState[ii] = byte1;
        }
      } else {
        if (neighbors == 3) {
          newState[ii] = byte1;
        }
      }
    }
    return newState;
  }

  function countNeighbors(
    bytes memory state,
    uint256 w,
    uint256 h,
    uint256 x,
    uint256 y
  ) public pure returns (uint256) {
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
        if (state[uint256(ny) * w + uint256(nx)] == byte1) {
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

  function pack(bytes memory state) internal pure returns (bytes memory) {
    bytes memory packed = new bytes(state.length / 8);
    for (uint256 ii = 0; ii < state.length; ii += 8) {
      uint256 packedIdx = ii / 8;
      uint256 packedByte = 0;
      for (uint256 jj = 0; jj < 8; jj++) {
        packedByte |= uint256(uint8(state[ii + jj] << (7 - jj)));
      }
      packed[packedIdx] = bytes1(uint8(packedByte));
    }
    return packed;
  }

  function unpack(bytes memory packed) internal pure returns (bytes memory) {
    bytes memory state = new bytes(packed.length * 8);
    for (uint256 ii = 0; ii < packed.length; ii++) {
      uint256 packedByte = uint256(uint8(packed[ii]));
      for (uint256 jj = 0; jj < 8; jj++) {
        state[ii * 8 + jj] = bytes1(uint8((packedByte >> (7 - jj)) & 1));
      }
    }
    return state;
  }
}

library ConwayEVMPacked {
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
    uint8 res = 0;
    for (uint256 ii = 0; ii < 8; ii++) {
      res |= uint8(b[ii] << (7 - ii));
    }
    return res;
  }
}
