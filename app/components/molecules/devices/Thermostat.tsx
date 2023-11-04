import type { FC, HTMLAttributes } from "react";
import { iconClassNames, iconContainerClassNames } from "./SolarPanel";
import { BsMoisture, BsThermometerHalf } from "react-icons/bs";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  state: {
    battery?: number;
    power?: 0 | 1; // ON / OFF
    temperature?: number; // could be string
    humidity?: number; // Moisture // percents or ppm or what?
  };
}

export const Thermostat: FC<IProps> = ({ className, ...props }: IProps) => {
  const state = {
    battery: 34,
    power: 1, // ON
    temperature: 24,
    humidity: 4, // percents or ppm?
  };

  return (
    <div
      className={`Thermostat flex items-center justify-evenly ${className}`}
      {...props}
    >
      {/* {state.battery && (
        <span className="battery">Battery: {state.battery}</span>
      )} */}
      {state.temperature && (
        <span
          className={`temperature text-xl ${iconContainerClassNames} gap-3`}
        >
          <BsThermometerHalf className={`w-8 h-8`} />
          {state.temperature}℃
        </span>
      )}
      {state.humidity && (
        <span className={`humidity text-xl ${iconContainerClassNames} gap-3`}>
          <BsMoisture className={`w-8 h-8`} />
          {state.humidity}%
        </span>
      )}
    </div>
  );
};

export default Thermostat;
