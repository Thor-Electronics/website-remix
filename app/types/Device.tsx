import {
  ArrowPathIcon,
  BellAlertIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import type { ReactNode } from "react";
import type { CommandMessage, Message } from "./Message";
import { parseDeviceToken, type DeviceToken } from "./DeviceToken";
import { DeviceType } from "./DeviceType";
import type { DeviceChip } from "./DeviceChip";

export interface Device {
  id: string;
  cpuId: string;
  name: string;
  userId: string;
  groupId?: string;
  type: DeviceType;
  chip: DeviceChip;
  state: DeviceState;
  manufacturerId?: string;
  isOnline?: boolean; // could be connected timestamp to calculate uptime
  uptime?: Date;
  latency?: number;
  token?: DeviceToken;
  created_at?: Date;
  updated_at?: Date;
  verifiedAt?: Date;
  activatedAt?: Date;
}

export const parseDevice = (d: any): Device => {
  if ([d.id, d.cpuId, d.name, d.type].some((v) => v === undefined)) {
    throw new Error("Invalid input to parse device");
  }
  return {
    ...d,
    token: d.token && parseDeviceToken(d.token),
    created_at: new Date(d.created_at),
    updated_at: new Date(d.updated_at),
    verifiedAt: new Date(d.verifiedAt),
    activatedAt: new Date(d.activatedAt),
  };
};

export type DeviceState = {
  [x: string]: string | number | boolean | object | undefined;
  power?: number | boolean | { [x: string]: number | boolean };
  // volume?: number // TV, Radio, Speaker
  // channel?: number // TV, Radio
  // [key: string]: object
};

export type DeviceActionCallbackReturnType =
  | Pick<Message, "update">
  | string
  | void;

export type LegacyDeviceAction = {
  title: string;
  className?: string;
  icon: string | ReactNode;
  callback: () => DeviceActionCallbackReturnType; // generate new state or return action type or do something and return nothing
};

// A device action can be a button which controls an action in the
// device control panel
export type DeviceAction = ReactNode;

// Sends update requests to the server(helps with)
export type DeviceStateUpdateSender = (msg: Message) => boolean;

export type DeviceControlPanelStateUpdateHandler = (
  cmd: CommandMessage
) => boolean;

// Generates the message to be sent through StateUpdateSender
export type DeviceStateUpdater = () => Message;

// Generates a new updater for the given action?
export type DeviceStateUpdaterGenerator = () => DeviceStateUpdater;

// Generates device actions for the device to be used in the device control
export type DeviceActionGenerator = (
  id: string,
  type: DeviceType,
  state: DeviceState,
  onUpdate: Function
) => ReactNode;

// Genertes device actions for
export type DeviceStateEntryActionGenerator = (
  id: string,
  key: string,
  value: any,
  onUpdate: Function
) => DeviceAction;

export type DeviceControlProps = {
  type: DeviceType;
  state: DeviceState;
  onUpdate: DeviceControlPanelStateUpdateHandler;
};

const cn = "w-7 h-7";

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
};

export const deviceActions: { [key: string]: LegacyDeviceAction[] } = {
  [DeviceType.KEY]: [commonActions.powerAction, commonActions.restartAction],
  [DeviceType.KEY1]: [commonActions.powerAction, commonActions.restartAction],
  [DeviceType.KEY2]: [commonActions.powerAction, commonActions.restartAction],
  [DeviceType.KEY3]: [commonActions.powerAction, commonActions.restartAction],
  [DeviceType.KEY4]: [commonActions.powerAction, commonActions.restartAction],
  [DeviceType.BELL]: [
    commonActions.powerAction,
    commonActions.restartAction,
    {
      title: "Buzz",
      icon: <BellAlertIcon className={cn} />,
      callback: () => "BUZZ",
    },
  ],
  [DeviceType.TV]: [
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
  [DeviceType.LIGHT]: [
    commonActions.powerAction,
    commonActions.restartAction,
    {
      title: "Set Color",
      icon: "ß",
      callback: () => "SET_COLOR",
    },
  ],
  [DeviceType.IRHUB]: [commonActions.powerAction, commonActions.restartAction],
  [DeviceType.LOCK]: [commonActions.powerAction, commonActions.restartAction],
  [DeviceType.DOOR]: [commonActions.powerAction, commonActions.restartAction],
  [DeviceType.BLINDS]: [commonActions.powerAction, commonActions.restartAction],
};
