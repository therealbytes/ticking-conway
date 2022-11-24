import { defineComponent, Type, World } from "@latticexyz/recs";

export function definePaintingComponent(world: World) {
  return defineComponent(
    world,
    {
      value: Type.StringArray,
    },
    {
      id: "Painting",
      metadata: {
        contractId: "component.Painting",
      },
    }
  );
}
