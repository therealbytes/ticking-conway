import { createWorld, EntityID, EntityIndex } from "@latticexyz/recs";
import { Coord } from "@latticexyz/utils";
import {
  createActionSystem,
  defineBoolComponent,
  defineStringComponent,
  setupMUDNetwork,
} from "@latticexyz/std-client";

import { SystemTypes } from "contracts/types/SystemTypes";
import { SystemAbis } from "contracts/types/SystemAbis.mjs";

// import { setupDevSystems } from "./setup";
import { defineLoadingStateComponent, definePaintingComponent, defineGridConfigComponent } from "./components";

import { GameConfig, getNetworkConfig } from "./config";

/**
 * The Network layer is the lowest layer in the client architecture.
 * Its purpose is to synchronize the client components with the contract components.
 */
export async function createNetworkLayer(config: GameConfig) {
  console.log("Network config", config);

  // --- WORLD ----------------------------------------------------------------------
  const world = createWorld();

  // --- COMPONENTS -----------------------------------------------------------------
  const components = {
    // LOCAL COMPONENTS
    LoadingState: defineLoadingStateComponent(world),
    Painting: definePaintingComponent(world),
    // ON-CHAIN COMPONENTS
    GridConfig: defineGridConfigComponent(world),
    Paused: defineBoolComponent(world, {
      id: "Paused",
      metadata: { contractId: "conway.component.paused" },
    }),
    ConwayState: defineStringComponent(world, {
      id: "ConwayState",
      metadata: { contractId: "conway.component.conwayState" },
    }),
    Canvas: defineStringComponent(world, {
      id: "Canvas",
      metadata: { contractId: "conway.component.canvas" },
    }),
  };

  // --- SETUP ----------------------------------------------------------------------
  const { txQueue, systems, txReduced$, network, startSync, encoders } = await setupMUDNetwork<
    typeof components,
    SystemTypes
  >(getNetworkConfig(config), world, components, SystemAbis);

  // --- ACTION SYSTEM --------------------------------------------------------------
  const actions = createActionSystem(world, txReduced$);

  // --- API ------------------------------------------------------------------------
  function paint(entity: EntityIndex, value: number, coords: Coord[]) {
    actions.add({
      id: `paint ${entity} ${coords}` as EntityID,
      requirement: () => true,
      components: {},
      execute: () => systems["conway.system.paint"].executeTyped(world.entities[entity], value, coords),
      updates: () => [],
    });
  }
  function tick() {
    actions.add({
      id: `tick` as EntityID,
      requirement: () => true,
      components: {},
      execute: () => systems["conway.system.tick"].executeTyped(true),
      updates: () => [],
    });
  }
  function pause(entity: EntityIndex, pause: boolean) {
    actions.add({
      id: `pause ${entity}` as EntityID,
      requirement: () => true,
      components: {},
      execute: () => systems["conway.system.pause"].executeTyped(world.entities[entity], pause),
      updates: () => [],
    });
  }

  // --- CONTEXT --------------------------------------------------------------------
  const context = {
    world,
    components,
    txQueue,
    systems,
    txReduced$,
    startSync,
    network,
    actions,
    api: { paint, tick, pause },
    // dev: setupDevSystems(world, encoders as Promise<any>, systems),
  };

  return context;
}
