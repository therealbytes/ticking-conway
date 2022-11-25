import { createGridSystemCreator } from "./createGridSystemCreator";
import { Colors } from "../constants";

export const createCanvasSystem = createGridSystemCreator("Canvas", {
  colors: [Colors.Blue],
  alphas: [0, 0.5],
  depth: 1,
});
