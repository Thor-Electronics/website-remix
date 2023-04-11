import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { Link, useActionData, useLoaderData } from "@remix-run/react"
import { TextButton } from "~/components/atoms/Button"
import { getSessionToken, requireUser } from "~/models/session.server"
import type { User } from "~/types/User"
import { DASHBOARD_PREFIX } from "./app"
import {
  AtSymbolIcon,
  PhoneIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid"
import api from "~/utils/core.server"

type LoaderData = {
  user: User
}

type ActionData = {
  errors?: {
    message?: string
    name?: string
    email?: string
    phone?: string
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  // const token = await getSessionToken(request)
  // const userProfile = await api.getUserProfile(token)
  const user = await requireUser(request)
  return json<LoaderData>({ user })
}

export const action: ActionFunction = async ({ request }) => {
  const user = await requireUser(request)
  const form = await request.formData()
  const name = form.get("name")
  const email = form.get("email")
  const phone = form.get("phone")

  let errors = {
    name: typeof name !== "string" && "Name must be string",
    email: typeof email !== "string" && "Email must be string",
    phone: typeof phone !== "string" && "Phone must be string",
  }

  if (Object.values(errors).some(Boolean)) return json({ errors }, 400)

  return await api
    .updateProfile(await getSessionToken(request), { name, email, phone })
    .then(res => {
      console.log("RES: ", res.data)
      console.log(
        `Successfully updated user ${user.name} ${
          res.data?.id ?? user.id
        } profile: ${res.status}`
      )
      return redirect(DASHBOARD_PREFIX + "/profile")
    })
    .catch(err => {
      const msg =
        err.response?.data?.message ?? err.response?.data ?? err.response ?? err
      console.error(`Failed to update user ${user.id} profile: ${msg}`)
      return json<ActionData>({ errors: { message: msg } })
    })
}

export default function DashboardProfile() {
  const { user } = useLoaderData()
  const actionData = useActionData<ActionData>()
  const u: User = user

  return (
    <div className="UserProfileUpdate">
      <form method="POST">
        {actionData?.errors?.message && (
          <p className="text-rose-600">Error: {actionData.errors.message}</p>
        )}
        <div className="form-row">
          <UserCircleIcon />
          <label>
            Name:{" "}
            {actionData?.errors?.name && (
              <span className="error text-rose-600">
                {actionData.errors.name}
              </span>
            )}
            <input name="name" defaultValue={u.name} required maxLength={63} />
          </label>
        </div>
        <div className="form-row">
          <AtSymbolIcon />
          <label>
            Email:{" "}
            {actionData?.errors?.email && (
              <span className="error text-rose-600">
                {actionData.errors.email}
              </span>
            )}
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
            Phone Number:{" "}
            {actionData?.errors?.phone && (
              <span className="error text-rose-600">
                {actionData.errors.phone}
              </span>
            )}
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
