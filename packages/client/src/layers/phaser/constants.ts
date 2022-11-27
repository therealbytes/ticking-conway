export enum Scenes {
  Main = "Main",
}

export enum Maps {}

export enum Assets {}

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
  DarkGray: 0x3f3f3f,
};
