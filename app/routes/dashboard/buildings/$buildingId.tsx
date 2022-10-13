import type { LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { useEffect, useState } from "react"
import invariant from "tiny-invariant"
import { BuildingCard } from "~/components/molecules/BuildingCard"
import { getSessionToken } from "~/models/session.server"
import type { Building } from "~/types/Building"
import { Message } from "~/types/Message"
import api from "~/utils/core.server"
import socketClient, { sendCommand } from "~/utils/socket.client"

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
  const [state, setState] = useState<Building>(building)

  const handleUpdate = (newState: object, deviceId: string) =>
    sendCommand(socket, newState, deviceId)

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
      // listen for updates and react to them
      socket?.addEventListener("message", e => {
        const msg = socketClient.parseMessage(e)
        if (!msg.ok) console.log("message with errors! ", msg.message)
        // Update Message Received
        if (msg.update) {
          // look for device ID and update it
          setState(prev => ({
            ...prev,
            devices: prev.devices?.map(d =>
              d.id === msg.deviceId
                ? { ...d, state: { ...d.state, ...msg.update } }
                : d
            ),
          })) //* Wow! what a cool statement I wrote! I love it!
        }
        if (msg.deviceId) {
          console.log(
            "New message received related to a device: ",
            msg.deviceId
          )
        }
      })
      // socket?.send(JSON.stringify({ message: "Foo" }))
    }, [socket])
  }

  return (
    <div className="BuildingDetails p-4">
      <BuildingCard
        data={state}
        size={4}
        link=""
        updateHandler={handleUpdate}
      />
    </div>
  )
}

export default BuildingDetails
