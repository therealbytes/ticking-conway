import { pixelCoordToTileCoord, tileCoordToPixelCoord } from "@latticexyz/phaserx";
import {
  getComponentValueStrict,
  getComponentEntities,
  setComponent,
  getComponentValue,
  EntityIndex,
} from "@latticexyz/recs";
import { Coord } from "@latticexyz/utils";
import { NetworkLayer } from "../../network";
import { PhaserLayer } from "../types";
import { Colors } from "../constants";
import { createRectangleObjectRegistry } from "../../../utils/phaser";

export function createInputSystem(network: NetworkLayer, phaser: PhaserLayer) {
  const {
    world,
    components: { Dimensions, Position, Painting },
  } = network;

  const {
    scenes: {
      Main: {
        phaserScene,
        input,
        maps: {
          Main: { tileWidth, tileHeight },
        },
      },
    },
  } = phaser;

  const cellRegistry = createRectangleObjectRegistry();

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

    let painting = getComponentValue(Painting, target);
    if (!painting) {
      painting = { value: [] };
      setComponent(Painting, target, painting);
    }

    const posStr = `${cellInPos.x}:${cellInPos.y}`;
    const cellId = `${target}.${posStr}`;

    painting.value.push(posStr);

    const color = Colors.Blue;
    const alpha = 1;

    let cellObj = cellRegistry.get(target, cellId);
    if (!cellObj) {
      const { x, y } = tileCoordToPixelCoord(cellPos, tileWidth, tileHeight);
      cellObj = phaserScene.add.rectangle(x, y, tileWidth, tileHeight, color);
      cellObj.setDepth(1);
      cellRegistry.add(target, cellId, cellObj);
    }
    cellObj.setAlpha(alpha);
  });

  const enterSub = input.keyboard$.subscribe((p) => {
    const key = p as Phaser.Input.Keyboard.Key;
    if (key.keyCode === 13 && key.isDown) {
      const target = 0 as EntityIndex;
      const painting = getComponentValue(Painting, target)?.value;
      setComponent(Painting, target, { value: [] });
      if (!painting) return;
      const cleanPainting = Array.from(new Set(painting));
      const paintingCoords = cleanPainting.map((coord) => coord.split(":").map((c) => parseInt(c)));
      for (const cellId in cellRegistry.entities[target]) {
        cellRegistry.get(target, cellId)?.setAlpha(0);
      }
      network.api.paint(world.entities[target], 1, paintingCoords);
    }
  });

  world.registerDisposer(() => clickSub?.unsubscribe());
  world.registerDisposer(() => enterSub?.unsubscribe());
}
