import { tileCoordToPixelCoord } from "@latticexyz/phaserx";
import { defineComponentSystem, getComponentValueStrict, Component, Type } from "@latticexyz/recs";
import { arrayify } from "@ethersproject/bytes";
import { NetworkLayer } from "../../network";
import { PhaserLayer } from "../types";
import { unpackByte } from "../../../utils/bytes";
import { createRectangleObjectRegistry } from "../../../utils/phaser";

export function createGridSystemCreator(
  gridComponentId: string,
  options: {
    colors: number[];
    alphas: number[];
    depth?: number;
    timeout?: () => number;
  }
): (network: NetworkLayer, phaser: PhaserLayer) => void {
  const { colors, alphas, timeout } = options;
  const { depth: _depth } = options;
  const depth = _depth || 0;
  return function createGridSystem(network: NetworkLayer, phaser: PhaserLayer) {
    const {
      world,
      components,
      components: { Position, Dimensions, CellBitSize },
    } = network;

    const {
      scenes: {
        Main: {
          phaserScene,
          maps: {
            Main: { tileWidth, tileHeight },
          },
        },
      },
    } = phaser;

    const gridComponent = components[gridComponentId as keyof typeof components];

    const cellRegistry = createRectangleObjectRegistry();

    defineComponentSystem(world, gridComponent as Component<{ value: Type.String }>, ({ entity, value }) => {
      const gridState = value[0];
      if (!gridState) return console.warn("no grid state");
      const stateBytes = arrayify(gridState.value);

      const cellBitSize = getComponentValueStrict(CellBitSize, entity).value;
      const { x: width, y: height } = getComponentValueStrict(Dimensions, entity);
      const { x: gridX, y: gridY } = getComponentValueStrict(Position, entity) || { x: 0, y: 0 };

      const update = () => {
        const startTime = Date.now();
        for (let ii = 0; ii < stateBytes.length; ii++) {
          const byte = stateBytes[ii];
          const unpacked = unpackByte(byte, cellBitSize);
          for (let jj = 0; jj < unpacked.length; jj++) {
            const cell = unpacked[jj];
            const cellIdx = ii * unpacked.length + jj;
            const [inX, inY] = [cellIdx % width, Math.floor(cellIdx / width)];
            const cellId = `${entity}.${inX}:${inY}`;
            let cellObj = cellRegistry.get(entity, cellId);
            if (!cellObj) {
              const { x, y } = tileCoordToPixelCoord({ x: gridX + inX, y: gridY + inY }, tileWidth, tileHeight);
              cellObj = phaserScene.add.rectangle(x, y, tileWidth, tileHeight, colors[0], 1);
              cellObj.setDepth(depth);
              cellRegistry.add(entity, cellId, cellObj);
            }
            cellObj.setFillStyle(colors[cell % colors.length], alphas[cell % alphas.length]);
          }
        }
        const endTime = Date.now();
        console.log(`[${endTime}] ${gridComponent.metadata?.contractId} render took ${Date.now() - startTime}ms`);
      };

      setTimeout(update, timeout ? timeout() : 0);
    });
  };
}