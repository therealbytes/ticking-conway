// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById } from "solecs/utils.sol";

import { GridId } from "../constants.sol";
import { ConwayPC } from "../libraries/LibConwayPC.sol";
import { ConwayEVMUnpacked as ConwayEVM } from "../libraries/LibConwayEVM.sol";
import { GridConfig, GridConfigComponent, ID as GridConfigComponentID } from "../components/GridConfigComponent.sol";
import { PausedComponent, ID as PausedComponentID } from "../components/PausedComponent.sol";
import { CanvasComponent, ID as CanvasComponentID } from "../components/CanvasComponent.sol";
import { ConwayStateComponent, ID as ConwayStateComponentID } from "../components/ConwayStateComponent.sol";
import { TickPredeployAddr } from "../constants.sol";

import { GridUsePrecompile } from "../constants.sol";

import "forge-std/console.sol";

uint256 constant ID = uint256(keccak256("conway.system.tick"));

contract TickSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function tick() external {
    executeTyped(false);
  }

  function execute(bytes memory arguments) public returns (bytes memory) {
    bool debug = abi.decode(arguments, (bool));
    uint256 entity = GridId;
    // Get config
    GridConfig memory config = GridConfigComponent(getAddressById(components, GridConfigComponentID)).getValue(entity);
    // Check requirements
    require(msg.sender == TickPredeployAddr || config.devMode, "TickSystem: only tick predeploy can call tick()");
    // Get component
    ConwayStateComponent conwayComponent = ConwayStateComponent(getAddressById(components, ConwayStateComponentID));
    // Check if paused
    if (!debug && config.pausable) {
      PausedComponent pausedComponent = PausedComponent(getAddressById(components, PausedComponentID));
      if (pausedComponent.getValue(entity)) {
        return abi.encodePacked();
      }
    }
    // Get values
    bytes memory state = conwayComponent.getValue(entity);
    // Update state with canvas
    if (config.drawable) {
      CanvasComponent canvasComponent = CanvasComponent(getAddressById(components, CanvasComponentID));
      bytes memory canvas = canvasComponent.getValue(entity);
      printCanvas(state, canvas, config.cellBitSize);
      // Set value
      canvasComponent.setValue(entity, new bytes(canvas.length));
    }
    // Execute steps
    uint256 ii = 0;
    while (true) {
      if (GridUsePrecompile) {
        state = ConwayPC.step(uint256(int256(config.dimX)), uint256(int256(config.dimY)), config.cellBitSize, state);
      } else {
        require(config.cellBitSize == 1, "TickSystem: cellBitSize must be 1 for EVM implementation");
        uint256 gl = gasleft();
        state = ConwayEVM.step(uint256(int256(config.dimX)), uint256(int256(config.dimY)), state);
        console.log("ConwayEVM: used %s gas", gl - gasleft());
      }
      if (ii == config.stepsPerTick - 1) {
        conwayComponent.setValue(entity, state);
        break;
      } else {
        conwayComponent.setGhostValue(entity, state);
        ii++;
      }
    }
  }

  function executeTyped(bool debug) public returns (bytes memory) {
    return execute(abi.encode(debug));
  }

  function printCanvas(
    bytes memory state,
    bytes memory canvas,
    uint256 cellBitSize
  ) internal pure {
    for (uint256 ii = 0; ii < canvas.length; ii++) {
      bytes1 n = canvas[ii];
      if (n == 0) {
        continue;
      }
      bytes1 b = state[ii];
      if (b == 0) {
        state[ii] = n;
        continue;
      }
      for (uint256 jj = 0; jj < 8 / cellBitSize; jj++) {
        uint256 offset = jj * cellBitSize;
        bytes1 mask = bytes1(uint8(2**cellBitSize - 1)) << (8 - offset - cellBitSize);
        bytes1 sn = n & mask;
        if (sn == 0) {
          continue;
        }
        b = (b & ~mask) | sn;
      }
      state[ii] = b;
    }
  }
}
