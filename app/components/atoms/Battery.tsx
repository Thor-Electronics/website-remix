import { Battery100Icon } from "@heroicons/react/24/solid";
import type { FC, HTMLAttributes } from "react";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  charge: number;
  charging?: boolean;
  voltage?: number;
  health?: string;
}

export const Battery: FC<IProps> = ({
  charge,
  charging,
  voltage,
  health,
  className,
  ...props
}: IProps) => {
  return (
    <div
      className={`Battery`}
      title={`${charge}% ${voltage}v (${health})`}
      {...props}
    >
      <Battery100Icon className="w-6 h-6" />
    </div>
  );
};

export default Battery;
