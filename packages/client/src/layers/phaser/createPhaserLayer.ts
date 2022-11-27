import { namespaceWorld } from "@latticexyz/recs";
import { createPhaserEngine } from "@latticexyz/phaserx";
import { gridRenderConfig, phaserConfig } from "./config";
import { Colors, Scenes } from "./constants";
import { NetworkLayer } from "../network";
import { createConwayStateSystem, createCanvasSystem, createPaintingSystem, createInputSystem } from "./systems";

/**
 * The Phaser layer is responsible for rendering game objects to the screen.
 */
export async function createPhaserLayer(network: NetworkLayer) {
  // --- WORLD ----------------------------------------------------------------------
  const world = namespaceWorld(network.world, "phaser");

  // --- COMPONENTS -----------------------------------------------------------------
  const components = {};

  // --- PHASER ENGINE SETUP --------------------------------------------------------
  const { game, scenes, dispose: disposePhaser } = await createPhaserEngine(phaserConfig);
  game.scene.getScene(Scenes.Main).cameras.main.setBackgroundColor(Colors.Silver);
  world.registerDisposer(disposePhaser);

  // --- LAYER CONTEXT --------------------------------------------------------------
  const context = {
    world,
    components,
    network,
    game,
    scenes,
    gridRenderConfig,
  };

  // --- SYSTEMS --------------------------------------------------------------------
  createConwayStateSystem(network, context);
  createCanvasSystem(network, context);
  createPaintingSystem(network, context);
  createInputSystem(network, context);

  return context;
}
