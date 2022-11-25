import { pixelCoordToTileCoord } from "@latticexyz/phaserx";
import {
  getComponentValueStrict,
  getComponentEntities,
  setComponent,
  getComponentValue,
  EntityIndex,
} from "@latticexyz/recs";
import { Coord } from "@latticexyz/utils";
import { decodePosition, encodePosition } from "./utils";
import { PhaserLayer } from "../types";
import { NetworkLayer } from "../../network";

export function createInputSystem(network: NetworkLayer, phaser: PhaserLayer) {
  const {
    world,
    components: { Dimensions, Position, Painting },
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

    let target: EntityIndex | undefined;
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

    if (target === undefined || cellInPos === undefined) return;
    if (target != (0 as EntityIndex)) return;

    const posStr = encodePosition(cellInPos);

    const painting = getComponentValue(Painting, target) || { value: [] };
    if (painting.value.includes(posStr)) return;
    painting.value.push(posStr);
    setComponent(Painting, target, painting);
  });

  function popPainting(target: EntityIndex) {
    const painting = getComponentValue(Painting, target)?.value;
    if (!painting || painting.length == 0) return;
    setComponent(Painting, target, { value: [] });
    return painting;
  }

  const enterSub = input.keyboard$.subscribe((p) => {
    const key = p as Phaser.Input.Keyboard.Key;
    if (key.keyCode !== 13 || !key.isDown) return;
    const target = 0 as EntityIndex;
    const painting = popPainting(target);
    if (!painting) return;
    const paintingCoords = painting.map((coord) => decodePosition(coord));
    network.api.paint(world.entities[target], 1, paintingCoords);
  });

  const escSub = input.keyboard$.subscribe((p) => {
    const key = p as Phaser.Input.Keyboard.Key;
    if (key.keyCode !== 27 || !key.isDown) return;
    const target = 0 as EntityIndex;
    popPainting(target);
  });

  world.registerDisposer(() => clickSub?.unsubscribe());
  world.registerDisposer(() => enterSub?.unsubscribe());
  world.registerDisposer(() => escSub?.unsubscribe());
}
