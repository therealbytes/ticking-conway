// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;

uint256 constant GridId = uint256(keccak256("conway.entity.grid"));
int32 constant GridDimX = 96;
int32 constant GridDimY = 96;
uint256 constant GridCellBitSize = 1;
uint256 constant TicksPerCall = 4;

address constant TickPredeployAddr = 0x42000000000000000000000000000000000000A0;
