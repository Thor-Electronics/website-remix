import type { FC, HTMLAttributes } from "react";
import { BsFillLightningChargeFill } from "react-icons/bs";
import {
  FaHeartPulse,
  FaPlugCircleBolt,
  FaPlugCircleXmark,
} from "react-icons/fa6";
import { TbCircuitVoltmeter } from "react-icons/tb";
import { iconClassNames, iconContainerClassNames } from "./SolarPanel";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  state: { charge: number; health: string; status: string };
}

export const Battery: FC<IProps> = ({ className, ...props }: IProps) => {
  const state = {
    charge: 73,
    health: "Good",
    status: "Charging",
    voltage: 4.8,
  };

  return (
    <div
      className={`Battery flex flex-col items-center justify-center
      gap-4 h-full ${className}`}
      {...props}
    >
      <div
        className="charge-container relative h-8 w-full border
        border-slate-400 rounded-md bg-slate-300 overflow-hidden
        flex items-center justify-center dark:border-slate-700
        dark:bg-slate-600"
      >
        <div
          className="charge absolute top-0 left-0 flex items-center
          justify-center bg-emerald-500 h-full transition-all
          shadow-inner shadow-emerald-400 dark:bg-emerald-600
          dark:shadow-emerald-500"
          style={{ width: `${state.charge}%` }}
        ></div>
        <span
          className="charge-label z-10 text-white font-bold text-lg
          flex flex-row items-center justify-center gap-1"
          style={{ textShadow: "0 0 4px black" }}
        >
          {state.status.toLowerCase() === "charging" && (
            <BsFillLightningChargeFill className="w-4 h-4" />
          )}
          {state.charge}%
        </span>
      </div>
      <div className="second-row flex items-center justify-center gap-2">
        <div className={`health ${iconContainerClassNames}`}>
          <FaHeartPulse className={iconClassNames} /> {state.health}
        </div>
        <div className={`status ${iconContainerClassNames}`}>
          {state.status?.toLowerCase() === "charging" ? (
            <FaPlugCircleBolt className={iconClassNames} />
          ) : (
            <FaPlugCircleXmark className={iconClassNames} />
          )}
          {state.status}
        </div>
        <div className={`voltage ${iconContainerClassNames}`}>
          <TbCircuitVoltmeter className={iconClassNames} />
          {state.voltage}v
        </div>
      </div>
    </div>
  );
};

export default Battery;
