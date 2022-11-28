// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;

uint256 constant GridId = 0x060D;
uint8 constant GridStepsPerTick = 1;
uint8 constant GridCellBitSize = 1;
bool constant GridDrawable = false;
bool constant GridPausable = true;
bool constant GridDevMode = true;
int32 constant GridPosX = 0;
int32 constant GridPosY = 0;
int32 constant GridDimX = 32;
int32 constant GridDimY = 32;

bool constant GridPaused = true;
bool constant GridUsePrecompile = false;

address constant TickPredeployAddr = 0x42000000000000000000000000000000000000A0;
