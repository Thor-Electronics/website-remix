import {
  BoltIcon,
  CpuChipIcon,
  HashtagIcon,
  WifiIcon,
} from "@heroicons/react/24/solid"
import { Device, deviceActions } from "~/types/Device"
import { IconButton } from "../atoms/Button"

type Props = {
  data: Device
}

export const DeviceCard = ({ data, ...props }: Props) => {
  return (
    <div className="DeviceCard" {...props}>
      <div className="device-iocn">
        <BoltIcon className="w-6 h-6" />
      </div>
      <div className="device-name row" title={`Name: ${data.name}`}>
        {data.name}
      </div>
      <div className="device-body">
        <div className="device-id row" title="Device ID">
          <HashtagIcon className="w-6 h-6" />
          {data.id}
        </div>
        <div className="device-cpu-id row" title="CPU ID">
          <CpuChipIcon className="w-6 h-6" />
          {data.cpuId}
        </div>
        <div className="device-type row" title="Device Type">
          <WifiIcon className="w-6 h-6" />
          {data.type}
        </div>
      </div>
      <div className="device-actions flex flex-col gap-2">
        {deviceActions[data.type].map(action => (
          <IconButton key={action.title} onClick={action.callback}>
            {action.icon}
          </IconButton>
        ))}
      </div>
      <div className="device-state" title="Current State Data">
        {Object.entries(data.state).map(([k, v]) => (
          <div key={k} className="state-key-value row">
            <div className="icon">{getStateIcon(k, v)}</div>
            <div className="key">{k}</div>
            <div className="value">{v}</div>
            {/* Value needs to be nested so we need a recursive function :) */}
          </div>
        ))}
      </div>
    </div>
  )
}

export const getStateIcon = (key: string, value: any) => {
  let icon = "Default State Icon = Data or something like a db idk"
  switch (key) {
    case "power":
      icon = value === "on" ? "POWER OFF ICON" : "POWER ON ICON"

    default:
      break
  }
  return icon
}

export default DeviceCard
