import { json, LinksFunction, LoaderFunction } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import Button from "~/components/atoms/Button"
import styles from "~/styles/index.css"
import darkStyles from "~/styles/dark.css"
import {
  getOptionalUser,
  getSessionData,
  getUserId,
} from "~/models/session.server"
import { LogoutButton } from "~/components/atoms/LogoutButton"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  {
    rel: "stylesheet",
    href: darkStyles,
    media: "(prefers-color-scheme: dark)",
  },
]

type LoaderData = {
  user?: {
    id: string
    name: string
    email: string
    username: string
  }
  session?: object
}

export const loader: LoaderFunction = async ({ request }) =>
  json<LoaderData>({
    user: await getOptionalUser(request),
    session: await getSessionData(request),
  })

export default function Index() {
  const { session, user } = useLoaderData<LoaderData>()
  return (
    <main className="h-screen flex flex-col justify-center items-center gap-4">
      <h1 className="font-bold text-4xl text-center">
        Welcome to IoT Cloud Service
      </h1>
      <div className="buttons flex gap-2">
        {user ? (
          <>
            <Link to="/dashboard" prefetch="render">
              <Button className="!bg-primary">Dashboard</Button>
            </Link>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link to="/signup" prefetch="render">
              <Button className="!bg-primary">Signup</Button>
            </Link>
            <Link to="login" prefetch="render">
              <Button className="!bg-white !text-slate-700 dark:bg-slate-800 dark:text-white">
                Login
              </Button>
            </Link>
          </>
        )}
      </div>
    </main>
  )
}
