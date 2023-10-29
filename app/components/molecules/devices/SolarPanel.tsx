import type { FC, HTMLAttributes } from "react";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  state: { output: string; voltage: number; status: string };
}

export const SolarPanel: FC<IProps> = ({ className, ...props }: IProps) => {
  // state,
  const state = { output: "31w", voltage: 5.2, status: "ON" };

  return (
    <div
      className={`SolarPanel flex items-center justify-between gap-2 ${className}`}
      {...props}
    >
      <span className="output">Output: {state.output}</span>
      <span className="voltage">Voltage: {state.output}v</span>
      <div className="status">Status: {state.status}</div>
    </div>
  );
};

export default SolarPanel;
