import { useState, type FC, type HTMLAttributes, useEffect } from "react";
import { iconContainerClassNames } from "./SolarPanel";
import { BsMoisture, BsThermometerHalf } from "react-icons/bs";
import { DeviceType } from "~/types/DeviceType";
// import { CurvedSlider } from "~/components/atoms/CurvedSlider";
import CircularSlider from "@fseehawer/react-circular-slider";
import { useDebouncedState } from "~/utils/hooks/useDebouncedState";
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
  state: passedState,
  updateHandler,
  ...props
}: IProps) => {
  const defaultState = {
    battery: 83,
    power: 1, // ON
    temperature: 25,
    targetTemperature: 23,
    minTargetTemperature: 14,
    maxTargetTemperature: 32,
    humidity: 4, // percents or ppm?
  };
  const initialState = { ...defaultState, ...passedState };
  const [state, setState] = useState<IProps["state"]>(initialState);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [debouncedState, setDebouncedState] = useDebouncedState(
    initialState,
    500
  );
  const [isFirstTime, setIsFirstTime] = useState<boolean>(true);

  // console.log("STATE: ", passedState.temperature, state.temperature);

  const handleUpdate = (value: number) => {
    console.log(`UPDATING: `, value);
    setState((prev) => ({ ...prev, targetTemperature: value }));
    setDebouncedState({ ...state, targetTemperature: value });
  };

  const minTemp = state.minTargetTemperature ?? 14;
  const maxTemp = state.maxTargetTemperature ?? 32;

  useEffect(() => {
    console.log("Resetting isWaiting flag...");
    setIsWaiting(false);
  }, [passedState]);

  useEffect(() => {
    console.log("Debounced State has been effected: ", debouncedState, state);

    if (isFirstTime) {
      setIsFirstTime(false);
      return console.log("It's the first time!");
    }

    // if (debouncedState === state) return console.log("States are identical!");

    if (!updateHandler)
      return console.warn(
        "Update handler is not configured for this thermostat!"
      );

    updateHandler({
      command: debouncedState,
    });
    setIsWaiting(true);
  }, [debouncedState]);

  return (
    <div className={`Thermostat mt-3 ${className}`} {...props}>
      <div className="stats flex items-center justify-evenly">
        {/* {state.battery && (
        <span className="battery">Battery: {state.battery}</span>
      )} */}
        {state.temperature && (
          <span
            className={`temperature text-xl ${iconContainerClassNames} gap-3`}
          >
            <BsThermometerHalf className={`w-8 h-8`} />
            {passedState.temperature}℃
          </span>
        )}
        {passedState.humidity && (
          <span className={`humidity text-xl ${iconContainerClassNames} gap-3`}>
            <BsMoisture className={`w-8 h-8`} />
            {passedState.humidity}%
          </span>
        )}
      </div>
      <div className="slider-container mt-4 mx-auto flex justify-center">
        {state.targetTemperature && (
          // <div>NOTHING!</div>
          // https://github.com/akx/react-curved-input/blob/master/src/components/Demo.tsx
          // <CurvedSlider
          //   path="M 50,100 A 50,50 0 1,1 100,50"
          //   onChange={handleUpdate}
          //   className="text-gray-800 dark:text-gray-200"
          // />
          <CircularSlider
            width={200}
            direction={1} // Clockwise
            min={minTemp}
            max={maxTemp}
            // initialValue={state.targetTemperature}
            knobColor="#3b82f6"
            progressColorFrom="#38bdf8"
            progressColorTo="#1d4ed8"
            trackColor="#cbd5e1"
            trackSize={8}
            data={[...Array(maxTemp - minTemp).keys()].map((i) => i + minTemp)} // Data array from 10 to 30
            dataIndex={state.targetTemperature - minTemp} // Initial knob position
            label="℃"
            onChange={handleUpdate}
          />
          // <CurvedSlider />
        )}
      </div>
    </div>
  );
};

export default Thermostat;
