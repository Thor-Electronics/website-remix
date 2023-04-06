import { json, LoaderFunction } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import Button, { TextButton } from "~/components/atoms/Button"
import { getSessionData } from "~/models/session.server"
import { Group } from "~/types/Group"
import { getUserGroups } from "~/utils/core.server"

export const DashboardGroupsIndex = () => {
  return (
    <div className="DashboardGroupsIndex">
      <p className="italic text-center">
        You can see the list of your groups and manage them by selecting them
      </p>
    </div>
  )
}

export default DashboardGroupsIndex
