import {
  BanknotesIcon,
  CreditCardIcon,
  CubeTransparentIcon,
  QrCodeIcon,
  ShieldCheckIcon,
  StopIcon,
  UsersIcon,
} from "@heroicons/react/24/solid"
import { LinksFunction } from "@remix-run/node"
import { Outlet } from "@remix-run/react"
import { Copyright } from "~/components/atoms/Copyright"
import { LogoIcon } from "~/components/atoms/LogoIcon"
import SuperAdminNav, { NavItems } from "~/components/organisms/SuperAdminNav"
import superAdminStyles from "~/styles/super-admin.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: superAdminStyles },
]

const prefix = "/super-admin"
const iconClassNames = "w-8 h-8"
const navItems: NavItems[] = [
  {
    icon: <LogoIcon className={iconClassNames} />,
    label: "Dashboard",
    to: `${prefix}/`,
  },
  {
    icon: <UsersIcon className={iconClassNames} />,
    label: "Users",
    to: `${prefix}/users`,
  },
  {
    icon: <ShieldCheckIcon className={iconClassNames} />,
    label: "Admins",
    to: `${prefix}/admins`,
  },
  {
    icon: <CubeTransparentIcon className={iconClassNames} />, // ArrowPathIcon
    label: "OTA Updates",
    to: `${prefix}/ota-updates`,
  },
  {
    icon: <QrCodeIcon className={iconClassNames} />, // FingerPrintIcon,BanknotesIcon
    label: "Tokens", // subscriptions?
    to: `${prefix}/tokens`,
  },
  {
    icon: <BanknotesIcon className={iconClassNames} />,
    label: "Plans",
    to: `${prefix}/plans`,
  },
  {
    icon: <CreditCardIcon className={iconClassNames} />,
    label: "Invoices",
    to: `${prefix}/invoices`,
  },
]

export const SuperAdmin = () => {
  return (
    <div className="SuperAdmin bg-slate-200 h-screen p-2 relative">
      <SuperAdminNav
        heroTitle={
          <>
            <LogoIcon />
            <h1 className="font-bold italic">Thor Super Admin</h1>
          </>
        }
        items={navItems}
      />
      <Outlet />
      <Copyright />
    </div>
  )
}

export default SuperAdmin
