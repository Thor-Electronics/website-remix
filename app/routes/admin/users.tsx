import { json, type LoaderFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import {
  getSessionToken,
  requireUser,
  type User,
} from "~/models/session.server"
import api from "~/utils/core.server"

type LoaderData = {
  users: User[]
}

export const loader: LoaderFunction = async ({ request }) => {
  const users = await api.adminGetUsers(await getSessionToken(request))
  return json<LoaderData>({ users })
}

export const AdminUsers = () => {
  const { users } = useLoaderData<LoaderData>() // <typeof loader>
  return (
    <div className="AdminUsers">
      <h2 className="title font-black font-serif text-3xl text-center mb-4">
        User Management
      </h2>
    </div>
  )
}

export default AdminUsers
