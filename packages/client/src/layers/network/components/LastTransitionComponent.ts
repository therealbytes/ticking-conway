import { defineComponent, Type, World } from "@latticexyz/recs";

export function defineLastTransitionComponent(world: World) {
  return defineComponent(
    world,
    {
      timestamp: Type.Number,
    },
    {
      id: "LastTransition",
      metadata: {
        contractId: "component.LastTransition",
      },
    }
  );
}
