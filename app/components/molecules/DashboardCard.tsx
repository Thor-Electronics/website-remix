import type { HTMLAttributes, ReactNode } from "react";

interface IProps extends HTMLAttributes<HTMLElement> {
  icon: ReactNode;
  heroTitle: ReactNode;
}

export const DashboardCard = ({
  icon,
  heroTitle,
  children,
  className,
  ...props
}: IProps) => {
  return (
    <div
      className={`DashboardCard p-2 sm:p-4 md:p-6 bg-white
        dark:bg-slate-700 shadow-lg rounded-2xl flex-grow flex
        flex-col gap-1 sm:gap-2 md:gap-3 ${className}`}
      {...props}
    >
      {/* Could be a separate component */}
      <div className="head flex gap-1">
        <div className="icon w-8 h-8">{icon}</div>
        <h4 className="title text-xl">{heroTitle}</h4>
      </div>
      {children}
      {/* <div className="content">Some Text or Numbers</div>
      <div className="description">
        Optional longer description which is so cool!
      </div> */}
    </div>
  );
};

export default DashboardCard;
