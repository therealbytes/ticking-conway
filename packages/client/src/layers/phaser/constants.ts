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
  Silver: 0xc0c0c0,
  Gray: 0x808080,
  DarkGray: 0x3f3f3f,
  Black: 0x000000,
};
