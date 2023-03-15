import { Switch } from "@mui/material"
import type { HTMLAttributes } from "react"
import type {
  DeviceState,
  DeviceStateUpdater,
  DeviceTypes,
  DeviceStateUpdateSender,
  DeviceStateEntryActionGenerator,
  DeviceActionGenerator,
} from "~/types/Device"
import type { Message } from "~/types/Message"

interface IProps extends HTMLAttributes<HTMLElement> {
  deviceId: string
  type: DeviceTypes
  state: DeviceState
  onUpdate?: DeviceStateUpdateSender
}

export const DeviceControl = ({
  deviceId: id,
  type,
  state,
  onUpdate: updateHandler,
  className,
  ...props
}: IProps) => {
  console.log("Device Control: ", id, type, state)
  // console.log("")
  // state = {
  //   power: {
  //     "0": true,
  //     "1": false,
  //     // custom: true,
  //   },
  // }
  return (
    <div className={`DeviceControl ${className}`}>
      {/* <Switch
        checked={!!state.power}
        onChange={() => updateHandler(!state.power)}
      /> */}
      {/* {GenerateDeviceAction(id, type, state, updateHandler ?? console.log)} */}
      {/* {Object.entries(state).map(([k, v]) => {
        console.log("Entry: ", k, v)
        switch (k) {
          case "power":
            if (typeof v === "boolean") {
              console.log("POWER IS BOOLEAN")
              return <Switch checked={v} onChange={() => console.log(!v)} />
            }
            if (typeof v === "number") {
              console.log("POWER IS Number")
              return (
                <Switch
                  checked={!!v}
                  onChange={() => console.log(v ? false : true)}
                />
              )
            }

            if (typeof v === "object") {
              console.log("POWER IS OBJECT")
              return Object.entries(v).map(([pk, pv]) => {
                return (
                  <Switch
                    key={pk}
                    checked={pv}
                    onChange={() => console.log(!pv)}
                  />
                )
              })
            }
            break

          default:
            console.log("Unsupported property: ", k, v)
            break
        }
      })} */}
    </div>
  )
}

export const GenerateDeviceAction: DeviceActionGenerator = (
  id,
  type,
  state,
  onUpdate
) => {
  return Object.entries(state).map(([k, v]) => {
    console.log("Entry: ", k, v)
    switch (k) {
      case "power":
        if (typeof v === "boolean")
          return <Switch checked={v} onChange={() => onUpdate(!v)} />
        if (typeof v === "object") {
          return Object.entries(v).map(([pk, pv]) => {
            return (
              <Switch key={pk} checked={pv} onChange={() => onUpdate(!pv)} />
            )
          })
        }

      default:
        break
    }
  })
}

export const GenerateDeviceActionForStateEntry: DeviceStateEntryActionGenerator =
  (id, key, value, onUpdate) => {
    // "0": true
    console.log("Generating Device Action For State Entry: ", id, key, value)
    switch (typeof value) {
      case "boolean":
        console.log("Boolean")
        return <Switch checked={value} onChange={() => onUpdate(!value)} />

      case "number":
        console.log("It's a fucking number")
        if (value === 0 || value === 1) {
          return (
            <Switch
              checked={!!value}
              onChange={() => onUpdate(value ? 0 : 1)}
            />
          )
        }
      // Number input with plus and minus buttons (+ , -)

      case "string":
        // if starts with #, then consider it a color!
        break

      default:
        console.log("Unsupported entry")
        break
    }
  }

// {power: [ "0":1, "roof":0, "2":0, "3":1 ]} // returns an array or object of StateUpdaters
export const generateControlOptionsForThisSingleDevice = (
  state: object,
  updateHandler?: DeviceStateUpdater
) => {
  // console.log("Generating controllers for state: ", state)
  let options: { [k: string]: any }
  Object.entries(state).map(([k, v]) => {
    console.log("Entry: ", k, v)
    let controller: DeviceStateUpdater
    switch (typeof v) {
      case "boolean":
        // options[k] = (
        //   <Switch
        //     checked={v}
        //     onChange={() => updateHandler({ id: "", command: { [k]: !v } })}
        //   />
        // )
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
