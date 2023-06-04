import { HomeModernIcon } from "@heroicons/react/24/solid"
import type { LoaderFunction } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { Link, useLoaderData, useRouteLoaderData } from "@remix-run/react"
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
import { DASHBOARD_PREFIX, useAppLoaderData } from "./app"
import { Alert, AlertTitle } from "@mui/material"
import { TextButton } from "~/components/atoms/Button"

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
  console.log("app._index.tsx -- SessionToken, UserGroups, GroupDetails")
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

export const DashboardIndexRoute = () => {
  const { group, socketToken /*, group: b*/ } = useLoaderData<LoaderData>()
  // todo: Default group from user settings
  const { orphanDevices, token, user } = useAppLoaderData()

  return (
    <div className="DashboardIndex text-center">
      <h1 className="text-2xl font-bold mb-3 text-slate-400">Smart Home</h1>
      {orphanDevices.length !== 0 && (
        <Alert
          severity="warning"
          // variant="outlined"
          className="mb-4"
          action={
            <Link to="orphan-devices">
              <TextButton className="!bg-orange-500">Configure</TextButton>
            </Link>
          }
        >
          {/* <AlertTitle>Orphan Devices</AlertTitle> */}
          There{" "}
          {orphanDevices.length > 1
            ? `are ${orphanDevices.length} devices`
            : `is 1 device`}{" "}
          that {orphanDevices.length > 1 ? "are" : "is"} not connected to any
          building or group. Click here to assign{" "}
          {orphanDevices.length > 1 ? "them" : "it"} to a group to make{" "}
          {orphanDevices.length > 1 ? "them" : "it"} functional.
        </Alert>
      )}
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

export default DashboardIndexRoute
