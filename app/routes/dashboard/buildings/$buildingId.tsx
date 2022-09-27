import { json, LoaderFunction } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant"
import { BuildingCard } from "~/components/molecules/BuildingCard"
import DeviceCard from "~/components/molecules/DeviceCard"
import { getSessionToken } from "~/models/session.server"
import { Building } from "~/types/Building"
import { Device } from "~/types/Device"
import api from "~/utils/core.server"

type LoaderData = {
  building: Building
}

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.buildingId, "Building not found")
  const building = await api.getBuildingDetails(
    params.buildingId,
    await getSessionToken(request)
  )
  return json<LoaderData>({ building })
}

export const BuildingDetails = () => {
  const { building } = useLoaderData<LoaderData>()
  return (
    <div className="BuildingDetails p-4">
      <BuildingCard data={building} size={4} link="" />
    </div>
  )
}

export default BuildingDetails
