import { Link } from "@remix-run/react"
import { HTMLAttributes, ReactNode } from "react"
import { type Permission } from "~/types/User"

export type NavItem = {
  icon: ReactNode
  label: ReactNode
  to: string
  permission?: Permission
  onClick?: Function
}

interface IProps extends HTMLAttributes<HTMLElement> {
  heroTitle?: ReactNode // since we are extending HTMLAttributes, non-string types of title interferes with HTML title attribute
  items: NavItem[]
}

export const AdminNav = ({ heroTitle, items, className, ...props }: IProps) => {
  return (
    <nav
      className={`AdminNav bg-white rounded-xl p-2 shadow-lg fixed bottom-2 sm:bottom-auto sm:top-2 w-full xl:w-32 xl:left-2 xl:bottom-2 ${props.className}`}
      {...props}
    >
      <div className="hero-title hidden">{heroTitle ?? "SUPER ADMIN"}</div>
      <ul className="items flex items-center gap-2 overflow-x-auto xl:overflow-x-hidden xl:overflow-y-auto xl:flex-col xl:items-stretch">
        {/* <li className="fake-space-to-fix-css-scroll-bug sm:hidden p-6"></li>
        <li className="fake-space-to-fix-css-scroll-bug sm:hidden p-6"></li>
        <solution>NO NEED TO USE THESE FAKE STUFF, I JUST REMOVED JUSTIFY-CNETER SO THAT THE PROBLEM WAS FIXED</solution> */}
        {items.map(i => (
          <Link
            to={i.to}
            key={i.to}
            className="sm:grow xl:grow-0"
            prefetch="intent"
          >
            <li className="item flex flex-col items-center justify-center bg-sky-100 rounded-lg p-2 text-blue-500">
              <span className="icon">{i.icon}</span>
              <span className="label text-xs font-semibold hidden sm:block">
                {i.label}
              </span>
            </li>
          </Link>
        ))}
      </ul>
    </nav>
  )
}

export default AdminNav
