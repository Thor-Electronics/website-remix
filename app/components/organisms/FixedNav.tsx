import { Link } from "@remix-run/react"
import type { HTMLAttributes, ReactNode } from "react"
import type { Permission, User } from "~/types/User"
import { Logo } from "../atoms/Logo"
import { DashboardUserProfile } from "../molecules/DashboardUserProfile"

export type FixedNavItem = {
  icon: ReactNode
  label: ReactNode
  to: string
  permission?: Permission
  onClick?: Function
  props?: HTMLAttributes<HTMLElement>
}

interface IProps extends HTMLAttributes<HTMLElement> {
  header?: ReactNode
  items: FixedNavItem[]
  footer?: ReactNode
}

export const FixedNav = ({
  header,
  footer,
  items,
  className,
  ...props
}: IProps) => {
  return (
    <nav
      className={`FixedNav bg-white rounded-xl p-2 shadow-lg fixed bottom-2 left-2 sm:bottom-auto sm:top-2 w-full xl:w-32 xl:left-2 xl:bottom-2 z-10 ${className}`}
      {...props}
    >
      <div className="header">{header}</div>

      <ul
        className={`items flex items-center gap-2 overflow-x-auto xl:overflow-x-hidden xl:overflow-y-auto xl:flex-col xl:items-stretch ${
          items.length <= 5 ? "justify-center" : "justify-start"
        }`}
      >
        {/* <li className="fake-space-to-fix-css-scroll-bug sm:hidden p-6"></li>
        <li className="fake-space-to-fix-css-scroll-bug sm:hidden p-6"></li>
        <solution>NO NEED TO USE THESE FAKE STUFF, I JUST REMOVED JUSTIFY-CNETER SO THAT THE PROBLEM WAS FIXED</solution> */}
        {items.map(i =>
          i.to ? (
            <Link
              to={i.to}
              key={i.to}
              className="sm:grow xl:grow-0"
              prefetch="intent"
            >
              <li
                className={`item flex flex-col items-center justify-center bg-sky-100 rounded-lg p-2 text-blue-500 ${i.props?.className}`}
              >
                <span className="icon">{i.icon}</span>
                <span className="item-label text-xs font-semibold hidden sm:block">
                  {i.label}
                </span>
              </li>
            </Link>
          ) : undefined
        )}
      </ul>

      <div className="footer">{footer}</div>
    </nav>
  )
}

export default FixedNav
