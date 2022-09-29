import React, { MouseEvent, ReactNode } from "react"

export interface Device {
  id: string
  cpuId: string
  name: string
  buildingId: string
  type: string
  state: object
}

export enum DeviceTypes {
  KEY = "KEY",
  LOCK = "LOCK",
  BELL = "BELL",
}

export type DeviceAction = {
  title: string
  className?: string
  icon: string | ReactNode
  callback: (e: MouseEvent) => any // click event or what?
}

export const commonActions: { [key: string]: DeviceAction } = {
  powerAction: {
    title: "Power",
    className: "!bg-slate-700 hover:bg-slate-800",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-7 h-7"
      >
        <path
          fillRule="evenodd"
          d="M12 2.25a.75.75 0 01.75.75v9a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM6.166 5.106a.75.75 0 010 1.06 8.25 8.25 0 1011.668 0 .75.75 0 111.06-1.06c3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788a.75.75 0 011.06 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
    callback: () => console.log("Device power state changed"),
  },
  restartAction: {
    title: "Restart",
    className: "!bg-sky-400 hover:bg-sky-500 shadow-sky-200",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-7 h-7"
      >
        <path
          fillRule="evenodd"
          d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z"
          clipRule="evenodd"
        />
      </svg>
    ),
    callback: () => console.log("Device restarted"),
  },
}

export const deviceActions: { [key: string]: DeviceAction[] } = {
  [DeviceTypes.KEY]: [commonActions.powerAction, commonActions.restartAction],
  [DeviceTypes.BELL]: [
    commonActions.powerAction,
    commonActions.restartAction,
    {
      title: "Buzz",
      icon: "VIBRATION ICON",
      callback: () => console.log("Buzz signal sent to bell"),
    },
  ],
}
