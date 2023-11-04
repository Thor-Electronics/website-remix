import { Slider } from "@mui/material";
import type { FC, HTMLAttributes } from "react";
import { iconClassNames } from "./SolarPanel";
import { FaFan } from "react-icons/fa6";
import { GiHotSurface } from "react-icons/gi";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  state: { battery: number; power: number; heat: number };
}

export const Fan: FC<IProps> = ({ className, ...props }: IProps) => {
  const state = {
    battery: 64,
    power: 2, // 0 | 1 | 2 | 3
    heat: 1, // 0 | 1 | 2 | 3
  };

  return (
    <div
      className={`Fan flex flex-col items-stretch justify-center gap-2
      w-60 ${className}`}
      {...props}
    >
      {/* <div className="battery">Battery: {state.battery}%</div> */}
      {/* todo: Sliders could be horizontal */}
      <div className="fan flex flex-row items-start justify-start gap-6">
        <FaFan className={iconClassNames} />
        <div className="slider-container flex-grow pr-2">
          {/* todo: smaller slider label font size */}
          <Slider
            defaultValue={state.power}
            getAriaValueText={(v) => `${v}℃`}
            valueLabelDisplay="auto"
            step={1}
            marks={SliderMarks}
            min={0}
            max={3}
          />
        </div>
      </div>
      <div className="heat flex flex-row items-start justify-start gap-6">
        <GiHotSurface className={iconClassNames} />
        <div className="slider-container flex-grow pr-2">
          {/* todo: smaller slider label font size */}
          <Slider
            defaultValue={state.heat}
            getAriaValueText={(v) => `${v}℃`}
            valueLabelDisplay="auto"
            step={1}
            marks={SliderMarks}
            min={0}
            max={3}
          />
        </div>
      </div>
    </div>
  );
};

export const SliderMarks = [
  { value: 0, label: "OFF" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "MAX" },
];

export default Fan;
