import { json, LoaderFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { useEffect, useState } from "react"
import invariant from "tiny-invariant"
import { BuildingCard } from "~/components/molecules/BuildingCard"
import { getSessionToken } from "~/models/session.server"
import { Building } from "~/types/Building"
import { Message } from "~/types/Message"
import api from "~/utils/core.server"
import socketClient from "~/utils/socket.client"

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
  const [socket, setSocket] = useState<WebSocket>()
  if (typeof window !== "undefined") {
    useEffect(() => {
      socketClient.connect(
        `ws://${ENV.CORE_ADDR}/api/v1/control/manage/${building.id}`,
        socketToken,
        (socket, e) => {
          console.log("WS: ✅Connected to the server")
          setSocket(socket)
        }
      )
    }, [])

    useEffect(() => {
      socket?.addEventListener("message", e => {
        const message = socketClient.parseMessage(e)
        // TODO: listen for updates and react to them here ...
      })
      // socket?.send(JSON.stringify({ message: "Foo" }))
    }, [socket])
  }

  return (
    <div className="BuildingDetails p-4">
      <BuildingCard data={building} size={4} link="" />
    </div>
  )
}

export default BuildingDetails
