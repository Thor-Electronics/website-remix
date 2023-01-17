import {
  BanknotesIcon,
  CreditCardIcon,
  CubeTransparentIcon,
  QrCodeIcon,
  ShieldCheckIcon,
  StopIcon,
  UsersIcon,
} from "@heroicons/react/24/solid"
import { json, LinksFunction, LoaderFunction, Response } from "@remix-run/node"
import { Link, Outlet, useCatch, useLoaderData } from "@remix-run/react"
import { Copyright } from "~/components/atoms/Copyright"
import { LogoIcon } from "~/components/atoms/LogoIcon"
import AdminNav, { NavItem } from "~/components/organisms/AdminNav"
import {
  ACCESS,
  PERMISSION_CONTEXT,
  type User,
  type Permission,
} from "~/types/User"
import adminStyles from "~/styles/admin.css"
import { requireUser } from "~/models/session.server"

type LoaderData = {
  user: User
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: adminStyles },
]

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request)
  if (!user.groups)
    throw new Response("access denied", {
      status: 403,
      statusText: "Forbidden",
    })
  return json<LoaderData>({ user })
}

const prefix = "/admin"
const iconClassNames = "w-8 h-8"
const initialNavItems: NavItem[] = [
  {
    icon: <LogoIcon className={iconClassNames} />,
    label: "Dashboard",
    to: `${prefix}/`,
  },
  {
    icon: <UsersIcon className={iconClassNames} />,
    label: "Users",
    to: `${prefix}/users`,
    permission: { context: PERMISSION_CONTEXT.USERS, access: ACCESS.VIEW },
  },
  {
    icon: <ShieldCheckIcon className={iconClassNames} />,
    label: "Admins",
    to: `${prefix}/admins`,
    permission: { context: PERMISSION_CONTEXT.ADMINS, access: ACCESS.VIEW },
  },
  {
    icon: <CubeTransparentIcon className={iconClassNames} />, // ArrowPathIcon
    label: "OTA Updates",
    to: `${prefix}/ota-updates`,
    permission: {
      context: PERMISSION_CONTEXT.FIRMWARE_UPDATE,
      access: ACCESS.VIEW,
    },
  },
  {
    icon: <QrCodeIcon className={iconClassNames} />, // FingerPrintIcon,BanknotesIcon
    label: "Tokens", // subscriptions?
    to: `${prefix}/tokens`,
    permission: { context: PERMISSION_CONTEXT.TOKENS, access: ACCESS.VIEW },
  },
  {
    icon: <BanknotesIcon className={iconClassNames} />,
    label: "Plans",
    to: `${prefix}/plans`,
    permission: { context: PERMISSION_CONTEXT.ADMINS, access: ACCESS.VIEW },
  },
  {
    icon: <CreditCardIcon className={iconClassNames} />,
    label: "Invoices",
    to: `${prefix}/invoices`,
    permission: { context: PERMISSION_CONTEXT.PAYMENTS, access: ACCESS.VIEW },
  },
] // FIXME: add buildings and devices and other stuff and complete the list

export const generateNavItemsBasedOnUserPermission = (
  permissions: Permission[]
): NavItem[] => {
  return initialNavItems.map(i => {
    if (!i.permission) return i
    let isAllowed = false
    const allow = () => (isAllowed = true)
    permissions.forEach(p =>
      p.context === i.permission?.context ? allow() : null
    )
    return isAllowed ? i : ({} as NavItem)
  })
}

export const Admin = () => {
  const { user } = useLoaderData<LoaderData>()
  // console.log("Permissions: ", user.groups?.at(0)?.permissions)

  const userNavItems: NavItem[] = generateNavItemsBasedOnUserPermission(
    user.groups!.at(0)!.permissions
  )

  return (
    <div className="Admin bg-slate-200 h-screen p-2 relative pb-20 sm:bp-2 sm:pt-28 xl:pt-2 xl:pl-36">
      <AdminNav
        heroTitle={
          <>
            <LogoIcon />
            <h1 className="font-bold italic">Thor Super Admin</h1>
          </>
        }
        items={userNavItems}
      />
      <Outlet />
      <Copyright />
    </div>
  )
}

export const CatchBoundary = () => {
  const caught = useCatch()
  return (
    <div className="caught h-screen bg-rose-200 text-rose-600 flex flex-col gap-6 items-center justify-center text-center">
      <LogoIcon className="w-32" />
      <h2 className="status flex items-center justify-center gap-2 text-3xl font-bold">
        <span className="code">{caught.status}</span>|
        <span className="text">{caught.statusText}</span>
      </h2>
      <div className="error text-3xl font-bold uppercase">{caught.data}</div>
      {/* <p className="description">There was an error handling your request</p> */}
      <Link to="/" className="font-semibold !underline" prefetch="render">
        Back to home
      </Link>
    </div>
  )
}

export default Admin
