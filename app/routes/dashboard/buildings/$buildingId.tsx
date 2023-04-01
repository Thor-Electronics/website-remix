import type { ErrorBoundaryComponent, LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant"
import { BuildingCard } from "~/components/molecules/BuildingCard"
import { getSessionToken } from "~/models/session.server"
import type { Building } from "~/types/Building"
import api from "~/utils/core.server"

type LoaderData = {
  building: Building
  socketToken: string
}

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.buildingId, "Building not found")
  const token = await getSessionToken(request)
  const building = await api.getBuildingDetails(params.buildingId, token)
  return json<LoaderData>({ building, socketToken: token })
}

export const BuildingDetails = () => {
  const { building, socketToken } = useLoaderData<LoaderData>()

  return (
    <div className="BuildingDetails lg:max-w-5xl mx-auto">
      <BuildingCard
        key={building.id}
        data={building as Building}
        socketToken={socketToken}
      />
    </div>
  )
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  console.error("Error in $buildingId: ", error)
  return (
    <div className="BuildingDetails bg-rose-100 shadow-lg text-rose-600 p-4 rounded-xl">
      <h1 className="text-lg font-bold mb-4">
        Error Loading Building Details!
      </h1>
      <p className="error">
        Something happened when we tried to show you the building details.{" "}
        {error.message}
      </p>
    </div>
  )
}

export default BuildingDetails
