import type { FC, HTMLAttributes } from "react";
import { iconClassNames, iconContainerClassNames } from "./SolarPanel";
import { BsMoisture, BsThermometerHalf } from "react-icons/bs";
import { Slider } from "@mui/material";

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
    temperature: 25,
    targetTemperature: 23,
    minTargetTemperature: 14,
    maxTargetTemperature: 32,
    humidity: 4, // percents or ppm?
  };

  const minTemp = state.minTargetTemperature ?? 14;
  const maxTemp = state.maxTargetTemperature ?? 32;

  return (
    <div className={`Thermostat ${className}`} {...props}>
      <div className="stats flex items-center justify-evenly">
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
      <div className="slider-container">
        {state.targetTemperature && (
          <Slider
            defaultValue={state.targetTemperature}
            getAriaValueText={(v) => `${v}℃`}
            valueLabelDisplay="auto"
            step={1}
            marks={[
              { value: minTemp, label: `${minTemp}℃` },
              { value: maxTemp, label: `${maxTemp}℃` },
            ]}
            min={minTemp}
            max={maxTemp}
            // showLabel
          />
        )}
      </div>
    </div>
  );
};

export default Thermostat;
