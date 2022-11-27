// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;

uint256 constant GridId = 0x060D;
uint8 constant GridStepsPerTick = 4;
uint8 constant GridCellBitSize = 1;
bool constant GridDrawable = false;
bool constant GridPausable = false;
bool constant GridDevMode = false;
int32 constant GridPosX = 0;
int32 constant GridPosY = 0;
int32 constant GridDimX = 128;
int32 constant GridDimY = 128;

bool constant GridPaused = false;

address constant TickPredeployAddr = 0x42000000000000000000000000000000000000A0;
