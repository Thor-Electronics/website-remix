import { LoaderFunction, json, LinksFunction } from "@remix-run/node"
import { Link, Outlet, useLoaderData } from "@remix-run/react"
import { Copyright } from "~/components/atoms/Copyright"
import { LogoutButton } from "~/components/atoms/LogoutButton"
import { DashboardNav } from "~/components/organisms/DashboardNav"
import { requireUser, User } from "~/models/session.server"
import dashboardStyles from "~/styles/dashboard.css"
// import styles from "~/styles/root.css"

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
      <DashboardNav user={user} />
      <ul className="nav flex flex-row items-center justify-center gap-2">
        <Link
          to="buildings"
          className="item card"
          title="Manage your buildings and devices"
        >
          Buildings
        </Link>
        <Link to="settings" className="item card">
          Settings
        </Link>
      </ul>
      <Outlet />
      <Copyright />
    </div>
  )
}

export default Dashboard
