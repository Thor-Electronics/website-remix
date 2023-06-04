import type { LoaderFunction } from "@remix-run/node"
import { Response, json } from "@remix-run/node"
import {
  Outlet,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react"
import type { V2_ErrorBoundaryComponent } from "@remix-run/react/dist/routeModules"
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
  console.log("app.groups.$groupId.tsx -- SessionToken, GroupDetails")
  invariant(params.groupId, "Group not found")
  const token = await getSessionToken(request)
  const group = await api.getGroupDetails(params.groupId, token).catch(err => {
    if (err.response?.status === 404) {
      throw new Response("Group Not Found", { status: 404 })
    }
  })
  // console.log("GROUP: ", group)
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
      <Outlet />
    </div>
  )
}

export const ErrorBoundary: V2_ErrorBoundaryComponent = () => {
  const error = useRouteError()
  console.error("Error in $groupId: ", error)
  return (
    <div className="GroupDetails bg-rose-100 shadow-lg text-rose-600 p-4 rounded-xl">
      <h1 className="text-lg font-bold mb-4">Error Loading Group Details!</h1>
      <p className="error">
        {isRouteErrorResponse(error) ? (
          <span>
            {error.status === 404
              ? "404 | Group Not Found"
              : `${error.status} | ${error.statusText}`}
          </span>
        ) : (
          <span>
            Something happened when we tried to show you the group details.{" "}
            {error.message}
          </span>
        )}
      </p>
    </div>
  )
}

export default GroupDetails
