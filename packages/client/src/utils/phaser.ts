type EntityObjectRegistry<Type> = ReturnType<typeof createEntityObjectRegistry<Type>>;

export function createEntityObjectRegistry<Type>() {
  const entities: Record<number, Record<string, Type>> = {};
  function has(entity: number, id: string): boolean {
    return entities[entity] !== undefined && entities[entity][id] !== undefined;
  }
  function get(entity: number, id: string): Type | undefined {
    return (entities[entity] || {})[id];
  }
  function add(entity: number, id: string, obj: Type): void {
    if (!entities[entity]) entities[entity] = {};
    entities[entity][id] = obj;
  }
  return { entities, has, get, add };
}

export function createPhaserObjectRegistry(): EntityObjectRegistry<Phaser.GameObjects.GameObject> {
  return createEntityObjectRegistry<Phaser.GameObjects.GameObject>();
}

export function createRectangleObjectRegistry(): EntityObjectRegistry<Phaser.GameObjects.Rectangle> {
  return createEntityObjectRegistry<Phaser.GameObjects.Rectangle>();
}
