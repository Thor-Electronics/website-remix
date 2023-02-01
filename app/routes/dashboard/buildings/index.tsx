import { json, LoaderFunction } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import Button, { TextButton } from "~/components/atoms/Button"
import { getSessionData } from "~/models/session.server"
import { Building } from "~/types/Building"
import { getUserBuildings } from "~/utils/core.server"

export const DashboardBuildingsIndex = () => {
  return (
    <div className="DashboardBuildingsIndex">
      <p className="italic text-center">
        You can see the list of your buildings and manage them by selecting them
      </p>
    </div>
  )
}

export default DashboardBuildingsIndex
