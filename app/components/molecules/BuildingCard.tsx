import type { Building } from "~/types/Building"
import DetailedDeviceCard, { OnlinePulse } from "./DetailedDeviceCard"
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

export interface Props extends HTMLAttributes<HTMLElement> {
  data: Building
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

export const BuildingCard = ({
  data: b,
  socketToken,
  className,
  ...props
}: Props) => {
  const [building, setBuilding] = useState<Building>(b)
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
        if (msg.update) {
          setBuilding(prev => ({
            ...prev,
            devices: prev.devices?.map(d =>
              d.id === msg.id
                ? { ...d, state: { ...d.state, ...msg.update } }
                : d
            ),
          }))
        }
        if (msg.signal) {
          console.log("📡 Signal: ", msg.signal)
          if (!msg.payload) console.warn("Signal with empty payload!")
          if (msg.signal === Signal.USER_INITIAL_DATA) {
            setBuilding(prev => ({
              ...prev,
              devices: prev.devices?.map(d =>
                msg.payload?.onlineDevices?.includes(d.id)
                  ? { ...d, isOnline: true }
                  : d
              ),
            }))
          }
          if (msg.signal === Signal.REFRESH_LATENCIES) {
            if (!msg.payload) return
            if (msg.payload.devices) {
              setBuilding(prev => ({
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

  const buildingActionIconClassNames = "w-5 h-5 sm:w-4 sm:h-4"

  return (
    <div
      className={`BuildingCard relative card transition-all duration-700 ${
        connected
          ? "!shadow-emerald-200 border border-emerald-500 border-b-[16px]"
          : ""
      } ${className}`}
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
        <span>{building.name}</span>
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
        {building.devices && (
          <div className="devices">
            {building.devices?.map(d => (
              <SimpleDeviceCard key={d.id} data={d} onUpdate={handleUpdate} />
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
          {building.address}
        </div>
        <div className="id font-mono text-slate-600 hover:text-emerald-600 row">
          <HashtagIcon className="w-6 h-6" />
          {building.id}
        </div>
        <div className="device-count row">
          <CpuChipIcon className="w-6 h-6" />
          {building.devices?.length || 0} Devices
        </div>
        <div className="plugin-count row">
          {/* <SquaresPlusIcon className="w-6 h-6" /> */}
          <PuzzlePieceIcon className="w-6 h-6" />
          {building.plugins?.length || 0} Plugins
        </div>
        <div className="options flex flex-row gap-2 justify-end items-center text-base">
          <Button
            className="p-2 rounded-xl sm:rounded-lg sm:px-3 sm:py-1
                 !bg-emerald-500 shadow-emerald-300 sm:shadow-emerald-200"
            title="Add New Device to the Building"
          >
            <SquaresPlusIcon className={buildingActionIconClassNames} />
            <span className="text hidden sm:block">Add Device</span>
          </Button>

          <Button
            className="p-2 rounded-xl sm:rounded-lg sm:px-3 sm:py-1
                 !bg-blue-500 shadow-blue-300 sm:shadow-blue-200"
            title="Edit the Building"
          >
            <PencilIcon className={buildingActionIconClassNames} />
            <span className="text hidden sm:block">Edit Building</span>
          </Button>

          <Button
            className="p-2 rounded-xl sm:rounded-lg sm:px-3 sm:py-1
                 !bg-red-500 shadow-red-300 sm:shadow-red-200"
            title="Disable the Building"
          >
            <TrashIcon className={buildingActionIconClassNames} />
            <span className="text hidden sm:block">Disable Building</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
