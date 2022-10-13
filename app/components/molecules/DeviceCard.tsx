import {
  BoltIcon,
  CpuChipIcon,
  HashtagIcon,
  WifiIcon,
} from "@heroicons/react/24/solid"
import type { Device, DeviceAction } from "~/types/Device"
import { deviceActions } from "~/types/Device"
import type { Message } from "~/types/Message"
import { IconButton } from "../atoms/Button"

type Props = {
  data: Device
  link?: string
  updateHandler: Function
}

export const DeviceCard = ({ data, link = data.id, updateHandler, ...props }: Props) => {
  const handleClick = (callback: string) => {
    const handlers = {
      "TOGGLE_POWER": (): Pick<Message, "update"> => ({
        update: { power: data.state.power === "on" ? "off" : "on" },
        // FIXME: how about if power is 0 or 1 or true or false, we
        // need an standard for it I think numbers are really good
        // to represent the device state because we can also represent
        // the intensity and sleep states.Like:
        // power< 0 -> off, power == 0 -> sleep / standby,
        // power > 0 -> the power level of the device which means it
        // is on and how much power will this work on.
      }),
    }
    if (typeof ReturnType<typeof callback> === "string") return updateHandler(handlers[callback], data.id)
  }

  return (
    // <Link to={link}>
    <div className="DeviceCard card" {...props}>
      <div className="device-iocn">
        <BoltIcon className="w-12 h-12" />
      </div>
      <div
        className="device-name row font-medium gap-1 text-base"
        title={`Name: ${data.name}`}
      >
        {data.name}
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
          <WifiIcon className="w-6 h-6" />
          {data.type}
        </div>
      </div>
      <div className="device-actions flex flex-col gap-2">
        {deviceActions[data.type].map(action => (
          <IconButton
            key={action.title}
            onClick={handleClick(action.callback)}
            // TODO: I could define a function that checks if the callback is string, then use one of those built-in funcitons like turn on or off and if it's a callable function, then reutrn itself so that on click calls it otherwise the builting function will be passed to on click and would be handeled by the component because builtin functions are inside the component
            className={action.className}
          >
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
            {/* TODO: Value needs to be nested so we need a recursive function :) */}
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
