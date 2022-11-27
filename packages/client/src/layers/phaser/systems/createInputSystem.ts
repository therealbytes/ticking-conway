import { pixelCoordToTileCoord, tileCoordToPixelCoord } from "@latticexyz/phaserx";
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
import { Scenes } from "../constants";
import { NetworkLayer } from "../../network";

export function createInputSystem(network: NetworkLayer, phaser: PhaserLayer) {
  const {
    world,
    components: { GridConfig, Paused, Painting },
  } = network;

  const {
    scenes: {
      Main: { input },
    },
    gridRenderConfig: { tileWidth, tileHeight },
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

    for (const entity of getComponentEntities(GridConfig)) {
      const config = getComponentValueStrict(GridConfig, entity);
      if (
        cellPos.x >= config.posX &&
        cellPos.x < config.posX + config.dimX &&
        cellPos.y >= config.posY &&
        cellPos.y < config.posY + config.dimY
      ) {
        target = entity;
        if (!config.drawable) return;
        cellInPos = { x: cellPos.x - config.posX, y: cellPos.y - config.posY };
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

  const keySub = input.keyboard$.subscribe((p) => {
    const key = p as Phaser.Input.Keyboard.Key;
    if (!key.isDown) return;

    const target = 0 as EntityIndex;
    const config = getComponentValueStrict(GridConfig, target);

    if (key.keyCode == Phaser.Input.Keyboard.KeyCodes.ENTER) {
      // Send painting
      const painting = popPainting(target);
      if (!painting) return;
      const paintingCoords = painting.map((coord) => decodePosition(coord));
      network.api.paint(target, 1, paintingCoords);
    } else if (key.keyCode == Phaser.Input.Keyboard.KeyCodes.ESC) {
      // Clear painting
      popPainting(target);
    } else if (key.keyCode == Phaser.Input.Keyboard.KeyCodes.T) {
      // Tick
      if (!config.devMode) return;
      network.api.tick();
    } else if (key.keyCode == Phaser.Input.Keyboard.KeyCodes.C) {
      // Center camera
      const { x, y } = tileCoordToPixelCoord(
        {
          x: config.posX + config.dimX / 2,
          y: config.posY + config.dimY / 2,
        },
        tileWidth,
        tileHeight
      );
      phaser.game.scene.getScene(Scenes.Main).cameras.main.centerOn(x, y);
    } else if (key.keyCode == Phaser.Input.Keyboard.KeyCodes.P) {
      // Toggle pause
      if (!config.pausable) return;
      const paused = getComponentValue(Paused, target)?.value;
      network.api.pause(target, !paused);
    }
  });

  world.registerDisposer(() => clickSub?.unsubscribe());
  world.registerDisposer(() => keySub?.unsubscribe());
}
