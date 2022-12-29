import { Link } from "@remix-run/react"
import { HTMLAttributes, ReactNode } from "react"

export type NavItems = {
  icon: ReactNode
  label: ReactNode
  to: string
  onClick?: Function
}

interface IProps extends HTMLAttributes<HTMLElement> {
  heroTitle?: ReactNode // since we are extending HTMLAttributes, non-string types of title interferes with HTML title attribute
  items: NavItems[]
}

export const SuperAdminNav = ({ heroTitle, items, ...props }: IProps) => {
  return (
    <nav className="SuperAdminNav bg-white rounded-xl p-3 shadow-lg absolute bottom-2">
      <div className="hero-title hidden">{heroTitle ?? "SUPER ADMIN"}</div>
      <ul className="items flex items-center gap-2 overflow-x-auto">
        {/* <li className="fake-space-to-fix-css-scroll-bug sm:hidden p-6"></li>
        <li className="fake-space-to-fix-css-scroll-bug sm:hidden p-6"></li>
        <solution>NO NEED TO USE THESE FAKE STUFF, I JUST REMOVED JUSTIFY-CNETER SO THAT THE PROBLEM WAS FIXED</solution> */}
        {items.map(i => (
          <Link to={i.to} key={i.to}>
            <li className="item flex flex-col items-center justify-center bg-blue-50 rounded-lg p-2 text-blue-500 shadow-sm">
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

export default SuperAdminNav
