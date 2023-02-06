import type { ErrorBoundaryComponent, LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Outlet, useLoaderData } from "@remix-run/react"
import { DashboardBuildingsList } from "~/components/organisms/DashboardBuildingsList"
import { getSessionData } from "~/models/session.server"
import type { Building } from "~/types/Building"
import { getUserBuildings } from "~/utils/core.server"

type LoaderData = {
  buildings: Building[]
}

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    buildings: await getUserBuildings((await getSessionData(request)).token),
  })
}

export const DashboardBuildings = () => {
  const { buildings } = useLoaderData<LoaderData>()
  return (
    <div className="DashboardBuildings">
      <h1 className="title text-center font-bold">Buildings</h1>
      <DashboardBuildingsList items={buildings as Building[]} />
      <Outlet />
    </div>
  )
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  console.error("Error in buildings: ", error)
  return (
    <div className="DashboardBuildings bg-rose-200 shadow-lg  text-rose-600 p-4 rounded-xl">
      <h1 className="text-lg font-bold mb-4">Error Loading Buildings!</h1>
      <p className="error">
        Something happened when we tried to show you the buildings.{" "}
        {error.message}
      </p>
    </div>
  )
}

export default DashboardBuildings
