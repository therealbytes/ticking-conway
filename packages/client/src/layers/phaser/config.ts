import { defineSceneConfig, defineScaleConfig, defineMapConfig, defineCameraConfig } from "@latticexyz/phaserx";
import { Maps, Scenes, TILE_HEIGHT, TILE_WIDTH } from "./constants";
const ANIMATION_INTERVAL = 200;

export const phaserConfig = {
  sceneConfig: {
    [Scenes.Main]: defineSceneConfig({
      assets: {},
      maps: {
        [Maps.Main]: defineMapConfig({
          chunkSize: TILE_WIDTH * 64, // tile size * tile amount
          tileWidth: TILE_WIDTH,
          tileHeight: TILE_HEIGHT,
          backgroundTile: [0],
          animationInterval: ANIMATION_INTERVAL,
          tileAnimations: undefined,
          layers: {
            layers: {
              Background: { tilesets: ["Default"], hasHueTintShader: true },
              Foreground: { tilesets: ["Default"], hasHueTintShader: true },
            },
            defaultLayer: "Background",
          },
        }),
      },
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
  cullingChunkSize: TILE_HEIGHT * 16,
};
