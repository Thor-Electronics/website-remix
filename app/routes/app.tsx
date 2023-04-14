import {
  Cog6ToothIcon,
  BuildingOffice2Icon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid"
import type { LoaderFunction, LinksFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react"
import { Copyright } from "~/components/atoms/Copyright"
import { LogoIcon } from "~/components/atoms/LogoIcon"
import type { FixedNavItem } from "~/components/organisms/FixedNav"
import { DashboardNav } from "~/components/organisms/DashboardNav"
import { requireUser } from "~/models/session.server"
import dashboardStyles from "~/styles/dashboard.css"
import type { User } from "~/types/User"
import type { V2_ErrorBoundaryComponent } from "@remix-run/react/dist/routeModules"

export const DASHBOARD_PREFIX = "/app"

type LoaderData = {
  user: User
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request)
  return json<LoaderData>({ user })
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: dashboardStyles },
]

export const Dashboard = () => {
  const { user } = useLoaderData<LoaderData>()

  return (
    <div className="Dashboard bg-slate-200 min-h-screen p-2 relative pb-20 sm:pb-2 sm:pt-28 xl:pt-2 xl:pl-36">
      <DashboardNav user={user as User} items={initialUserNavItems} />
      <Outlet />
      <Copyright />
    </div>
  )
}

export const ErrorBoundary: V2_ErrorBoundaryComponent = () => {
  const error = useRouteError()
  console.error("Error in dashboard: ", error)

  return (
    <div className="h-screen bg-rose-100 shadow-lg text-rose-600 p-4 flex items-center justify-center flex-col">
      <LogoIcon className="w-24" />
      <h1 className="text-lg font-bold mb-4">Error Loading Dashboard!</h1>
      <p className="font-lg font-semibold">
        {error.status} | {error.statusText}
      </p>
      <p className="error">
        Something happened when we tried to show your dashboard.{" "}
        {error.data?.message ?? error.data}
      </p>
      <Link
        to={DASHBOARD_PREFIX}
        className="font-semibold !underline"
        prefetch="render"
      >
        Back to the app
      </Link>
    </div>
  )
}

const iconClassNames = "w-8 h-8"
const initialUserNavItems: FixedNavItem[] = [
  {
    icon: <LogoIcon className={iconClassNames} />,
    label: "Dashboard",
    to: `${DASHBOARD_PREFIX}/`,
  },
  {
    icon: <BuildingOffice2Icon className={iconClassNames} />,
    label: "Groups",
    to: `${DASHBOARD_PREFIX}/groups`,
  },
  {
    icon: <Cog6ToothIcon className={iconClassNames} />,
    label: "Settings",
    to: `${DASHBOARD_PREFIX}/settings`,
  },
  {
    icon: <UserCircleIcon className={iconClassNames} />,
    label: "Account",
    to: `${DASHBOARD_PREFIX}/profile`,
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

export default Dashboard
