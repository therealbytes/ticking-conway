import { tileCoordToPixelCoord } from "@latticexyz/phaserx";
import {
  defineComponentSystem,
  getComponentValue,
  getComponentValueStrict,
  setComponent,
  Component,
  Type,
} from "@latticexyz/recs";
import { arrayify } from "@ethersproject/bytes";
import { NetworkLayer } from "../../network";
import { PhaserLayer } from "../types";
import { unpackByte } from "../../../utils/bytes";
import { createRectangleObjectRegistry } from "../../../utils/phaser";

export function createGridSystemCreator(
  gridComponentId: string,
  colors: number[],
  alphas: number[],
  frameTime = 0,
  depth = 0
): (network: NetworkLayer, phaser: PhaserLayer) => void {
  return function createGridSystem(network: NetworkLayer, phaser: PhaserLayer) {
    const {
      world,
      components,
      components: { Position, Dimensions, CellBitSize, TailTransitionTime },
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

      if (frameTime && frameTime > 0) {
        const datenow = Date.now();
        const currTailTransition = getComponentValue(TailTransitionTime, entity);
        const currTailTransitionTime = currTailTransition ? currTailTransition.value : 0;
        const newTailTransitionTime = Math.max(datenow, currTailTransitionTime + frameTime);
        const newTailTransition: typeof currTailTransition = { value: newTailTransitionTime };
        const timeout = newTailTransitionTime - datenow;
        setComponent(TailTransitionTime, entity, newTailTransition);
        setTimeout(update, timeout);
      } else {
        update();
      }
    });
  };
}
