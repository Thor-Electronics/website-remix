import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { Response, json } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import Badge from "~/components/atoms/Badge"
import { TextButton } from "~/components/atoms/Button"
import { requireUser } from "~/models/session.server"
import type { User } from "~/types/User"
import { DASHBOARD_PREFIX } from "./app"
import { useState } from "react"
import {
  AtSymbolIcon,
  PhoneIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid"

type LoaderData = {
  user: User
}

export const loader: LoaderFunction = async ({ request }) => {
  // const token = await getSessionToken(request)
  // const userProfile = await api.getUserProfile(token)
  const user = await requireUser(request)
  return json<LoaderData>({ user })
}

export const action: ActionFunction = async ({ request }) => {
  throw new Response("Not Implemented!", {
    status: 501,
    statusText: "Method Not Implemented",
  })
}

export default function DashboardProfile() {
  const { user } = useLoaderData()
  const u: User = user
  // const [data, setData] = useState<User>(u)

  return (
    <div className="UserProfileUpdate">
      <form method="POST">
        <div className="form-row">
          <UserCircleIcon />
          <label>
            Name:
            <input name="name" defaultValue={u.name} required maxLength={63} />
          </label>
        </div>
        <div className="form-row">
          <AtSymbolIcon />
          <label>
            Email:
            <input
              name="email"
              defaultValue={u.email}
              type="email"
              maxLength={127}
              required
            />
          </label>
        </div>
        <div className="form-row">
          <PhoneIcon />
          <label>
            Phone Number:
            <input
              name="phone"
              defaultValue={u.phone}
              required
              minLength={11}
              maxLength={11}
            />
          </label>
        </div>
        {/* <label>
          Username:
          <input name="username" defaultValue={u.username} />
        </label> */}
        <div className="options">
          <TextButton type="submit" className="!bg-primary">
            Save
          </TextButton>
          <Link to={DASHBOARD_PREFIX + "/profile"} prefetch="render">
            <TextButton>Cancel</TextButton>
          </Link>
          <Link to={"/auth/forgot"}>
            {/* TODO: check the password url */}
            <TextButton className="!bg-rose-400">Reset Password</TextButton>
          </Link>
        </div>
      </form>
    </div>
  )
}
