import type { Group } from "~/types/Group"
import { OnlinePulse } from "../atoms/Pulse"
import {
  CpuChipIcon,
  HashtagIcon,
  HomeModernIcon,
  MapPinIcon,
  PencilIcon,
  PuzzlePieceIcon,
  SquaresPlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid"
import Button from "../atoms/Button"
import type { HTMLAttributes } from "react"
import { useState } from "react"
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket"
import type { Message } from "~/types/Message"
import { Signal } from "~/types/Message"
import { ReadyState } from "react-use-websocket"
import { SimpleDeviceCard } from "./SimpleDeviceCard"
import { Link } from "@remix-run/react"
import { DASHBOARD_PREFIX } from "~/routes/app"
import { parseDevice, type DeviceState } from "~/types/Device"

export interface Props extends HTMLAttributes<HTMLElement> {
  data: Group
  // updateHandler: Function
  socketToken: string
  // connected?: number
}

export const WS_STATUS_BADGES = {
  [ReadyState.CONNECTING]: {
    text: "Connecting",
    className: "bg-orange-500 shadow-orange-300",
  },
  [ReadyState.OPEN]: {
    text: "Connected",
    className: "bg-green-500 shadow-green-300",
  },
  [ReadyState.CLOSING]: {
    text: "Disconnecting",
    className: "bg-rose-500 shadow-rose-300",
  },
  [ReadyState.CLOSED]: {
    text: "Disconnected",
    className: "bg-slate-800 shadow-slate-300",
  },
  [ReadyState.UNINSTANTIATED]: {
    text: "Uninstantiated",
    className: "bg-red-500",
  },
}

export const GroupCard = ({
  data: b,
  socketToken,
  className,
  ...props
}: Props) => {
  const [group, setGroup] = useState<Group>(b)
  const { sendJsonMessage, sendMessage, readyState } = useWebSocket(
    `${process.env.NODE_ENV === "production" ? "wss" : "ws"}://${
      ENV.CORE_ADDR
    }/api/v1/control/manage/${b.id}`,
    {
      onOpen: e => {
        console.log("WS Connected: ", e)
        const authSignal: Message = {
          signal: Signal.AUTHENTICATE_CLIENT,
          payload: {
            token: socketToken,
          },
          id: "authentication message doesn't have an id",
        }
        sendMessage(JSON.stringify(authSignal))
        console.log("Sent the authentication signal with payload")
      },
      onClose: e => console.warn("WS Closed: ", e),
      onError: e => console.warn("WS ERROR: ", e),
      onMessage: e => {
        const msg = JSON.parse(e.data) as Message
        if (msg.message) console.log("🔽 MESSAGE: ", msg.message)
        if (msg.update && msg.update !== undefined) {
          setGroup(prev => ({
            ...prev,
            devices: prev.devices?.map(d =>
              d.id === msg.id
                ? {
                    ...d,
                    state: recursivelyUpdateState(
                      d.state,
                      msg.update!
                    ) as DeviceState,
                  }
                : d
            ),
          }))
        }
        if (msg.signal) {
          console.log("📡 Signal: ", msg.signal)
          if (!msg.payload) console.warn("Signal with empty payload!")

          /* Initial Data */
          if (msg.signal === Signal.USER_INITIAL_DATA) {
            setGroup(prev => ({
              ...prev,
              devices: prev.devices?.map(d =>
                msg.payload?.onlineDevices?.includes(d.id)
                  ? { ...d, isOnline: true }
                  : d
              ),
            }))
          }

          /* Device connected / disconnected */
          if (
            msg.signal === Signal.DEVICE_CONNECTED ||
            msg.signal === Signal.DEVICE_DISCONNECTED
          ) {
            setGroup(prev => ({
              ...prev,
              devices: prev.devices?.map(d =>
                d.id === msg.id
                  ? {
                      ...d,
                      isOnline:
                        msg.signal === Signal.DEVICE_CONNECTED ? true : false,
                    }
                  : d
              ),
            }))
          }

          /* Refresh Latencies */
          if (msg.signal === Signal.REFRESH_LATENCIES) {
            if (!msg.payload) return
            if (msg.payload.devices) {
              setGroup(prev => ({
                ...prev,
                devices: prev.devices?.map(d =>
                  d.id in msg.payload?.devices!
                    ? { ...d, latency: msg.payload?.devices![d.id] }
                    : d
                ),
              }))
            }
          }
        }
      },
      share: true,
      shouldReconnect: e => true,
    }
  )

  const connectionStatus = WS_STATUS_BADGES[readyState]
  const connected = readyState === ReadyState.OPEN

  const handleUpdate = (message: object): boolean => {
    console.log("Sending Update: ", message)
    sendJsonMessage(message)
    return true
  }

  const groupActionIconClassNames = "w-5 h-5 sm:w-4 sm:h-4"

  return (
    <div
      className={`GroupCard ${connected ? "online" : ""} ${className}`}
      {...props}
    >
      {connected && (
        <div className="connected absolute text-white text-xs top-full text-center w-full font-extrabold italic">
          ONLINE!
        </div>
      )}
      <div className="icon">
        <HomeModernIcon className="w-6 h-6" />
      </div>
      <div
        className={`name font-semibold flex flex-row items-center justify-start gap-2 text-lg`}
      >
        <span>{group.name}</span>
        <div className="plan-badge rounded-full shadow bg-primary text-white text-xs px-1.5">
          Pro
        </div>
        <span
          className={`status text-xs px-2 py-0.5 rounded-full text-white shadow-md ${connectionStatus.className}`}
        >
          {connectionStatus.text}
        </span>
        {connected && <OnlinePulse />}
      </div>
      <div className="body flex flex-col gap-2 text-sm">
        {group.devices && (
          <div className="devices">
            {group.devices?.map(d => (
              <SimpleDeviceCard
                key={d.id}
                data={parseDevice(d)}
                onUpdate={handleUpdate}
              />
              // <DetailedDeviceCard
              //   key={d.id}
              //   data={d}
              //   // link={`devices/${d.id}`}
              //   updateHandler={handleUpdate}
              // />
            ))}
          </div>
        )}
        <div
          className="address font-xs italic text-slate-500 row"
          title="address"
        >
          <MapPinIcon className="w-6 h-6" />
          {group.address}
        </div>
        <div className="id font-mono text-slate-600 hover:text-emerald-600 row">
          <HashtagIcon className="w-6 h-6" />
          {group.id}
        </div>
        <div className="device-count row">
          <CpuChipIcon className="w-6 h-6" />
          {group.devices?.length || 0} Devices
        </div>
        <div className="plugin-count row">
          {/* <SquaresPlusIcon className="w-6 h-6" /> */}
          <PuzzlePieceIcon className="w-6 h-6" />
          {group.plugins?.length || 0} Plugins
        </div>
        <div className="options flex flex-row gap-2 justify-end items-center text-base">
          <Link
            to={`${DASHBOARD_PREFIX}/groups/${group.id}/devices/new`}
            prefetch="render"
          >
            <Button
              className="p-2 rounded-xl sm:rounded-lg sm:px-3 sm:py-1
                 !bg-emerald-500 shadow-emerald-300 sm:shadow-emerald-200"
              title="Add New Device to the Group"
            >
              <SquaresPlusIcon className={groupActionIconClassNames} />
              <span className="text hidden sm:block">Add Device</span>
            </Button>
          </Link>

          <Button
            className="p-2 rounded-xl sm:rounded-lg sm:px-3 sm:py-1
                 !bg-blue-500 shadow-blue-300 sm:shadow-blue-200"
            title="Edit the Group"
          >
            <PencilIcon className={groupActionIconClassNames} />
            <span className="text hidden sm:block">Edit Group</span>
          </Button>

          <Link to={`${DASHBOARD_PREFIX}/groups/${group.id}/delete`}>
            <Button
              className="p-2 rounded-xl sm:rounded-lg sm:px-3 sm:py-1
                 !bg-red-500 shadow-red-300 sm:shadow-red-200"
              title="Disable the Group"
            >
              <TrashIcon className={groupActionIconClassNames} />
              <span className="text hidden sm:block">Disable Group</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export const recursivelyUpdateState = (
  src: { [key: string]: any },
  newState: object
): object => {
  const result = src
  Object.entries(newState).forEach(([k, v]) => {
    result[k] = typeof v === "object" ? recursivelyUpdateState(src[k], v) : v
  })
  return result
}
