import React from "react";
import { registerUIComponent } from "../engine";
import { getComponentEntities, getComponentValueStrict } from "@latticexyz/recs";
import { map } from "rxjs";
import { ActionStateString, ActionState } from "@latticexyz/std-client";

export function registerActionQueue() {
  registerUIComponent(
    "ActionQueue",
    {
      rowStart: 1,
      rowEnd: 13,
      colStart: 10,
      colEnd: 13,
    },
    (layers) => {
      const {
        network: {
          actions: { Action },
        },
      } = layers;

      return Action.update$.pipe(
        map(() => ({
          Action,
        }))
      );
    },
    ({ Action }) => {
      return (
        <div style={
          {
            padding: "5px",
            margin: "5px",
          }
        }>
          {[...getComponentEntities(Action)].map((e) => {
            const actionData = getComponentValueStrict(Action, e);
            const state = ActionStateString[actionData.state as ActionState];
            return (
              <p key={`action${e}`} style={
                {
                  padding: "5px 10px",
                  marginBottom: "4px",
                  border: "1px solid black",
                  backgroundColor: "darkgray",
                  color: "black",
                  textTransform: "capitalize",
                  fontSize: "0.8em",
                }
              }>
                {actionData.metadata?.actionType}: {state}
              </p>
            );
          })}
        </div>
      );
    }
  );
}
