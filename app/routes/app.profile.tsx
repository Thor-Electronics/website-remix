import {
  AtSymbolIcon,
  HashtagIcon,
  PhoneIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid"
import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { Response, json } from "@remix-run/node"
import { Form, Link, useLoaderData } from "@remix-run/react"
import Badge, { SuccessBadge } from "~/components/atoms/Badge"
import { TextButton } from "~/components/atoms/Button"
import { getSessionToken, requireUser } from "~/models/session.server"
import type { User } from "~/types/User"
import api from "~/utils/core.server"

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
  throw new Response("Not Implemented!")
}

export default function DashboardProfile() {
  const { user } = useLoaderData()
  const u: User = user

  const isEmailVerified: Boolean =
    Date.parse(
      typeof u.emailVerifiedAt === "string"
        ? u.emailVerifiedAt
        : u.emailVerifiedAt!.toString()
    ) > 0

  const isPhoneVerified: Boolean =
    Date.parse(
      typeof u.phoneVerifiedAt === "string"
        ? u.phoneVerifiedAt
        : u.phoneVerifiedAt!.toString()
    ) > 0
  // console.log("USER: ", u)

  return (
    <div className="UserProfile">
      <UserCircleIcon className="w-32" />
      <h1 className="name">{u.name}</h1>
      {u.email && (
        <h3 className="email">
          <AtSymbolIcon />
          {u.email}
          {!isEmailVerified ? (
            <Form
              action="/send-email-verification"
              method="POST"
              reloadDocument
            >
              <button type="submit">
                <Badge>
                  <ShieldExclamationIcon />
                  Not Verified
                </Badge>
              </button>
            </Form>
          ) : (
            <Badge className="bg-green-500">
              {/* SuccessBadge */}
              <ShieldCheckIcon />
              Verified
            </Badge>
          )}
        </h3>
      )}
      {u.phone && (
        <h3 className="phone">
          <PhoneIcon />
          {u.phone}
          {!isPhoneVerified ? (
            <Form
              action="/send-phone-verification"
              method="POST"
              reloadDocument
            >
              <button type="submit" name="submission">
                <Badge>
                  <ShieldExclamationIcon />
                  Not Verified
                </Badge>
              </button>
            </Form>
          ) : (
            <Badge className="bg-green-500">
              {/* SuccessBadge */}
              <ShieldCheckIcon />
              Verified
            </Badge>
          )}
        </h3>
      )}
      {u.username && (
        <h3 className="username">
          <HashtagIcon />
          {u.username}
        </h3>
      )}
      <div className="options">
        <Link to="update">
          <TextButton className="!bg-slate-600">Edit</TextButton>
        </Link>
      </div>
      {u.roles && (
        <div className="roles">
          {u.roles.map(r => (
            <span key={r.name} className="role">
              {r.name}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
