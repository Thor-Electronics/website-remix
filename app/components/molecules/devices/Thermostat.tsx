import { useState, type FC, type HTMLAttributes, useEffect } from "react";
import { iconContainerClassNames } from "./SolarPanel";
import { BsMoisture, BsThermometerHalf } from "react-icons/bs";
import { Slider } from "@mui/material";
import { DeviceType } from "~/types/DeviceType";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  type: DeviceType;
  state: {
    battery?: number;
    power?: 0 | 1 | number; // ON / OFF
    temperature?: number; // could be string
    targetTemperature?: number;
    minTargetTemperature?: number;
    maxTargetTemperature?: number;
    humidity?: number; // Moisture // percents or ppm or what?
  };
  updateHandler: Function;
}

export const Thermostat: FC<IProps> = ({
  className,
  state: s,
  updateHandler,
  ...props
}: IProps) => {
  const defaultState = {
    battery: 34,
    power: 1, // ON
    temperature: 25,
    targetTemperature: 23,
    minTargetTemperature: 14,
    maxTargetTemperature: 32,
    humidity: 4, // percents or ppm?
  };
  if (!s) s = defaultState;
  const [state, setState] = useState<IProps["state"]>(s);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);

  const handleUpdate = (e: Event, value: number) => {
    if (!handleUpdate)
      return console.warn("Update handler is not configured for this key!");
    setState((prev) => ({ ...prev, targetTemperature: value }));
    updateHandler({
      command: {
        targetTemperature: value,
      },
    });
    setIsWaiting(true);
  };

  const minTemp = state.minTargetTemperature ?? 14;
  const maxTemp = state.maxTargetTemperature ?? 32;

  useEffect(() => setIsWaiting(false), [s]);

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
            value={state.targetTemperature}
            disabled={isWaiting}
            getAriaValueText={(v) => `${v}℃`}
            valueLabelDisplay="auto"
            step={1}
            marks={[
              { value: minTemp, label: `${minTemp}℃` },
              { value: maxTemp, label: `${maxTemp}℃` },
            ]}
            min={minTemp}
            max={maxTemp}
            onChangeCommitted={handleUpdate}
            // onChange={handleUpdate}
            // showLabel
          />
        )}
      </div>
    </div>
  );
};

export default Thermostat;
