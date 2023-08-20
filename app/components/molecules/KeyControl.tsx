import type { ReactNode } from "react";
import type { DeviceControlProps } from "~/types/Device";
import { DeviceType } from "~/types/DeviceType";
import { Switch } from "../atoms/Switch";
// import { Switch } from "@mui/material";

export default function Key4({
  type: t,
  state,
  onUpdate: updateHandler,
}: DeviceControlProps): ReactNode {
  const handleUpdate = (k: string, v: number | boolean) => {
    if (!handleUpdate)
      return console.warn("Update handler is not configured for this key!");
    if (!state.power) {
      state.power = {
        "0": false,
        "1": false,
        "2": false,
        "3": false,
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
  const toggleSinglePower = () => {
    if (!updateHandler) return;
    updateHandler({
      command: { power: state.power ? false : true },
    });
  };

  // Fix state if empty
  if (!state || typeof state !== "object") state = {};
  if (t !== DeviceType.Key && t !== DeviceType.Key1) {
    if (!state.power || typeof state.power !== "object") {
      state.power =
        t === DeviceType.Key2
          ? { 0: false, 1: false }
          : t === DeviceType.Key3
          ? { 0: false, 1: false, 2: false }
          : { 0: false, 1: false, 2: false, 3: false }; // it's probably 4
    }
  }

  return (
    <div className={`KeyControl`}>
      {t === DeviceType.Key || t === DeviceType.Key1 ? (
        <Switch checked={!!state.power} onChange={toggleSinglePower} />
      ) : (
        Object.entries(state.power).map(([k, v]) => {
          return (
            <label key={k}>
              {k}
              {/* <Switch checked={!!v} onChange={() => handleUpdate(k, v)} /> */}
              <Switch checked={!!v} onChange={() => handleUpdate(k, v)} />
            </label>
          );
        })
      )}
    </div>
  );
}
