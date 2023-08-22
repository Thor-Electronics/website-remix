import type { ReactNode } from "react";
import type { DeviceControlProps } from "~/types/Device";
import { DeviceType } from "~/types/DeviceType";
import { Switch } from "../atoms/Switch";

export default function Relay12({
  type: t,
  state,
  onUpdate: updateHandler,
}: DeviceControlProps): ReactNode {
  console.log("RELAY!!!", t, state);

  const handleUpdate = (k: string, v: boolean | number) => {
    if (!handleUpdate)
      return console.warn("Update handler is not configured for the relay!");
    if (!state.power) {
      state.power = {
        "0": false,
        "1": false,
        "2": false,
        "3": false,
        "4": false,
        "5": false,
        "6": false,
        "7": false,
        "8": false,
        "9": false,
        "10": false,
        "11": false,
      };
    }
    updateHandler({
      command: {
        power: {
          ...(state.power as object),
          [k]: v ? false : true,
        },
      },
    });
  };

  if (!state || typeof state !== "object") state = {};
  if (!state.power || typeof state.power !== "object") {
    state.power =
      t === DeviceType.Relay
        ? { "0": false }
        : t === DeviceType.Relay8
        ? {
            "0": false,
            "1": false,
            "2": false,
            "3": false,
            "4": false,
            "5": false,
            "6": false,
            "7": false,
          }
        : {
            "0": false,
            "1": false,
            "2": false,
            "3": false,
            "4": false,
            "5": false,
            "6": false,
            "7": false,
            "8": false,
            "9": false,
            "10": false,
            "11": false,
          };
  }

  return (
    <div
      className={`KeyControl flex flex-col items-center justify-center gap-2`}
    >
      {Object.entries(state.power).map(([k, v]) => {
        return (
          <label
            key={k}
            className="flex items-center justify-center flex-row gap-2"
          >
            {k}
            {/* <Switch checked={!!v} onChange={() => handleUpdate(k, v)} /> */}
            <Switch checked={!!v} onChange={() => handleUpdate(k, v)} />
          </label>
        );
      })}
    </div>
  );
}
