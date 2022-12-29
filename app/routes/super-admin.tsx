import {
  BanknotesIcon,
  CreditCardIcon,
  CubeTransparentIcon,
  QrCodeIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "@heroicons/react/24/solid"
import { Outlet } from "@remix-run/react"
import { Copyright } from "~/components/atoms/Copyright"
import { LogoIcon } from "~/components/atoms/LogoIcon"
import SuperAdminNav, { NavItems } from "~/components/organisms/SuperAdminNav"

const PREFIX = "/super-admin"
const iconClassNames = "w-8 h-8"
const navItems: NavItems[] = [
  {
    icon: <LogoIcon className={iconClassNames} />,
    label: "Dashboard",
    to: `${PREFIX}/`,
  },
  {
    icon: <UsersIcon className={iconClassNames} />,
    label: "Users",
    to: `${PREFIX}/users`,
  },
  {
    icon: <ShieldCheckIcon className={iconClassNames} />,
    label: "Admins",
    to: `${PREFIX}/admins`,
  },
  {
    icon: <CubeTransparentIcon className={iconClassNames} />, // ArrowPathIcon
    label: "OTA Updates",
    to: `${PREFIX}/ota-updates`,
  },
  {
    icon: <QrCodeIcon className={iconClassNames} />, // FingerPrintIcon,BanknotesIcon
    label: "Tokens", // subscriptions?
    to: `${PREFIX}/tokens`,
  },
  {
    icon: <BanknotesIcon className={iconClassNames} />,
    label: "Plans",
    to: `${PREFIX}/plans`,
  },
  {
    icon: <CreditCardIcon className={iconClassNames} />,
    label: "Invoices",
    to: `${PREFIX}/invoices`,
  },
]

export const SuperAdmin = () => {
  return (
    <div className="SuperAdmin bg-slate-200 h-screen p-2">
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
