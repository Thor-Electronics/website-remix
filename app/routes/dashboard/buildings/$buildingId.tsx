import type { LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { useEffect, useState } from "react"
import invariant from "tiny-invariant"
import { BuildingCard } from "~/components/molecules/BuildingCard"
import { getSessionToken } from "~/models/session.server"
import type { Building } from "~/types/Building"
import { Signals } from "~/types/Message"
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

  const handleUpdate = (newState: object, deviceId: string) => {
    console.log(
      "Sending control command via websocket",
      newState,
      newState.update ?? newState,
      deviceId
    )
    return sendCommand(socket, newState.update ?? newState, deviceId)
  }

  if (typeof window !== "undefined") {
    useEffect(() => {
      socketClient.connect(
        `${process.env.NODE_ENV === "production" ? "wss" : "ws"}://${
          ENV.CORE_ADDR
        }/api/v1/control/manage/${building.id}`,
        socketToken,
        (socket, e) => {
          console.log("WS: ✅Connected to the server", building.id)
          setSocket(socket)
          // listen for updates and react to them
          // console.log("HERE", socket, socket?.OPEN)
          socket?.addEventListener("message", e => {
            const msg = socketClient.parseMessage(e)
            if (!msg.ok) console.log("message with errors! ", msg.message)
            // Update Message Received
            if (msg.update) {
              // look for device ID and update it
              // console.log("Update detected!")
              setState(prev => ({
                ...prev,
                devices: prev.devices?.map(d =>
                  d.id === msg.id
                    ? { ...d, state: { ...d.state, ...msg.update } }
                    : d
                ),
              })) //* Wow! what a cool statement I wrote! I love it!
            }

            if (msg.signal) {
              // console.log("Signal received: ", msg.signal)

              /* Initial Data */
              if (msg.signal === Signals.USER_INITIAL_DATA) {
                setState(prev => ({
                  ...prev,
                  devices: prev.devices?.map(d =>
                    msg.payload?.onlineDevices?.includes(d.id)
                      ? { ...d, isOnline: true }
                      : d
                  ),
                }))
              }

              /* Device connected / disconnected */
              if (
                msg.signal === Signals.DEVICE_CONNECTED ||
                msg.signal === Signals.DEVICE_DISCONNECTED
              ) {
                setState(prev => ({
                  ...prev,
                  devices: prev.devices?.map(d =>
                    d.id === msg.id
                      ? {
                          ...d,
                          isOnline:
                            msg.signal === Signals.DEVICE_CONNECTED
                              ? true
                              : false,
                        }
                      : d
                  ),
                }))
              }
            }

            if (msg.id) {
              // console.log(
              //   "New message received related to a device: ",
              //   msg.deviceId
              // )
            }
          })
          // socket?.send(JSON.stringify({ message: "Foo" }))
        }
      )
    }, [])

    // useEffect(() => {

    // }, [socket])
  }

  console.log("OPEN: ", socket?.OPEN)

  return (
    <div className="BuildingDetails p-4 lg:max-w-5xl mx-auto">
      <BuildingCard
        data={state}
        size={4}
        link=""
        updateHandler={handleUpdate}
        connected={socket?.OPEN}
      />
    </div>
  )
}

export default BuildingDetails
