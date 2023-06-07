import {
  ArrowRightOnRectangleIcon,
  BanknotesIcon,
  BuildingOffice2Icon,
  CpuChipIcon,
  CreditCardIcon,
  CubeTransparentIcon,
  HomeModernIcon,
  MapIcon,
  QrCodeIcon,
  RectangleGroupIcon,
  ShieldCheckIcon,
  SignalIcon,
  StopIcon,
  UsersIcon,
} from "@heroicons/react/24/solid"
import type { LinksFunction, LoaderFunction } from "@remix-run/node"
import { json, Response } from "@remix-run/node"
import {
  Link,
  Outlet,
  useCatch,
  useLoaderData,
  useRouteError,
} from "@remix-run/react"
import { Copyright } from "~/components/atoms/Copyright"
import { LogoIcon } from "~/components/atoms/LogoIcon"
import type { FixedNavItem } from "~/components/organisms/FixedNav"
import FixedNav from "~/components/organisms/FixedNav"
import {
  ACCESS,
  PERMISSION_CONTEXT,
  type User,
  type Permission,
} from "~/types/User"
import adminStyles from "~/styles/admin.css"
import { requireUser } from "~/models/session.server"
import type { V2_ErrorBoundaryComponent } from "@remix-run/react/dist/routeModules"

type LoaderData = {
  user: User
}

export const loader: LoaderFunction = async ({ request }) => {
  const user: User = await requireUser(request)
  if (!user.roles)
    throw new Response("access denied", {
      status: 403,
      statusText: "Forbidden",
    })
  return json<LoaderData>({ user })
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: adminStyles },
]

export const generateNavItemsBasedOnUserPermission = (
  permissions: Permission[]
): FixedNavItem[] => {
  return initialAdminNavItems.map(i => {
    if (!i.permission) return i
    let isAllowed = false
    const allow = () => (isAllowed = true)
    permissions.forEach(p =>
      p.context === i.permission?.context ? allow() : null
    )
    return isAllowed ? i : ({} as FixedNavItem)
  })
}

export const Admin = () => {
  const { user } = useLoaderData<LoaderData>()
  // console.log("Permissions: ", user.groups?.at(0)?.permissions)

  const userNavItems: FixedNavItem[] = generateNavItemsBasedOnUserPermission(
    user.roles!.at(0)!.permissions
  )

  return (
    <div className="Admin bg-slate-200 min-h-screen p-2 relative pb-20 sm:bp-2 sm:pt-28 xl:pt-2 xl:pl-36">
      <FixedNav items={userNavItems} />
      <Outlet />
      <Copyright />
    </div>
  )
}

export const ErrorBoundary: V2_ErrorBoundaryComponent = () => {
  const error = useRouteError()
  console.log("panel.tsx ERROR: ", error)

  return (
    <div className="error h-screen bg-rose-200 text-rose-600 flex flex-col gap-6 items-center justify-center text-center">
      <LogoIcon className="w-32" />
      <h2 className="status flex items-center justify-center gap-2 text-3xl font-bold">
        <span className="code">{error.status}</span>|
        <span className="text">{error.statusText}</span>
      </h2>
      <div className="error text-3xl font-bold uppercase">{error.data}</div>
      {/* <p className="description">There was an error handling your request</p> */}
      <Link to="/" className="font-semibold !underline" prefetch="render">
        Back to home
      </Link>
    </div>
  )
}

export const PANEL_PREFIX = "/panel"
const iconClassNames = "w-8 h-8"
const initialAdminNavItems: FixedNavItem[] = [
  {
    icon: <LogoIcon className={iconClassNames} />,
    label: "Overview",
    to: `${PANEL_PREFIX}/`,
  },
  {
    icon: <UsersIcon className={iconClassNames} />,
    label: "Users",
    to: `${PANEL_PREFIX}/users`,
    permission: { context: PERMISSION_CONTEXT.USERS, access: ACCESS.VIEW },
  },
  {
    icon: <ShieldCheckIcon className={iconClassNames} />,
    label: "Access Management", // manufacturers
    to: `${PANEL_PREFIX}/access-management`,
    permission: { context: PERMISSION_CONTEXT.ACCESS, access: ACCESS.VIEW },
  },
  {
    icon: <BuildingOffice2Icon className={iconClassNames} />,
    label: "Groups",
    to: `${PANEL_PREFIX}/groups`,
    permission: { context: PERMISSION_CONTEXT.GROUPS, access: ACCESS.VIEW },
  },
  {
    icon: <CpuChipIcon className={iconClassNames} />,
    label: "Devices",
    to: `${PANEL_PREFIX}/devices`,
    permission: { context: PERMISSION_CONTEXT.DEVICES, access: ACCESS.VIEW },
  },
  {
    icon: <MapIcon className={iconClassNames} />,
    label: "Areas",
    to: `${PANEL_PREFIX}/areas`,
    permission: { context: PERMISSION_CONTEXT.AREAS, access: ACCESS.VIEW },
  },
  {
    icon: <CubeTransparentIcon className={iconClassNames} />, // ArrowPathIcon
    label: "OTA Updates",
    to: `${PANEL_PREFIX}/ota-updates`,
    permission: {
      context: PERMISSION_CONTEXT.FIRMWARE_UPDATE,
      access: ACCESS.VIEW,
    },
  },
  {
    icon: <QrCodeIcon className={iconClassNames} />, // FingerPrintIcon,BanknotesIcon
    label: "Tokens", // subscriptions?
    to: `${PANEL_PREFIX}/tokens`,
    permission: { context: PERMISSION_CONTEXT.TOKENS, access: ACCESS.VIEW },
  },
  {
    icon: <BanknotesIcon className={iconClassNames} />,
    label: "Plans",
    to: `${PANEL_PREFIX}/plans`,
    permission: { context: PERMISSION_CONTEXT.ACCESS, access: ACCESS.VIEW },
  },
  {
    icon: <CreditCardIcon className={iconClassNames} />,
    label: "Invoices",
    to: `${PANEL_PREFIX}/invoices`,
    permission: { context: PERMISSION_CONTEXT.PAYMENTS, access: ACCESS.VIEW },
  },
  {
    icon: <SignalIcon className={iconClassNames} />,
    label: "Network",
    to: `${PANEL_PREFIX}/network`,
    permission: { context: PERMISSION_CONTEXT.NETWORK, access: ACCESS.VIEW },
  },
  {
    icon: <RectangleGroupIcon className={iconClassNames} />,
    label: "Dashboard",
    to: `/app`,
  },
  {
    icon: <ArrowRightOnRectangleIcon className={iconClassNames} />,
    label: "Logout",
    to: `/logout`,
    props: {
      className: "!bg-rose-100 !text-rose-500",
    },
  },
]

export default Admin
