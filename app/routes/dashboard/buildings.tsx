import type { LoaderFunction } from "@remix-run/node"
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

export default DashboardBuildings
