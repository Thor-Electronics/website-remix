import { useState, type HTMLAttributes } from "react";
import type {
  Device,
  DeviceControlPanelStateUpdateHandler,
  DeviceStateUpdateSender,
} from "~/types/Device";
import { OnlinePulse } from "../atoms/Pulse";
import KeyControl from "./KeyControl";
import TVControl from "./TVControl";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import type { DeviceType } from "~/types/DeviceType";
import SimpleDeviceCardOptionsMenu from "./SimpleDeviceCardOptionsMenu";
import { IconButton } from "@mui/material";

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
  const handleControlUpdate: DeviceControlPanelStateUpdateHandler = (cmd) => {
    if (!updateHandler) return false;
    // Attach ID to the command before sending it to the server
    return updateHandler({ ...cmd, id: d.id });
  };

  const ControlPanel = DeviceControlPanels[d.type];

  if (d.latency) d.latency = Math.floor(d.latency / 20);

  /* Options Menu */
  const [optionsMenuAnchorEl, setOptionsMenuAnchorEl] =
    useState<null | HTMLElement>(null);
  const optionsMenuOpen = Boolean(optionsMenuAnchorEl);
  const handleOptionsClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setOptionsMenuAnchorEl(event.currentTarget);
  const handleCloseOptionsMenu = () => setOptionsMenuAnchorEl(null);

  return (
    <div
      className={`SimpleDeviceCard ${d.isOnline ? "online" : ""} ${
        d.activatedAt ? "" : "inactive"
      }`}
      {...props}
    >
      <div className="head">
        <h4 className="name font-medium text-start flex items-center gap-2">
          {d.name}
          {d.isOnline && <OnlinePulse />}
          {d.token && (
            <code title="Use this code to connect the device to this group">
              {/* cursor pointer copy on click material component? */}
              {d.token.code}
            </code>
          )}
          <div className="options">
            <IconButton onClick={handleOptionsClick}>
              <EllipsisVerticalIcon className="w-5" />
            </IconButton>
            <SimpleDeviceCardOptionsMenu
              anchorEl={optionsMenuAnchorEl}
              open={optionsMenuOpen}
              onClose={handleCloseOptionsMenu}
              deviceId={d.id}
            />
          </div>
        </h4>
        <ControlPanel
          type={d.type}
          state={d.state}
          onUpdate={handleControlUpdate}
        />
      </div>
      <div className="details">
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
          <div className="activation">
            Use the code <code>{d.token?.code}</code> to activate the device
          </div>
        )}
      </div>
    </div>
  );
};

export const DeviceControlPanels: Record<DeviceType, Function> = {
  GENERAL: () => "GENERAL DEVICE",
  CORE: () => "CORE PROCESSOR(THOR)",
  KEY: KeyControl,
  KEY1: KeyControl,
  KEY2: KeyControl,
  KEY3: KeyControl,
  KEY4: KeyControl,
  RELAY: () => "GENERAL RELAY",
  RELAY8: () => "RELAY CARD(8)",
  RELAY12: () => "RELAY CARD(12)",
  PLUG: () => "PLUG / WALL PLUG/ POWER SOCKET",
  LIGHT: () => "LIGHT CONTROL",
  BELL: () => "BELL CONTROL",
  LOCK: () => "LOCK CONTROL",
  DOOR: () => "DOOR CONTROL",
  TV: TVControl,
  BLINDS: () => "BLINDS CONTROL",
  CURTAIN: () => "CURTAIN CONTROL",
  THERMOSTAT: () => "THERMOSTAT CONTROL",
  HUB_IR: () => "HUB_IR CONTROL",
  HUB_RF: () => "HUB_RF CONTROL",
  HUB_LOCAL: () => "HUB_LOCAL CONTROL",
  DEV: () => "DEVELOPMENT DEVICE",
  ECU: () => "VEHICLE CONTROL",
};
