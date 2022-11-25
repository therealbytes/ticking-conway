import { createGridSystemCreator } from "./createGridSystemCreator";
import { Colors } from "../constants";

export const createCanvasSystem = createGridSystemCreator("Canvas", [Colors.Blue], [0, 0.5], 0, 1);
