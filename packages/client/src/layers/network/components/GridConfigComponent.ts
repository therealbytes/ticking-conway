import { defineComponent, Type, World } from "@latticexyz/recs";

export function defineGridConfigComponent(world: World) {
  return defineComponent(
    world,
    {
      stepsPerTick: Type.Number,
      cellBitSize: Type.Number,
      drawable: Type.Boolean,
      pausable: Type.Boolean,
      devMode: Type.Boolean,
      dimX: Type.Number,
      dimY: Type.Number,
      posX: Type.Number,
      posY: Type.Number,
    },
    {
      id: "GridConfig",
      metadata: {
        contractId: "conway.component.gridConfig",
      },
    }
  );
}
