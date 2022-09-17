import { LoaderFunction, json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { LogoutButton } from "~/components/atoms/LogoutButton"
import { requireUser, User } from "~/models/session.server"

type LoaderData = {
  user: User
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request)
  return json<LoaderData>({ user })
}

export const Dashboard = () => {
  const { user } = useLoaderData<LoaderData>()
  return (
    <div className="Dashboard">
      <h1>DASHBOARD</h1>
      <p>Welcome {user.name}!</p>
      <small>Signed in as {user.email}</small>
      <LogoutButton />
    </div>
  )
}

export default Dashboard
