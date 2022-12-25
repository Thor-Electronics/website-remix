import type { LinksFunction, LoaderFunction } from "@remix-run/cloudflare"
import { json } from "@remix-run/cloudflare"
import { Link, useLoaderData } from "@remix-run/react"
import Button, { TextButton } from "~/components/atoms/Button"
import styles from "~/styles/index.css"
import darkStyles from "~/styles/dark.css"
import {
  getOptionalUser,
  getSessionData,
  getUserId,
} from "~/models/session.server"
import { LogoutButton } from "~/components/atoms/LogoutButton"
import Hero from "~/components/organisms/Hero"
import Footer from "~/components/organisms/Footer"
import About from "~/components/organisms/About"

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
    <main className="h-screen /max-w-6xl mx-auto text-center">
      <Hero />
      <About />
      {/* <div className="buttons flex gap-2">
        {user ? (
          <>
            <Link to="/dashboard" prefetch="render">
              <TextButton className="!bg-primary">Dashboard</TextButton>
            </Link>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link to="/signup" prefetch="render">
              <TextButton className="!bg-primary">Signup</TextButton>
            </Link>
            <Link to="login" prefetch="render">
              <TextButton className="!bg-white !text-slate-700 dark:bg-slate-800 dark:text-white">
                Login
              </TextButton>
            </Link>
          </>
        )}
      </div> */}
      {/* <Footer /> */}
    </main>
  )
}
