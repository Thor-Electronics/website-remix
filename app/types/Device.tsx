import {
  ArrowPathIcon,
  BellAlertIcon,
  PowerIcon,
} from "@heroicons/react/24/solid"
import type { ReactNode } from "react"
import type { CommandMessage, Message } from "./Message"

export interface Device {
  id: string
  cpuId: string
  name: string
  groupId: string
  type: DeviceTypes
  state: DeviceState
  isOnline?: boolean // could be connected timestamp to calculate uptime
  uptime?: Date
  latency?: number
  token?: {
    deviceId: string
    code: string
  }
  createdAt?: Date // todo: they are actually strings!
  updatedAt?: Date // todo: they are actually strings!
  verifiedAt?: Date // todo: they are actually strings!
  activatedAt?: Date // todo: they are actually strings!
}

export type DeviceState = {
  [x: string]: string | number | boolean | object | undefined
  power?: number | boolean | { [x: string]: number | boolean }
  // volume?: number // TV, Radio, Speaker
  // channel?: number // TV, Radio
  // [key: string]: object
}

export enum DeviceTypes {
  KEY = "KEY",
  KEY1 = "KEY1",
  KEY2 = "KEY2",
  KEY3 = "KEY3",
  KEY4 = "KEY4",
  LOCK = "LOCK",
  BELL = "BELL",
  TV = "TV",
  LIGHT = "LIGHT",
  IRHUB = "IRHUB",
  BLINDS = "BLINDS",
  DOOR = "DOOR",
}

export type DeviceActionCallbackReturnType =
  | Pick<Message, "update">
  | string
  | void

export type LegacyDeviceAction = {
  title: string
  className?: string
  icon: string | ReactNode
  callback: () => DeviceActionCallbackReturnType // generate new state or return action type or do something and return nothing
}

// A device action can be a button which controls an action in the
// device control panel
export type DeviceAction = ReactNode

// Sends update requests to the server(helps with)
export type DeviceStateUpdateSender = (msg: Message) => boolean

export type DeviceControlPanelStateUpdateHandler = (
  cmd: CommandMessage
) => boolean

// Generates the message to be sent through StateUpdateSender
export type DeviceStateUpdater = () => Message

// Generates a new updater for the given action?
export type DeviceStateUpdaterGenerator = () => DeviceStateUpdater

// Generates device actions for the device to be used in the device control
export type DeviceActionGenerator = (
  id: string,
  type: DeviceTypes,
  state: DeviceState,
  onUpdate: Function
) => ReactNode

// Genertes device actions for
export type DeviceStateEntryActionGenerator = (
  id: string,
  key: string,
  value: any,
  onUpdate: Function
) => DeviceAction

export type DeviceControlProps = {
  type: DeviceTypes
  state: DeviceState
  onUpdate: DeviceControlPanelStateUpdateHandler
}

const cn = "w-7 h-7"

export const commonActions: { [key: string]: LegacyDeviceAction } = {
  powerAction: {
    title: "Power",
    className: "!bg-slate-700 hover:bg-slate-800",
    icon: <PowerIcon className={cn} />,
    callback: () => "TOGGLE_POWER",
  },
  restartAction: {
    title: "Restart",
    className: "!bg-sky-400 hover:bg-sky-500 shadow-sky-200",
    icon: <ArrowPathIcon className={cn} />,
    callback: () => "RESTART",
  },
}

export const deviceActions: { [key: string]: LegacyDeviceAction[] } = {
  [DeviceTypes.KEY]: [commonActions.powerAction, commonActions.restartAction],
  [DeviceTypes.KEY1]: [commonActions.powerAction, commonActions.restartAction],
  [DeviceTypes.KEY2]: [commonActions.powerAction, commonActions.restartAction],
  [DeviceTypes.KEY3]: [commonActions.powerAction, commonActions.restartAction],
  [DeviceTypes.KEY4]: [commonActions.powerAction, commonActions.restartAction],
  [DeviceTypes.BELL]: [
    commonActions.powerAction,
    commonActions.restartAction,
    {
      title: "Buzz",
      icon: <BellAlertIcon className={cn} />,
      callback: () => "BUZZ",
    },
  ],
  [DeviceTypes.TV]: [
    commonActions.powerAction,
    commonActions.restartAction,
    {
      title: "Volume Up",
      icon: "V+",
      callback: () => "VOLUME_UP",
    },
    {
      title: "Volume Down",
      icon: "V-",
      callback: () => "VOLUME_DOWN",
    },
    {
      title: "Channel Up",
      icon: "Ch+",
      callback: () => "CHANNEL_UP",
    },
    {
      title: "Channel Down",
      icon: "Ch-",
      callback: () => "CHANNEL_DOWN",
    },
  ],
  [DeviceTypes.LIGHT]: [
    commonActions.powerAction,
    commonActions.restartAction,
    {
      title: "Set Color",
      icon: "ß",
      callback: () => "SET_COLOR",
    },
  ],
  [DeviceTypes.IRHUB]: [commonActions.powerAction, commonActions.restartAction],
  [DeviceTypes.LOCK]: [commonActions.powerAction, commonActions.restartAction],
  [DeviceTypes.DOOR]: [commonActions.powerAction, commonActions.restartAction],
  [DeviceTypes.BLINDS]: [
    commonActions.powerAction,
    commonActions.restartAction,
  ],
}
