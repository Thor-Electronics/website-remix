import { Switch } from "@mui/material"
import type { HTMLAttributes } from "react"
import type { Device, DeviceTypes, StateUpdateHandler } from "~/types/Device"
import { OnlinePulse } from "./DetailedDeviceCard"
import DeviceControl from "./DeviceControl"

interface IProps extends HTMLAttributes<HTMLElement> {
  data: Device
  className?: string
  onUpdate?: StateUpdateHandler
}

export const SimpleDeviceCard = ({
  data: d,
  className,
  onUpdate: updateHandler,
  ...props
}: IProps) => {
  const togglePower = () => {
    if (!updateHandler) return
    updateHandler({
      command: { power: d.state.power ? 0 : 1 },
      id: d.id,
    })
  }
  return (
    <div
      className={`SimpleDeviceCard bg-white border rounded-lg p-2 flex justify-between ${
        d.isOnline ? "border-green-500" : "border-slate-300"
      }`}
    >
      <h4 className="name font-medium text-start flex items-center gap-2">
        {d.name}
        {d.isOnline && <OnlinePulse />}
      </h4>
      <div className="control">
        <DeviceControl
          type={d.type as DeviceTypes}
          state={d.state}
          onUpdate={updateHandler}
        />
      </div>
      {/* <div className="switch">
        <Switch
          checked={!!d.state.power}
          onChange={togglePower}
        />
      </div> */}
    </div>
  )
}
// TODO: maybe we'd better create a device card which is only a wrapper and shows some details and then create smaller components for each device type (KEY, KEY2, KEY4, RELAY, RELAY12, etc.) so that the complexity is less. Also custom UI for each typoe of device will be done. For undefined device types or new ones, we can just show a simple UI! That's times better!
