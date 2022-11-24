import { tileCoordToPixelCoord } from "@latticexyz/phaserx";
import { defineComponentSystem, getComponentValueStrict } from "@latticexyz/recs";
import { arrayify } from "@ethersproject/bytes";
import { NetworkLayer } from "../../network";
import { Colors } from "../constants";
import { PhaserLayer } from "../types";
import { unpackByte } from "../../../utils/bytes";
import { createRectangleObjectRegistry } from "../../../utils/phaser";

export function createNewCellsSystem(network: NetworkLayer, phaser: PhaserLayer) {
  const {
    world,
    components: { Position, Dimensions, CellBitSize, NewCells },
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

  defineComponentSystem(world, NewCells, ({ entity, value }) => {
    const conwayState = value[0];
    if (!conwayState) return console.warn("no new cells state");
    const stateBytes = arrayify(conwayState.value);

    const cellBitSize = getComponentValueStrict(CellBitSize, entity).value;
    const { x: width, y: height } = getComponentValueStrict(Dimensions, entity);
    const { x: gridX, y: gridY } = getComponentValueStrict(Position, entity) || { x: 0, y: 0 };

    const startTime = Date.now();
    for (let ii = 0; ii < stateBytes.length; ii++) {
      const byte = stateBytes[ii];
      const unpacked = unpackByte(byte, cellBitSize);
      for (let jj = 0; jj < unpacked.length; jj++) {
        const cell = unpacked[jj];
        const cellIdx = ii * unpacked.length + jj;
        const [inX, inY] = [cellIdx % width, Math.floor(cellIdx / width)];
        const cellId = `${entity}.${inX}:${inY}`;
        const color = Colors.Blue;
        const alpha = cell == 1 ? 0.5 : 0.0;
        let cellObj = cellRegistry.get(entity, cellId);
        if (!cellObj) {
          const { x, y } = tileCoordToPixelCoord({ x: gridX + inX, y: gridY + inY }, tileWidth, tileHeight);
          cellObj = phaserScene.add.rectangle(x, y, tileWidth, tileHeight, color);
          cellObj.setDepth(1);
          cellRegistry.add(entity, cellId, cellObj);
        }
        cellObj.setAlpha(alpha);
      }
    }
    const endTime = Date.now();
    console.log(`[${endTime}] new cells state update took ${Date.now() - startTime}ms`);
  });
}
