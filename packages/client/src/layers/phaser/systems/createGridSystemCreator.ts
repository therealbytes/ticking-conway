import { tileCoordToPixelCoord } from "@latticexyz/phaserx";
import { defineComponentSystem, getComponentValueStrict, Component, Type } from "@latticexyz/recs";
import { arrayify } from "@ethersproject/bytes";
import { encodeCell } from "./utils";
import { PhaserLayer } from "../types";
import { NetworkLayer } from "../../network";
import { unpackByte } from "../../../utils/bytes";
import { createRectangleObjectRegistry } from "../../../utils/phaser";

export function createGridSystemCreator(
  gridComponentId: string,
  options: {
    colors: number[];
    alphas: number[];
    depth?: number;
    timeout?: (stepsPerTick: number) => number;
  }
): (network: NetworkLayer, phaser: PhaserLayer) => void {
  const { colors, alphas, timeout } = options;
  const { depth: _depth } = options;
  const depth = _depth || 0;
  return function createGridSystem(network: NetworkLayer, phaser: PhaserLayer) {
    const {
      world,
      components,
      components: { GridConfig },
    } = network;

    const {
      scenes: {
        Main: { phaserScene },
      },
      gridRenderConfig: { tileWidth, tileHeight },
    } = phaser;

    const gridComponent = components[gridComponentId as keyof typeof components];

    const cellRegistry = createRectangleObjectRegistry();

    defineComponentSystem(world, gridComponent as Component<{ value: Type.String }>, ({ entity, value }) => {
      const gridState = value[0];
      if (!gridState) return console.warn("no grid state");
      const stateBytes = arrayify(gridState.value);

      const gridConfig = getComponentValueStrict(GridConfig, entity);
      const cellBitSize = gridConfig.cellBitSize;
      const [width, height] = [gridConfig.dimX, gridConfig.dimY];
      const [gridX, gridY] = [gridConfig.posX, gridConfig.posY];

      const unpackedState: number[][] = new Array(stateBytes.length);
      for (let ii = 0; ii < stateBytes.length; ii++) {
        unpackedState[ii] = unpackByte(stateBytes[ii], cellBitSize);
      }
      const state = unpackedState.flat();

      const update = () => {
        const startTime = Date.now();
        for (let cellIdx = 0; cellIdx < width * height; cellIdx++) {
          const cell = state[cellIdx];
          const [inX, inY] = [cellIdx % width, Math.floor(cellIdx / width)];
          const cellId = encodeCell(entity, { x: inX, y: inY });
          let cellObj = cellRegistry.get(entity, cellId);
          if (!cellObj) {
            const { x, y } = tileCoordToPixelCoord({ x: gridX + inX, y: gridY + inY }, tileWidth, tileHeight);
            cellObj = phaserScene.add.rectangle(x, y, tileWidth, tileHeight, colors[0], 1);
            cellObj.setDepth(depth);
            cellRegistry.add(entity, cellId, cellObj);
          }
          cellObj.setFillStyle(colors[cell % colors.length], alphas[cell % alphas.length]);
        }
        const endTime = Date.now();
        console.log(`[${endTime}] ${gridComponent.metadata?.contractId} render took ${Date.now() - startTime}ms`);
      };

      setTimeout(update, timeout ? timeout(gridConfig.stepsPerTick) : 0);
    });
  };
}
