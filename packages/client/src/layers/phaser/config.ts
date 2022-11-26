import { defineSceneConfig, defineScaleConfig, defineCameraConfig } from "@latticexyz/phaserx";
import { Scenes } from "./constants";

export const gridConfig = {
  frameTime: (1000 / 2) * 0.95,
  tileWidth: 2,
  tileHeight: 2,
};

export const phaserConfig = {
  sceneConfig: {
    [Scenes.Main]: defineSceneConfig({
      assets: {},
      maps: {},
      sprites: {},
      animations: [],
      tilesets: {},
    }),
  },
  scale: defineScaleConfig({
    parent: "phaser-game",
    zoom: 2,
    mode: Phaser.Scale.NONE,
  }),
  cameraConfig: defineCameraConfig({
    phaserSelector: "phaser-game",
    pinchSpeed: 1,
    wheelSpeed: 1,
    maxZoom: 4,
    minZoom: 1,
  }),
  cullingChunkSize: gridConfig.tileWidth * 16,
};
