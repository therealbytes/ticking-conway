import { tileCoordToPixelCoord } from "@latticexyz/phaserx";
import { defineComponentSystem, getComponentValue, getComponentValueStrict, setComponent } from "@latticexyz/recs";
import { arrayify } from "@ethersproject/bytes";
import { NetworkLayer } from "../../network";
import { Colors, FrameTime } from "../constants";
import { PhaserLayer } from "../types";

type CellRegistry = {
  [key: string]: {
    [key: string]: Phaser.GameObjects.Rectangle;
  };
};

function unpackByte(b: number, n: number): number[] {
  if (n < 0 || n > 8 || 8 % n !== 0) {
    throw new Error("invalid pack size");
  }
  const out = new Array(8 / n);
  for (let ii = 0; ii < out.length; ii++) {
    out[ii] = (b >> (8 - n * (ii + 1))) & ((1 << n) - 1);
  }
  return out;
}

export function createConwayStateSystem(network: NetworkLayer, phaser: PhaserLayer) {
  const {
    world,
    components: { Position, Dimensions, CellBitSize, ConwayState, TailTransition },
  } = network;

  const cellRegistry: CellRegistry = {};

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

  defineComponentSystem(world, ConwayState, ({ entity, value }) => {
    let entityCellRegistry = cellRegistry[entity];
    if (!entityCellRegistry) {
      entityCellRegistry = cellRegistry[entity] = {};
    }

    const conwayState = value[0];
    if (!conwayState) return console.warn("no position");
    const stateBytes = arrayify(conwayState.value);

    const cellBitSize = getComponentValueStrict(CellBitSize, entity).value;
    const { x: width, y: height } = getComponentValueStrict(Dimensions, entity);
    const { x: gridX, y: gridY } = getComponentValue(Position, entity) || { x: 0, y: 0 };

    const datenow = Date.now();
    const currTailTransition = getComponentValue(TailTransition, entity);
    const currTailTransitionTime = currTailTransition ? currTailTransition.timestamp : 0;
    const newTailTransitionTime = Math.max(datenow, currTailTransitionTime + FrameTime);
    const newTailTransition: typeof currTailTransition = { timestamp: newTailTransitionTime };
    const timeout = newTailTransitionTime - datenow;
    setComponent(TailTransition, entity, newTailTransition);

    setTimeout(() => {
      const startTime = Date.now();
      for (let ii = 0; ii < stateBytes.length; ii++) {
        const byte = stateBytes[ii];
        const unpacked = unpackByte(byte, cellBitSize);
        for (let jj = 0; jj < unpacked.length; jj++) {
          const cell = unpacked[jj];
          const cellIdx = ii * unpacked.length + jj;
          const [inX, inY] = [cellIdx % width, Math.floor(cellIdx / width)];
          const { x, y } = tileCoordToPixelCoord({ x: gridX + inX, y: gridY + inY }, tileWidth, tileHeight);
          const cellId = `${entity}.${inX}-${inY}`;
          const color = cell == 1 ? Colors.Black : Colors.White;
          let cellObj = entityCellRegistry[cellId];
          if (!cellObj) {
            cellObj = entityCellRegistry[cellId] = phaserScene.add.rectangle(x, y, tileWidth, tileHeight, color, 1);
          }
          cellObj.setFillStyle(color);
        }
      }
      const endTime = Date.now();
      console.log(`[${endTime}] conway state update took ${Date.now() - startTime}ms`);
    }, timeout);
  });
}
