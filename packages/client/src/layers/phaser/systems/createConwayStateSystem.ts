import { createGridSystemCreator } from "./createGridSystemCreator";
import { Colors } from "../constants";

export const createConwayStateSystem = (() => {
  let tailTransitionTime = 0;
  const timeout = (stepsPerTick: number) => {
    const period = (1000 / stepsPerTick) * 0.95;
    const datenow = Date.now();
    const newTailTransitionTime = Math.max(datenow, tailTransitionTime + period);
    const timeout = newTailTransitionTime - datenow;
    tailTransitionTime = newTailTransitionTime;
    return timeout;
  };
  return createGridSystemCreator("ConwayState", {
    colors: [Colors.Black, Colors.White],
    alphas: [1],
    depth: 0,
    timeout: timeout,
  });
})();
