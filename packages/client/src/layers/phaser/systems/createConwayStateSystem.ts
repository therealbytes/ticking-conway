import { tileCoordToPixelCoord } from "@latticexyz/phaserx";
import { defineComponentSystem, getComponentValue, getComponentValueStrict, setComponent } from "@latticexyz/recs";
import { arrayify } from "@ethersproject/bytes";
import { NetworkLayer } from "../../network";
import { Colors, FrameTime } from "../constants";
import { PhaserLayer } from "../types";
import { unpackByte } from "../../../utils/bytes";
import { createRectangleObjectRegistry } from "../../../utils/phaser";

export function createConwayStateSystem(network: NetworkLayer, phaser: PhaserLayer) {
  const {
    world,
    components: { Position, Dimensions, CellBitSize, ConwayState, TailTransitionTime },
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

  const cellRegistry = createRectangleObjectRegistry();

  defineComponentSystem(world, ConwayState, ({ entity, value }) => {
    const conwayState = value[0];
    if (!conwayState) return console.warn("no conway state");
    const stateBytes = arrayify(conwayState.value);

    const cellBitSize = getComponentValueStrict(CellBitSize, entity).value;
    const { x: width, y: height } = getComponentValueStrict(Dimensions, entity);
    const { x: gridX, y: gridY } = getComponentValueStrict(Position, entity) || { x: 0, y: 0 };

    const datenow = Date.now();
    const currTailTransition = getComponentValue(TailTransitionTime, entity);
    const currTailTransitionTime = currTailTransition ? currTailTransition.value : 0;
    const newTailTransitionTime = Math.max(datenow, currTailTransitionTime + FrameTime);
    const newTailTransition: typeof currTailTransition = { value: newTailTransitionTime };
    const timeout = newTailTransitionTime - datenow;
    setComponent(TailTransitionTime, entity, newTailTransition);

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
          let cellObj = cellRegistry.get(entity, cellId);
          if (!cellObj) {
            cellObj = phaserScene.add.rectangle(x, y, tileWidth, tileHeight, color, 1);
            cellRegistry.add(entity, cellId, cellObj);
          }
          cellObj.setFillStyle(color);
        }
      }
      const endTime = Date.now();
      console.log(`[${endTime}] conway state update took ${Date.now() - startTime}ms`);
    }, timeout);
  });
}
