import { useState } from "react";
import type { FC, HTMLAttributes, ReactNode } from "react";
import type {
  Device,
  DeviceControlPanelStateUpdateHandler,
  DeviceStateUpdateSender,
} from "~/types/Device";
import { OnlinePulse } from "../atoms/Pulse";
import KeyControl from "./KeyControl";
import RelayControl from "./RelayControl";
import TVControl from "./TVControl";
import { EllipsisVerticalIcon, CpuChipIcon } from "@heroicons/react/24/solid";
import { DeviceType } from "~/types/DeviceType";
import SimpleDeviceCardOptionsMenu from "./SimpleDeviceCardOptionsMenu";
import { IconButton } from "@mui/material";
import SolarPanel from "./devices/SolarPanel";
import { Battery as DeviceBattery } from "../atoms/Battery";
import Battery from "./devices/Battery";
import Fan from "./devices/Fan";
import Thermostat from "./devices/Thermostat";
import { IoMdSwitch } from "react-icons/io";
import { MdSolarPower } from "react-icons/md";
import { GiElectricalSocket, GiTheaterCurtains } from "react-icons/gi";
import { HiLightBulb, HiServer } from "react-icons/hi";
import { HiBellAlert, HiLockClosed } from "react-icons/hi2";
import { BsDoorOpenFill, BsMoisture, BsThermometerHalf } from "react-icons/bs";
import { LuBlinds } from "react-icons/lu";
import { SiVirtualbox } from "react-icons/si";
import { TfiSignal } from "react-icons/tfi";
import { GrTest } from "react-icons/gr";
import { FaCarBattery } from "react-icons/fa6";
import { PiFanFill } from "react-icons/pi";

export interface ISimpleDeviceCardProps extends HTMLAttributes<HTMLElement> {
  data: Device;
  onUpdate?: DeviceStateUpdateSender;
}

export const SimpleDeviceCard = ({
  data: d,
  className,
  onUpdate: updateHandler,
  ...props
}: ISimpleDeviceCardProps) => {
  const handleControlUpdate: DeviceControlPanelStateUpdateHandler = cmd => {
    if (!updateHandler) return false;
    // Attach ID to the command before sending it to the server
    return updateHandler({ ...cmd, id: d.id });
  };

  const details = deviceDetails[d.type];
  const ControlPanel = details.controller;

  if (d.latency) d.latency = Math.floor(d.latency / 20);

  /* Options Menu */
  const [optionsMenuAnchorEl, setOptionsMenuAnchorEl] =
    useState<null | HTMLElement>(null);
  const optionsMenuOpen = Boolean(optionsMenuAnchorEl);
  const handleOptionsClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setOptionsMenuAnchorEl(event.currentTarget);
  const handleCloseOptionsMenu = () => setOptionsMenuAnchorEl(null);

  // d.isOnline = true;
  // d.latency = 23;

  return (
    <div
      className={`SimpleDeviceCard ${d.isOnline ? "online" : ""} ${
        d.activatedAt ? "" : "inactive"
      }`}
      {...props}
    >
      <div className="head">
        <div className="start">
          <div className="icon">{details.icon}</div>
          <h4 className="name font-medium text-start flex items-center gap-2">
            {d.name}
            {d.isOnline && <OnlinePulse />}
          </h4>
        </div>
        <div className="end">
          {/* if device has battery */}
          <DeviceBattery charge={78} />
        </div>
      </div>

      <div className="controller-container flex-grow">
        <ControlPanel
          type={d.type}
          state={d.state}
          onUpdate={handleControlUpdate}
        />
      </div>

      <div className="details //auto-hide">
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
            ~{d.latency ?? "?"}ms
          </span>
        )}

        {d.token && (
          <code
            className="token"
            title="Use this code to connect the device to this group"
          >
            {/* cursor pointer copy on click material component? */}
            {d.token.code}
          </code>
        )}

        {/* {d.token && (
          <div className="activation">
            Use the code <code>{d.token?.code}</code> to activate the device
          </div>
        )} */}

        <div className="options">
          <IconButton onClick={handleOptionsClick} style={{ margin: -8 }}>
            <EllipsisVerticalIcon className="w-5" />
          </IconButton>
          <SimpleDeviceCardOptionsMenu
            anchorEl={optionsMenuAnchorEl}
            open={optionsMenuOpen}
            onClose={handleCloseOptionsMenu}
            deviceId={d.id}
          />
        </div>
      </div>
    </div>
  );
};

// Device Formats? Device Info? Device Controls?
export type DeviceDetails = {
  icon: ReactNode;
  controller: FC<any>;
};
export const deviceDetails: Record<DeviceType, DeviceDetails> = {
  [DeviceType.General]: {
    controller: () => "GENERAL DEVICE",
    icon: <CpuChipIcon />,
  },
  [DeviceType.Core]: {
    controller: () => "CORE PROCESSOR(THOR)",
    icon: <CpuChipIcon />,
  },
  [DeviceType.Key]: { controller: KeyControl, icon: <IoMdSwitch /> },
  [DeviceType.Key1]: { controller: KeyControl, icon: <IoMdSwitch /> },
  [DeviceType.Key2]: { controller: KeyControl, icon: <IoMdSwitch /> },
  [DeviceType.Key3]: { controller: KeyControl, icon: <IoMdSwitch /> },
  [DeviceType.Key4]: { controller: KeyControl, icon: <IoMdSwitch /> },
  [DeviceType.Relay]: { controller: RelayControl, icon: <IoMdSwitch /> },
  [DeviceType.Relay8]: { controller: RelayControl, icon: <IoMdSwitch /> },
  [DeviceType.Relay12]: { controller: RelayControl, icon: <IoMdSwitch /> },
  [DeviceType.Plug]: {
    controller: () => "PLUG / WALL PLUG/ POWER SOCKET",
    icon: <GiElectricalSocket />,
  },
  [DeviceType.Light]: {
    controller: () => "LIGHT CONTROL",
    icon: <HiLightBulb />,
  },
  [DeviceType.Bell]: {
    controller: () => "BELL CONTROL",
    icon: <HiBellAlert />,
  },
  [DeviceType.Lock]: {
    controller: () => "LOCK CONTROL",
    icon: <HiLockClosed />,
  },
  [DeviceType.Door]: {
    controller: () => "DOOR CONTROL",
    icon: <BsDoorOpenFill />,
  },
  [DeviceType.TV]: { controller: TVControl, icon: <CpuChipIcon /> },
  [DeviceType.Blinds]: {
    controller: () => "BLINDS CONTROL",
    icon: <LuBlinds />,
  },
  [DeviceType.Curtain]: {
    controller: () => "CURTAIN CONTROL",
    icon: <GiTheaterCurtains />,
  },
  [DeviceType.Thermostat]: {
    controller: Thermostat,
    icon: <BsThermometerHalf />, // BsMoisture
  },
  [DeviceType.IRHub]: {
    controller: () => "HUB_IR CONTROL",
    icon: <SiVirtualbox />,
  },
  [DeviceType.RFHub]: {
    controller: () => "HUB_RF CONTROL",
    icon: <TfiSignal />,
  },
  [DeviceType.LocalHub]: {
    controller: () => "HUB_LOCAL CONTROL",
    icon: <HiServer />, // TbServerBolt
  },
  [DeviceType.Dev]: {
    controller: () => "DEVELOPMENT DEVICE",
    icon: <GrTest />,
  },
  [DeviceType.ECU]: {
    controller: () => "VEHICLE CONTROL",
    icon: <CpuChipIcon />,
  },
  [DeviceType.SolarPanel]: { controller: SolarPanel, icon: <MdSolarPower /> },
  [DeviceType.Battery]: { controller: Battery, icon: <FaCarBattery /> },
  [DeviceType.Fan]: { controller: Fan, icon: <PiFanFill /> },
};
