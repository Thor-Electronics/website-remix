import type { LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Outlet, useLoaderData } from "@remix-run/react"
import { DashboardGroupsList } from "~/components/organisms/DashboardGroupsList"
import { getSessionToken } from "~/models/session.server"
import { DeviceTypes } from "~/types/Device"
import type { Group } from "~/types/Group"
import { getUserGroups } from "~/utils/core.server"

type LoaderData = {
  vehicles: Group[]
}

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    vehicles: [sampleVehicleGroup],
  })
  // return json<LoaderData>({
  //   vehicles: (
  //     (await getUserGroups(await getSessionToken(request))) as Group[]
  //   ).map(g => g), // TODO: filter groups by their types. Only vehicles
  // })
}

export const DashboardVehicles = () => {
  const { vehicles } = useLoaderData<LoaderData>()

  return (
    <div className="DashboardVehicles">
      <h1 className="title text-center font-bold">Smart Transportation</h1>
      <DashboardGroupsList items={vehicles as Group[]} />
      <Outlet />
    </div>
  )
}

export const sampleVehicle = {
  id: "fake_id",
  cpuId: "ECU_18328193140",
  name: "911 Turbo",
  groupId: "0",
  type: DeviceTypes.VEHICLE,
  state: {
    speed: 60, // KMpH
    rpm: 2000, // RPM
    fuel: 53, // %
    temperature: 73, // Celsius
    // lat:
    // long:
  },
  isOnline: true,
  latency: 16,
}

export const sampleVehicleGroup = {
  id: "0",
  name: "911 Turbo",
  userId: "",
  devices: [sampleVehicle],
}
