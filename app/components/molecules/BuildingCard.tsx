import { Link } from "@remix-run/react"
import { CSSProperties } from "react"
import { Building } from "~/types/Building"
import DeviceCard from "./DeviceCard"
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
import Button, { TextButton } from "../atoms/Button"

export type Props = {
  data: Building
  link?: string
  updateHandler: Function
  connected?: number
  className?: string
  // sizes => 0: only name, 1: icon, plan, 2: id, address, 3: device count, plugins count, 4: device panel, plugin panel
}

export const BuildingCard = ({
  data,
  link = data.id,
  updateHandler,
  connected,
  className,
  ...props
}: Props) => {
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
        className={`name font-semibold flex flex-row items-center justify-start gap-1 text-lg`}
      >
        {data.name}
        <div className="plan-badge rounded-full shadow bg-primary text-white text-xs px-1.5">
          Pro
        </div>
      </div>
      <div className="body flex flex-col gap-2 text-sm">
        {data.devices && (
          <div className="devices">
            {data.devices?.map(d => (
              <DeviceCard
                key={d.id}
                data={d}
                link={`devices/${d.id}`}
                updateHandler={updateHandler}
              />
            ))}
          </div>
        )}
        <div
          className="address font-xs italic text-slate-500 row"
          title="address"
        >
          <MapPinIcon className="w-6 h-6" />
          {data.address}
        </div>
        <div className="id font-mono text-slate-600 hover:text-emerald-600 row">
          <HashtagIcon className="w-6 h-6" />
          {data.id}
        </div>
        <div className="device-count row">
          <CpuChipIcon className="w-6 h-6" />
          {data.devices?.length || 0} Devices
        </div>
        <div className="plugin-count row">
          {/* <SquaresPlusIcon className="w-6 h-6" /> */}
          <PuzzlePieceIcon className="w-6 h-6" />
          {data.plugins?.length || 0} Plugins
        </div>
        <div className="options flex flex-row gap-2 justify-end items-center text-base">
          <Button
            className="p-2 rounded-xl sm:rounded-lg sm:px-3 sm:py-1
                 bg-blue-500 shadow-blue-300 sm:shadow-blue-200"
            title="Edit the Building"
          >
            <PencilIcon className="w-5 h-5 sm:w-4 sm:h-4" />
            <span className="text hidden sm:block">Edit Building</span>
          </Button>

          <Button
            className="p-2 rounded-xl sm:rounded-lg sm:px-3 sm:py-1
                 bg-red-500 shadow-red-300 sm:shadow-red-200"
            title="Disable the Building"
          >
            <TrashIcon className="w-5 h-5 sm:w-4 sm:h-4" />
            <span className="text hidden sm:block">Disable Building</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
