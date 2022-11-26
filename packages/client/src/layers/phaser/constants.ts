export const TILE_WIDTH = 3;
export const TILE_HEIGHT = 3;

export enum Scenes {
  Main = "Main",
}

export enum Maps {
  Main = "Main",
}

export enum Assets {
  OverworldTileset = "OverworldTileset",
}

export enum Sprites {}

export enum Animations {}

export const UnitTypeSprites: Record<number, Sprites> = {};

export const ItemTypeSprites: Record<number, Sprites> = {};

export const StructureTypeSprites: Record<number, Sprites> = {};

export const Colors: { [key: string]: number } = {
  White: 0xffffff,
  Black: 0x000000,
  Red: 0xff0000,
  Green: 0x00ff00,
  Blue: 0x0000ff,
  Yellow: 0xffff00,
  Cyan: 0x00ffff,
  Magenta: 0xff00ff,
  Silver: 0xc0c0c0,
  Gray: 0x808080,
};

export const FrameTime = (1000 / 2) * 0.95;
