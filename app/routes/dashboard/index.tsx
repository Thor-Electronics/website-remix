import { HomeModernIcon } from "@heroicons/react/24/solid"
import { json, LoaderFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket"
import { SimpleDeviceCard } from "~/components/molecules/SimpleDeviceCard"
import { getSessionToken } from "~/models/session.server"
import { Building } from "~/types/Building"
import { Device } from "~/types/Device"
import { getBuildingDetails, getUserBuildings } from "~/utils/core.server"

const DASHBOARD_BUILDING_ID_KEY = ""
let WS_URI = "" // "ws://localhost:3993/api/v1/control/echo"

type LoaderData = {
  buildings: Building[]
  socketToken: string
  building: Building
}

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    buildings: await getUserBuildings(await getSessionToken(request)),
    socketToken: await getSessionToken(request),
    building: await getBuildingDetails(
      (
        await getUserBuildings(await getSessionToken(request))
      )[0]?.id,
      await getSessionToken(request)
    ),
  })
}

export const DashboardIndex = () => {
  const { buildings, socketToken, building } = useLoaderData<LoaderData>()

  let mostAccessedBuildingId = buildings[0]?.id
  let mostAccessedBuilding: Building = buildings[0] as Building

  if (typeof window !== "undefined") {
    mostAccessedBuildingId =
      localStorage.getItem(DASHBOARD_BUILDING_ID_KEY) ?? buildings[0].id
  }
  buildings.map(b => {
    if (b.id === mostAccessedBuildingId) {
      mostAccessedBuilding = b as Building
    }
  })
  // console.log("Most Accessed Building is: ", mostAccessedBuilding.name)
  WS_URI = `${process.env.NODE_ENV === "production" ? "wss" : "ws"}://${
    ENV.CORE_ADDR
  }/api/v1/control/manage/${mostAccessedBuilding.id}`
  // https://www.npmjs.com/package/react-use-websocket
  const { lastJsonMessage, sendJsonMessage } = useWebSocket(WS_URI, {
    onOpen: e => {
      // TODO: send token and authenticate signal "AUTHENTICATE_CLIENT"
      console.log("WS Connected: ", e)
    },
    onClose: e => console.log("WS Closed: ", e),
    onError: e => console.warn("WS ERROR: ", e),
    share: true,
    // filter: () => false,
    shouldReconnect: e => true,
    protocols: socketToken, // FIXME: this causes the connection error on chrome, use a better way!
  })

  // setTimeout(() => sendJsonMessage({ message: "IDK" }), 2000)
  console.log("New Message: ", lastJsonMessage)
  // const activities = lastJsonMessage?.data.message || []

  return (
    <div className="DashboardIndex text-center">
      {/* <h1 className="title">Dashboard</h1> */}
      <div className="building-card">
        <div className="building-head flex items-center gap-2 mb-4 text-slate-700">
          <HomeModernIcon className="w-12 h-12" />
          <h3 className="building-name font-semibold text-xl">
            {building.name}
          </h3>
        </div>
        <div className="devices-card bg-slate-50 rounded-2xl mx-[-0.5em] p-2 shadow flex flex-col items-stretch gap-2">
          {building.devices?.map(d => (
            <SimpleDeviceCard data={d as Device} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardIndex
