import { defineComponent, Type, World } from "@latticexyz/recs";

export function defineTailTransitionComponent(world: World) {
  return defineComponent(
    world,
    {
      timestamp: Type.Number,
    },
    {
      id: "TailTransition",
      metadata: {
        contractId: "component.TailTransition",
      },
    }
  );
}
