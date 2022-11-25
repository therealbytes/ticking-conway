import { EntityIndex } from "@latticexyz/recs";

export const encodePosition = (position: { x: number; y: number }) => `${position.x}:${position.y}`;
export const decodePosition = (position: string) => {
  const [x, y] = position.split(":").map((x) => parseInt(x));
  return { x, y };
};

export const encodeCell = (entity: EntityIndex, position: { x: number; y: number }) =>
  `${entity}.${encodePosition(position)}`;
export const decodeCell = (cell: string) => {
  const [entityStr, positionStr] = cell.split(".");
  return {
    entity: parseInt(entityStr) as EntityIndex,
    position: decodePosition(positionStr),
  };
};
