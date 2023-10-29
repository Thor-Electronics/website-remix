import { Slider } from "@mui/material";
import type { FC, HTMLAttributes } from "react";

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
      className={`Fan flex flex-col items-center justify-center gap-2
      w-60`}
    >
      <div className="battery">Battery: {state.battery}%</div>
      {/* todo: Sliders could be horizontal */}
      <div className="fan w-full">
        Fan Icon:
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
      <div className="heat w-full">
        Heat Icon:
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
  );
};

export const SliderMarks = [
  { value: 0, label: "OFF" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "MAX" },
];

export default Fan;
