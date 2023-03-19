import {
  BoltIcon,
  CpuChipIcon,
  HashtagIcon,
  WifiIcon,
  CircleStackIcon,
  PowerIcon,
  TvIcon,
  SpeakerWaveIcon,
  SwatchIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid"
import { MdWifi, MdWifiOff } from "react-icons/md"
import type { MouseEvent } from "react"
import type { Device, DeviceActionCallbackReturnType } from "~/types/Device"
import { DeviceState, DeviceTypes } from "~/types/Device"
import { deviceActions } from "~/types/Device"
import { IconButton } from "../atoms/Button"
import OnlinePulse from "../atoms/Pulse"

type Props = {
  data: Device
  updateHandler: Function
}

export const DetailedDeviceCard = ({
  data,
  updateHandler,
  ...props
}: Props) => {
  return (
    <div className="DeviceCard card" {...props}>
      <div className="device-icon">
        {getDeviceIcon(
          data.type,
          `w-12 h-12 ${data.state?.power ? "text-emerald-500" : ""}`
        )}
      </div>
      <div
        className="device-name row font-medium gap-1 text-base"
        title={`Name: ${data.name}`}
      >
        {data.name}
        {data.isOnline && <OnlinePulse />}
      </div>
      <div className="device-body flex flex-col gap-2 text-xs">
        <div className="device-id font-mono row" title="Device ID">
          <HashtagIcon className="w-6 h-6" />
          {data.id}
        </div>
        <div className="device-cpu-id row" title="CPU ID">
          <CpuChipIcon className="w-6 h-6" />
          {data.cpuId}
        </div>
        <div className="device-type row" title="Device Type">
          <InformationCircleIcon className="w-6 h-6" />
          {data.type}
        </div>
        <div className="online row">
          {data.isOnline ? (
            <>
              <MdWifi className="w-6 h-6 text-emerald-500" />
              <span className="OnlinePulse py-0.5 px-2 text-xs font-medium text-white bg-emerald-500 rounded-full">
                Online
              </span>
            </>
          ) : (
            <>
              <MdWifiOff className="w-6 h-6" />
              <span
                className="py-0.5 px-2 text-xs font-medium text-white bg-slate-500 rounded-full"
                title="When the device is offline, server can't send updates but keeps them and let the device know when connected to the network"
              >
                Offline
              </span>
            </>
          )}
        </div>
      </div>
      <div className="device-actions flex flex-col gap-2">
        {deviceActions[data.type].map(action => (
          <IconButton
            key={action.title}
            // onClick={handleClick(action.callback)}
            className={action.className}
          >
            {action.icon}
          </IconButton>
        ))}
      </div>
      <div className="device-state" title="Current State Data">
        {Object.entries(data.state).map(([k, v]) => (
          <DeviceStateUI key={k} k={k} v={v} />
        ))}
      </div>
    </div>
  )
}

export const DeviceStateUI = ({
  k,
  v,
  ...props
}: {
  k: string
  v: string | number | boolean | object
}) => (
  <div className="state-key-value row">
    <div className="icon">{getStateIcon(k, v)}</div>
    <div className="key">{k}:</div>
    <div className="value">
      {typeof v !== "object"
        ? v
        : Object.entries(v).map(([k, v]) => (
            <DeviceStateUI key={k} k={k} v={v} />
          ))}
    </div>
  </div>
)

export const getStateIcon = (key: string, value: any) => {
  const cn = "w-6 h-6"
  let icon = <CircleStackIcon className="w-6 h-6" />
  switch (key) {
    case "power":
      icon =
        value === "on" ? (
          <PowerIcon className="w-6 h-6 text-green-600" />
        ) : (
          <PowerIcon className="w-6 h-6 text-slate-600" />
        )
      break
    case "volume":
      icon = <SpeakerWaveIcon className={cn} />
      break
    case "color":
      icon = (
        <SwatchIcon className={`${cn} drop-shadow`} style={{ color: value }} />
      )
      break
  }
  return icon
}

export const getDeviceIcon = (t: DeviceTypes | string, className?: string) => {
  const cn = `w-6 h-6 ${className}`
  let icon = <BoltIcon className={cn} />
  switch (t) {
    case DeviceTypes.TV:
      icon = <TvIcon className={cn} />
  }
  return icon
}

export default DetailedDeviceCard
