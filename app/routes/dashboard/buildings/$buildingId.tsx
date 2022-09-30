import { json, LoaderFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { useEffect, useState } from "react"
import invariant from "tiny-invariant"
import { BuildingCard } from "~/components/molecules/BuildingCard"
import { getSessionToken } from "~/models/session.server"
import { Building } from "~/types/Building"
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
  const [socket, setSocket] = useState<WebSocket>()
  if (typeof window !== "undefined") {
    useEffect(() => {
      console.log("WS: 🔌Initializing connection to", ENV.CORE_ADDR)
      const socket = new WebSocket(`ws://${ENV.CORE_ADDR}/api/v1/control/echo`)
      socket.addEventListener("open", e => {
        console.log("WS: ✅Connected to the server")
        setSocket(socket)
        socket.send("ping")
      })
      socket.addEventListener("message", e => console.log("🔽", e.data))
      socket.addEventListener("close", e =>
        console.log("WS: ⭕Connection closed", e.reason, e.wasClean)
      ) // socket.addEventListener("error", e => console.warn("❌WS Error: ", e.type)) // return socket.close()
    }, [])

    useEffect(() => {
      socket?.addEventListener("message", e =>
        console.log("Second listener called")
      )
      socket?.send("foo")
    }, [socket])
  }

  return (
    <div className="BuildingDetails p-4">
      <BuildingCard data={building} size={4} link="" />
    </div>
  )
}

export default BuildingDetails
