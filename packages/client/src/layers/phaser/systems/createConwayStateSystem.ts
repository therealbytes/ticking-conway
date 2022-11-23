import { tileCoordToPixelCoord } from "@latticexyz/phaserx";
import { defineComponentSystem, getComponentValue, getComponentValueStrict } from "@latticexyz/recs";
import { arrayify } from "@ethersproject/bytes";
import { NetworkLayer } from "../../network";
import { Colors, Sprites } from "../constants";
import { PhaserLayer } from "../types";

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
    components: { Position, Dimensions, CellBitSize, ConwayState },
  } = network;

  const {
    scenes: {
      Main: {
        objectPool,
        config,
        maps: {
          Main: { tileWidth, tileHeight },
        },
      },
    },
  } = phaser;

  defineComponentSystem(world, ConwayState, ({ entity, value }) => {
    const conwayState = value[0];
    if (!conwayState) return console.warn("no position");
    const stateBytes = arrayify(conwayState.value);

    const cellBitSize = getComponentValueStrict(CellBitSize, entity).value;
    const { x: width, y: height } = getComponentValueStrict(Dimensions, entity);
    const { x: gridX, y: gridY } = getComponentValue(Position, entity) || { x: 0, y: 0 };

    console.log("stateBytes", stateBytes);

    for (let ii = 0; ii < stateBytes.length; ii++) {
      const byte = stateBytes[ii];
      const unpacked = unpackByte(byte, cellBitSize);
      for (let jj = 0; jj < unpacked.length; jj++) {
        const cell = unpacked[jj];
        const cellIdx = ii * unpacked.length + jj;
        const [inX, inY] = [cellIdx % width, Math.floor(cellIdx / width)];
        const { x, y } = tileCoordToPixelCoord({ x: gridX + inX, y: gridY + inY }, tileWidth, tileHeight);
        const cellId = `${entity}.${inX}-${inY}`;

        const sprite = config.sprites[cell == 1 ? Sprites.Donkey : Sprites.Gold];
        const object = objectPool.get(cellId, "Sprite");
        object.setComponent({
          id: ConwayState.id,
          once: (gameObject) => {
            gameObject.setTexture(sprite.assetKey, sprite.frame);
            gameObject.setPosition(x, y);
          },
        });
      }
    }
  });
}
