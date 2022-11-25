import { createGridSystemCreator } from "./createGridSystemCreator";
import { Colors, FrameTime } from "../constants";

export const createConwayStateSystem = (() => {
  let tailTransitionTime = 0;
  const timeout = () => {
    const datenow = Date.now();
    const newTailTransitionTime = Math.max(datenow, tailTransitionTime + FrameTime);
    const timeout = newTailTransitionTime - datenow;
    tailTransitionTime = newTailTransitionTime;
    return timeout;
  };
  return createGridSystemCreator("ConwayState", {
    colors: [Colors.White, Colors.Black],
    alphas: [1],
    depth: 0,
    timeout: timeout,
  });
})();
