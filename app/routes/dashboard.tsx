import {
  Cog6ToothIcon,
  BuildingOffice2Icon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid"
import { LoaderFunction, json, LinksFunction } from "@remix-run/node"
import { Outlet, useLoaderData } from "@remix-run/react"
import { Copyright } from "~/components/atoms/Copyright"
import { LogoIcon } from "~/components/atoms/LogoIcon"
import { FixedNavItem } from "~/components/organisms/FixedNav"
import { DashboardNav } from "~/components/organisms/DashboardNav"
import { requireUser } from "~/models/session.server"
import dashboardStyles from "~/styles/dashboard.css"
import type { User } from "~/types/User"

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
    <div className="Dashboard">
      <DashboardNav user={user as User} items={initialUserNavItems} />
      <Outlet />
      <Copyright />
    </div>
  )
}

const prefix = "/dashboard"
const iconClassNames = "w-8 h-8"
const initialUserNavItems: FixedNavItem[] = [
  {
    icon: <LogoIcon className={iconClassNames} />,
    label: "Dashboard",
    to: `${prefix}/`,
  },
  {
    icon: <BuildingOffice2Icon className={iconClassNames} />,
    label: "Buildings",
    to: `${prefix}/buildings`,
  },
  {
    icon: <Cog6ToothIcon className={iconClassNames} />,
    label: "Settings",
    to: `${prefix}/settings`,
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
