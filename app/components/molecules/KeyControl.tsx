import { Switch } from "@mui/material"
import type { ReactNode } from "react"
import type { DeviceControlProps } from "~/types/Device"
import { DeviceTypes } from "~/types/Device"

export default function Key4({
  type: t,
  state,
  onUpdate: updateHandler,
}: DeviceControlProps): ReactNode {
  const handleUpdate = (k: string, v: number | boolean) => {
    if (!handleUpdate)
      return console.warn("Update handler is not configured for this key!")
    updateHandler({
      command: {
        power: {
          ...(state.power as object),
          [k]: v ? false : true,
        },
      },
    })
  }
  const toggleSinglePower = () => {
    if (!updateHandler) return
    updateHandler({
      command: { power: state.power ? false : true },
    })
  }

  // Fix state if empty
  if (t !== DeviceTypes.KEY && t !== DeviceTypes.KEY1) {
    if (typeof state.power !== "object") {
      state.power =
        t === DeviceTypes.KEY2
          ? { 0: false, 1: false }
          : t === DeviceTypes.KEY3
          ? { 0: false, 1: false, 2: false }
          : { 0: false, 1: false, 2: false, 3: false } // it's probably 4
    }
  }

  return (
    <div className="switches">
      {t === DeviceTypes.KEY || t === DeviceTypes.KEY1 ? (
        <Switch checked={!!state.power} onChange={toggleSinglePower} />
      ) : (
        Object.entries(state.power).map(([k, v]) => {
          return (
            <label key={k}>
              {k}
              <Switch checked={!!v} onChange={() => handleUpdate(k, v)} />
            </label>
          )
        })
      )}
    </div>
  )
}
