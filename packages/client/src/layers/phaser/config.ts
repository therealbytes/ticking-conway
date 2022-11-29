import { defineSceneConfig, defineScaleConfig, defineCameraConfig } from "@latticexyz/phaserx";
import { Scenes } from "./constants";

export const gridRenderConfig = {
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
    maxZoom: 8,
    minZoom: 0.5,
  }),
  cullingChunkSize: gridRenderConfig.tileWidth * 16,
};
