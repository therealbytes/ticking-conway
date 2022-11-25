import { createGridSystemCreator } from "./createGridSystemCreator";
import { Colors, FrameTime } from "../constants";

export const createConwayStateSystem = createGridSystemCreator("ConwayState", {
  colors: [Colors.White, Colors.Black],
  alphas: [1],
  frameTime: FrameTime,
  depth: 0,
});
