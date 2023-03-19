import type { HTMLAttributes } from "react"
import type {
  Device,
  DeviceControlPanelStateUpdateHandler,
  DeviceStateUpdateSender,
  DeviceTypes,
} from "~/types/Device"
import { OnlinePulse } from "../atoms/Pulse"
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
      className={`SimpleDeviceCard ${d.isOnline ? "online" : ""}`}
      {...props}
    >
      <div className="head">
        <h4 className="name font-medium text-start flex items-center gap-2">
          {d.name}
          {d.isOnline && <OnlinePulse />}
        </h4>
        <ControlPanel
          type={d.type}
          state={d.state}
          onUpdate={handleControlUpdate}
        />
      </div>
      <div className="details">
        {d.isOnline && d.latency !== undefined && (
          <span
            className={`ping ${
              d.latency <= 10
                ? "perfect"
                : d.latency <= 30
                ? "great"
                : d.latency <= 70
                ? "good"
                : d.latency <= 200
                ? "weak"
                : d.latency <= 500
                ? "very-week"
                : "awful"
            }`}
            title="Ping"
          >
            {d.latency ?? "?"}ms
          </span>
        )}
      </div>
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
