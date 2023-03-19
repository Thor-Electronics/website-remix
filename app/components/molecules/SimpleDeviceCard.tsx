import type { HTMLAttributes } from "react"
import type {
  Device,
  DeviceControlPanelStateUpdateHandler,
  DeviceStateUpdateSender,
  DeviceTypes,
} from "~/types/Device"
import { OnlinePulse } from "./DetailedDeviceCard"
import KeyControl from "./KeyControl"
import TVControl from "./TVControl"

interface IProps extends HTMLAttributes<HTMLElement> {
  data: Device
  onUpdate?: DeviceStateUpdateSender
}

export const SimpleDeviceCard = ({
  data: d,
  className,
  onUpdate: updateHandler,
  ...props
}: IProps) => {
  const handleControlUpdate: DeviceControlPanelStateUpdateHandler = cmd => {
    if (!updateHandler) return false
    // Attach ID to the command before sending it to the server
    return updateHandler({ ...cmd, id: d.id })
  }

  const ControlPanel = DeviceControlPanels[d.type]

  return (
    <div
      className={`SimpleDeviceCard bg-white border rounded-lg p-2 flex justify-between ${
        d.isOnline ? "border-green-500" : "border-slate-300"
      }`}
      {...props}
    >
      <h4 className="name font-medium text-start flex items-center gap-2">
        {d.name}
        {d.isOnline && <OnlinePulse />}
      </h4>
      <ControlPanel
        type={d.type}
        state={d.state}
        onUpdate={handleControlUpdate}
      />
      {d.isOnline && (
        <div className="latency text-xs">Ping: {d.latency ?? 0}ms</div>
      )}
    </div>
  )
}

export const DeviceControlPanels: Record<DeviceTypes, Function> = {
  KEY: KeyControl,
  KEY1: KeyControl,
  KEY2: KeyControl,
  KEY3: KeyControl,
  KEY4: KeyControl,
  LOCK: () => "LOCK CONTROL",
  BELL: () => "BELL CONTROL",
  TV: TVControl,
  LIGHT: () => "LIGHT CONTROL",
  IRHUB: () => "IR_HUB CONTROL",
  BLINDS: () => "BLINDS CONTROL",
  DOOR: () => "DOOR CONTROL",
}
