import { useState, type FC, type HTMLAttributes, useEffect } from "react";
import { iconContainerClassNames } from "./SolarPanel";
import { BsMoisture, BsThermometerHalf } from "react-icons/bs";
import { DeviceType } from "~/types/DeviceType";
// import { CurvedSlider } from "~/components/atoms/CurvedSlider";
// import CircularSlider from "@fseehawer/react-circular-slider";
// import CurvedSlider from "react-curved-input";

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
    console.log(`UPDATING: `, value);
    if (!handleUpdate)
      return console.warn("Update handler is not configured for this key!");
    setState(prev => ({ ...prev, targetTemperature: value }));
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
          <div>NOTHING!</div>
          // https://github.com/akx/react-curved-input/blob/master/src/components/Demo.tsx
          // <CurvedSlider
          //   path="M 50,100 A 50,50 0 1,1 100,50"
          //   onChange={handleUpdate}
          //   className="text-gray-800 dark:text-gray-200"
          // />
          // <CircularSlider
          //   // width={280}
          //   direction={1} // Clockwise
          //   min={minTemp}
          //   max={maxTemp}
          //   initialValue={state.targetTemperature}
          //   knobColor="#3b82f6"
          //   progressColorFrom="#38bdf8"
          //   progressColorTo="#1d4ed8"
          //   trackColor="#cbd5e1"
          //   trackSize={8}
          //   // data={[...Array(21).keys()].map(i => i + 10)} // Data array from 10 to 30
          //   dataIndex={10} // Initial knob position
          //   label="℃"
          //   onChange={value => handleUpdate(new MouseEvent("idk"), value)}
          //   // onChangeCommitted={}
          // />
          // <CurvedSlider />
          // <Slider
          //   value={state.targetTemperature}
          //   disabled={isWaiting}
          //   getAriaValueText={(v) => `${v}℃`}
          //   valueLabelDisplay="auto"
          //   step={1}
          //   marks={[
          //     { value: minTemp, label: `${minTemp}℃` },
          //     { value: maxTemp, label: `${maxTemp}℃` },
          //   ]}
          //   min={minTemp}
          //   max={maxTemp}
          //   onChangeCommitted={handleUpdate}
          //   // onChange={handleUpdate}
          //   // showLabel
          // />
        )}
      </div>
    </div>
  );
};

export default Thermostat;
