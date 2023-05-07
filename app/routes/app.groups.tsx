import type { ErrorBoundaryComponent, LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Outlet, useLoaderData } from "@remix-run/react"
import { DashboardGroupsList } from "~/components/organisms/DashboardGroupsList"
import { getSessionToken } from "~/models/session.server"
import type { Group } from "~/types/Group"
import { getUserGroups } from "~/utils/core.server"

type LoaderData = {
  groups: Group[]
}

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    groups: await getUserGroups(await getSessionToken(request)),
  })
}

export const DashboardGroups = () => {
  const { groups } = useLoaderData<LoaderData>()
  return (
    <div className="DashboardGroups">
      <h1 className="title text-center font-bold">Groups</h1>
      <DashboardGroupsList items={groups as Group[]} />
      <Outlet />
    </div>
  )
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  console.error("Error in groups: ", error)
  return (
    <div className="DashboardGroups bg-rose-200 shadow-lg text-rose-600 p-4 rounded-xl">
      <h1 className="text-lg font-bold mb-4">Error Loading Groups!</h1>
      <p className="error">
        Something happened when we tried to show you the groups. {error.message}
      </p>
    </div>
  )
}

export default DashboardGroups
