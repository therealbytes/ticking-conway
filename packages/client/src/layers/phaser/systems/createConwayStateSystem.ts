import { createGridSystemCreator } from "./createGridSystemCreator";
import { Colors, FrameTime } from "../constants";

export const createConwayStateSystem = createGridSystemCreator(
  "ConwayState",
  [Colors.White, Colors.Black],
  [1],
  FrameTime,
  0
);
