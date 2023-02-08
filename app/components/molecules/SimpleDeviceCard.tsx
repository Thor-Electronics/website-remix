import { HTMLAttributes } from "react"
import { Device } from "~/types/Device"
import { Switch } from "../atoms/Switch"
import { OnlinePulse } from "./DetailedDeviceCard"

interface IProps extends HTMLAttributes<HTMLElement> {
  data: Device
  className?: string
}

export const SimpleDeviceCard = ({ data: d, className, ...props }: IProps) => {
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
      <div className="switch">
        <Switch
          checked={!!d.state.power}
          onClick={e => (d.state.power = !d.state.power)}
        />
      </div>
    </div>
  )
}
// TODO: maybe we'd better create a device card which is only a wrapper and shows some details and then create smaller components for each device type (KEY, KEY2, KEY4, RELAY, RELAY12, etc.) so that the complexity is less. Also custom UI for each typoe of device will be done. For undefined device types or new ones, we can just show a simple UI! That's times better!
