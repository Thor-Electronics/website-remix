import type { ErrorBoundaryComponent, LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant"
import { GroupCard } from "~/components/molecules/GroupCard"
import { getSessionToken } from "~/models/session.server"
import type { Group } from "~/types/Group"
import api from "~/utils/core.server"

type LoaderData = {
  group: Group
  socketToken: string
}

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.groupId, "Group not found")
  const token = await getSessionToken(request)
  const group = await api.getGroupDetails(params.groupId, token)
  return json<LoaderData>({ group, socketToken: token })
}

export const GroupDetails = () => {
  const { group, socketToken } = useLoaderData<LoaderData>()

  return (
    <div className="GroupDetails lg:max-w-5xl mx-auto">
      <GroupCard
        key={group.id}
        data={group as Group}
        socketToken={socketToken}
      />
    </div>
  )
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  console.error("Error in $groupId: ", error)
  return (
    <div className="GroupDetails bg-rose-100 shadow-lg text-rose-600 p-4 rounded-xl">
      <h1 className="text-lg font-bold mb-4">Error Loading Group Details!</h1>
      <p className="error">
        Something happened when we tried to show you the group details.{" "}
        {error.message}
      </p>
    </div>
  )
}

export default GroupDetails
