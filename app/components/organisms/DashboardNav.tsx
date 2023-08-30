import type { User } from "~/types/User";
import { DashboardUserProfile } from "../molecules/DashboardUserProfile";
import { Logo } from "../atoms/Logo";
import FixedNav, { type FixedNavItem } from "./FixedNav";
import type { HTMLAttributes, ReactNode } from "react";

interface IProps extends HTMLAttributes<HTMLElement> {
  user: User;
  items: FixedNavItem[];
  footer?: ReactNode;
}

export const DashboardNav = ({ user, items, ...props }: IProps) => {
  return (
    <FixedNav
      header={
        <div className="hidden xl:flex xl:flex-col">
          <Logo />
          <DashboardUserProfile user={user} />
        </div>
      }
      items={items}
      className={`DashboardNav ${props.className}`}
      darkModeToggle
      {...props}
    />
  );
};
