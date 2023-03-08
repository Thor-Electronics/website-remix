import { Switch } from "@mui/material"
import type { HTMLAttributes } from "react"
import type {
  DeviceState,
  DeviceStateUpdater,
  DeviceTypes,
  StateUpdateHandler,
} from "~/types/Device"
import type { Message } from "~/types/Message"

interface IProps extends HTMLAttributes<HTMLElement> {
  type: DeviceTypes
  state: DeviceState
  onUpdate?: StateUpdateHandler
}

export const DeviceControl = ({
  type,
  state,
  onUpdate: updateHandler,
  className,
  ...props
}: IProps) => {
  console.log("Device Control: ", type, state)
  // console.log("")
  const options = generateControlOptionsForThisSingleDevice({
    power: { "0": 1, roof: 0, "2": 0, "3": 1 },
  })
  return <div className={`DeviceControl ${className}`}>options</div>
}

// {power: [ "0":1, "roof":0, "2":0, "3":1 ]} // returns an array or object of StateUpdaters
export const generateControlOptionsForThisSingleDevice = (state: object) => {
  // console.log("Generating controllers for state: ", state)
  let options: { [k: string]: any }
  Object.entries(state).map(([k, v]) => {
    console.log("Entry: ", k, v)
    let controller: DeviceStateUpdater
    switch (typeof v) {
      case "boolean":
        // options[k] = <Switch checked={v} onChange={} />
        // Generate Switch
        break
      case "number":
        // Number Input? IDK
        break
      case "string":
        // Generate Input?
        break
      case "object":
        console.log("Recursively generating for object: ", v)
        const childOptions = generateControlOptionsForThisSingleDevice(v)
        break

      default:
        // Unsupported type
        break
    }
    if (typeof v === "boolean") {
      // Generate switch
    }
    // "0": true
  })
}

export default DeviceControl
