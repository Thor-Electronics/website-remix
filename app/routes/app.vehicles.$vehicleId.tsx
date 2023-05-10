import { json, type LoaderFunction } from "@remix-run/node"
import invariant from "tiny-invariant"
import type { Group } from "~/types/Group"
import { sampleVehicleGroup } from "./app.vehicles"
import {
  isRouteErrorResponse,
  Outlet,
  useLoaderData,
  useRouteError,
} from "@remix-run/react"
import type { V2_ErrorBoundaryComponent } from "@remix-run/react/dist/routeModules"
import { VehicleCard } from "~/components/molecules/VehicleCard"

type LoaderData = {
  vehicle: Group
  // socketToken: string
}

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.vehicleId, "Vehicle not found")
  return json<LoaderData>({ vehicle: sampleVehicleGroup })
}

export default function VehicleDetails() {
  const { vehicle } = useLoaderData<LoaderData>()

  return (
    <div className="VehicleDetails">
      <VehicleCard data={vehicle as Group} />
      <Outlet />
    </div>
  )
}

export const ErrorBoundary: V2_ErrorBoundaryComponent = () => {
  const error = useRouteError()
  console.error("Error in $vehicleId: ", error)
  return (
    <div className="VehicleDetails bg-rose-100 shadow-lg text-rose-600 p-4 rounded-xl">
      <h1 className="text-lg font-bold mb-4">Error Loading Vehicle Details!</h1>
      <p className="error">
        {isRouteErrorResponse(error) ? (
          <span>
            {error.status === 404
              ? "404 | Vehicle Not Found"
              : `${error.status} | ${error.statusText}`}
          </span>
        ) : (
          <span>
            Something happened when we tried to show you the vehicle details.{" "}
            {error.message}
          </span>
        )}
      </p>
    </div>
  )
}
