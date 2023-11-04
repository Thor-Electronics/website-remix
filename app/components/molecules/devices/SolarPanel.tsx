import type { FC, HTMLAttributes } from "react";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { TbCircuitVoltmeter } from "react-icons/tb";
import { FaPowerOff } from "react-icons/fa6";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  state: { output: string; voltage: number; status: string };
}

export const iconClassNames = "w-6 h-6";
export const iconContainerClassNames = `flex flex-col items-center justify-center gap-2`;

export const SolarPanel: FC<IProps> = ({ className, ...props }: IProps) => {
  // state,
  const state = { output: "31w", voltage: 5.2, status: "ON" };

  return (
    <div
      className={`SolarPanel flex items-center justify-center gap-4
      h-full ${className}`}
      {...props}
    >
      <span className={`output ${iconContainerClassNames}`}>
        <BsFillLightningChargeFill className={iconClassNames} />
        {state.output}
      </span>
      <span className={`voltage ${iconContainerClassNames}`}>
        <TbCircuitVoltmeter className={iconClassNames} />
        {state.voltage}v
      </span>
      <span className={`status ${iconContainerClassNames}`}>
        <FaPowerOff className={iconClassNames} />
        {state.status}
      </span>
    </div>
  );
};

export default SolarPanel;
