import { createWorld, EntityID } from "@latticexyz/recs";
import { setupDevSystems } from "./setup";
import {
  createActionSystem,
  defineCoordComponent,
  defineNumberComponent,
  defineStringComponent,
  setupMUDNetwork,
} from "@latticexyz/std-client";

import { defineLoadingStateComponent, definePaintingComponent } from "./components";
import { SystemTypes } from "contracts/types/SystemTypes";
import { SystemAbis } from "contracts/types/SystemAbis.mjs";
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
    TailTransitionTime: defineNumberComponent(world, {
      id: "TailTransitionTime",
      metadata: { contractId: "component.TailTransitionTime" },
    }),
    // ON-CHAIN COMPONENTS
    Position: defineCoordComponent(world, {
      id: "Position",
      metadata: { contractId: "conway.component.position" },
    }),
    Dimensions: defineCoordComponent(world, {
      id: "Dimensions",
      metadata: { contractId: "conway.component.dimensions" },
    }),
    CellBitSize: defineNumberComponent(world, {
      id: "CellBitSize",
      metadata: { contractId: "conway.component.cellBitSize" },
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
  function paint(entity: EntityID, value: number, coords: Coord[]) {
    systems["conway.system.paint"].executeTyped(entity, value, coords);
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
    api: { paint },
    dev: setupDevSystems(world, encoders as Promise<any>, systems),
  };

  return context;
}
