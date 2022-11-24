import { pixelCoordToTileCoord } from "@latticexyz/phaserx";
import { getComponentValueStrict, getComponentEntities } from "@latticexyz/recs";
import { Coord } from "@latticexyz/utils";
import { NetworkLayer } from "../../network";
import { PhaserLayer } from "../types";

export function createInputSystem(network: NetworkLayer, phaser: PhaserLayer) {
  const {
    world,
    components: { Dimensions, Position },
  } = network;

  const {
    scenes: {
      Main: {
        input,
        maps: {
          Main: { tileWidth, tileHeight },
        },
      },
    },
  } = phaser;

  const clickSub = input.click$.subscribe((p) => {
    const pointer = p as Phaser.Input.Pointer;
    const cellPos = pixelCoordToTileCoord(
      { x: pointer.worldX + tileWidth / 2, y: pointer.worldY + tileHeight / 2 },
      tileWidth,
      tileHeight
    );

    let target: number | undefined;
    let cellInPos: Coord | undefined;

    for (const entity of getComponentEntities(Dimensions)) {
      const dim = getComponentValueStrict(Dimensions, entity);
      const pos = getComponentValueStrict(Position, entity);
      if (cellPos.x >= pos.x && cellPos.x < pos.x + dim.x && cellPos.y >= pos.y && cellPos.y < pos.y + dim.y) {
        target = entity;
        cellInPos = { x: cellPos.x - pos.x, y: cellPos.y - pos.y };
        break;
      }
    }

    if (target && cellInPos) {
      console.log("click on", target, cellInPos);
      network.api.paint(world.entities[target], 1, [cellInPos]);
    }
  });

  world.registerDisposer(() => clickSub?.unsubscribe());
}
