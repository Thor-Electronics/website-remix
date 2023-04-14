import { HomeModernIcon } from "@heroicons/react/24/solid"
import type { LoaderFunction } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { useState } from "react"
import { ReadyState } from "react-use-websocket"
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket"
import { GroupCard } from "~/components/molecules/GroupCard"
import { SimpleDeviceCard } from "~/components/molecules/SimpleDeviceCard"
import { getSessionToken } from "~/models/session.server"
import type { Group } from "~/types/Group"
import type { Device } from "~/types/Device"
import type { Message } from "~/types/Message"
import { Signal } from "~/types/Message"
import { getGroupDetails, getUserGroups } from "~/utils/core.server"
import { DASHBOARD_PREFIX } from "./app"

const DASHBOARD_GROUP_ID_KEY = ""
let WS_URI = "" // "ws://localhost:3993/api/v1/control/echo"
const WS_STATUS_BADGES = {
  [ReadyState.CONNECTING]: {
    text: "Connecting",
    className: "bg-orange-500 shadow-orange-300",
  },
  [ReadyState.OPEN]: {
    text: "Connected",
    className: "bg-green-500 shadow-green-300",
  },
  [ReadyState.CLOSING]: {
    text: "Disconnecting",
    className: "bg-rose-500 shadow-rose-300",
  },
  [ReadyState.CLOSED]: {
    text: "Disconnected",
    className: "bg-slate-800 shadow-slate-300",
  },
  [ReadyState.UNINSTANTIATED]: {
    text: "Uninstantiated",
    className: "bg-red-500",
  },
}

type LoaderData = {
  groups: Group[]
  socketToken: string
  // userSettings
  group: Group
}

export const loader: LoaderFunction = async ({ request }) => {
  const token = await getSessionToken(request)
  const groups = await getUserGroups(token)
  if (groups.length === 0) {
    console.log("User has no groups, redirecting to create page")
    return redirect(DASHBOARD_PREFIX + "/groups/new")
  }
  const group = await getGroupDetails((groups[0] as Group).id, token)
  return json<LoaderData>({
    groups,
    socketToken: token,
    group,
    // User Settings
    // group: await getGroupDetails(
    //   (
    //     await getUserGroups(await getSessionToken(request))
    //   )[0]?.id,
    //   await getSessionToken(request)
    // ),
  })
}

export const DashboardIndex = () => {
  const { group, socketToken /*, group: b*/ } = useLoaderData<LoaderData>()
  // Default group from user settings

  // let mostAccessedGroupId = groups[0]?.id
  // let mostAccessedGroup: Group = groups[0] as Group

  // if (typeof window !== "undefined") {
  //   mostAccessedGroupId =
  //     localStorage.getItem(DASHBOARD_GROUP_ID_KEY) ?? groups[0]?.id
  // }
  // groups.map(b => {
  //   if (b.id === mostAccessedGroupId) {
  //     mostAccessedGroup = b as Group
  //   }
  // })

  return (
    <div className="DashboardIndex text-center">
      <h1 className="text-2xl font-bold mb-3 text-slate-400">Smart Home</h1>
      {/* <div className="group-card">
        <div className="group-head flex items-center gap-2 mb-4 text-slate-700">
          <HomeModernIcon className="w-12 h-12" />
          <h3 className="group-name font-semibold text-xl">
            {group.name}
          </h3>
          <span
            className={`status text-xs px-2 py-0.5 rounded-full text-white shadow-md ${connectionStatus.className}`}
          >
            {connectionStatus.text}
          </span>
        </div>
        <div className="devices-card bg-slate-50 rounded-2xl mx-[-0.5em] p-2 shadow flex flex-col items-stretch gap-2">
          {group.devices?.map(d => (
            <SimpleDeviceCard
              key={d.id}
              data={d as Device}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      </div> */}
      {/* {groups.length > 0 ? ( */}
      {group ? (
        <GroupCard
          data={group as Group}
          socketToken={socketToken}
          className="dashboard-friendly"
        />
      ) : (
        <p>You don't have any group yet! Create a new one in the groups page</p>
      )}
    </div>
  )
}

export default DashboardIndex

// const [group, setGroup] = useState<Group>(b as Group)
// // console.log("Most Accessed Group is: ", mostAccessedGroup.name)
// WS_URI = `${process.env.NODE_ENV === "production" ? "wss" : "ws"}://${
//   ENV.CORE_ADDR
// }/api/v1/control/manage/${mostAccessedGroup.id}`

// // https://www.npmjs.com/package/react-use-websocket
// const { sendJsonMessage, sendMessage, readyState } = useWebSocket(WS_URI, {
//   onOpen: e => {
//     console.log("WS Connected: ", e)
//     const authSignal: Message = {
//       signal: Signal.AUTHENTICATE_CLIENT,
//       payload: {
//         token: socketToken,
//       },
//       id: "authentication message doesn't have an id",
//     }
//     sendMessage(JSON.stringify(authSignal))
//     console.log("Sent the authentication signal with payload")
//   },
//   onClose: e => console.warn("WS Closed: ", e),
//   onError: e => console.warn("WS ERROR: ", e),
//   onMessage: e => {
//     const msg = JSON.parse(e.data) as Message
//     if (msg.message) console.log("🔽 MESSAGE: ", msg.message)
//     if (msg.update) {
//       setGroup(prev => ({
//         ...prev,
//         devices: prev.devices?.map(d =>
//           d.id === msg.id ? { ...d, state: { ...d.state, ...msg.update } } : d
//         ),
//       }))
//     }
//   },
//   share: true,
//   // filter: () => false,
//   shouldReconnect: e => true,
//   // protocols: socketToken, // FIXME: this causes the connection error on chrome, use a better way!
// })

// const connectionStatus = WS_STATUS_BADGES[readyState]

// const handleUpdate = (message: object): boolean => {
//   sendJsonMessage(message)
//   return true
// }
