import {
  ArrowPathIcon,
  BellAlertIcon,
  PowerIcon,
} from "@heroicons/react/24/solid"
import type { ReactNode } from "react"
import type { Message } from "./Message"

export interface Device {
  id: string
  cpuId: string
  name: string
  buildingId: string
  type: string
  state: DeviceState
  isOnline?: boolean // could be connected timestamp to calculate uptime
  uptime?: Date
}

export type DeviceState = {
  [x: string]: string | number | boolean | object
  power: number | { [x: string]: number }
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

export type DeviceAction = {
  title: string
  className?: string
  icon: string | ReactNode
  callback: () => DeviceActionCallbackReturnType // generate new state or return action type or do something and return nothing
}

// Sends update requests to the server(helps with)
export type StateUpdateHandler = (msg: Message) => boolean

// Generates the message to be sent through StateUpdateHandler
export type DeviceStateUpdater = () => Message

const cn = "w-7 h-7"

export const commonActions: { [key: string]: DeviceAction } = {
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

export const deviceActions: { [key: string]: DeviceAction[] } = {
  [DeviceTypes.KEY]: [commonActions.powerAction, commonActions.restartAction],
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
