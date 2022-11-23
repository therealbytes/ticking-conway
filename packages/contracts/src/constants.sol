// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;

uint256 constant GridId = uint256(keccak256("conway.entity.grid"));
int32 constant GridDimX = 16;
int32 constant GridDimY = 24;
uint256 constant GridCellBitSize = 1;
bytes constant GridState0 = "\x00\x00\x00\x00\x00\x00\x00\x00\x0c\x30\x0e\x70\x0c\x30\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x0c\x30\x0e\x70\x0c\x30\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00";

address constant TickPredeployAddr = 0x42000000000000000000000000000000000000A0;
