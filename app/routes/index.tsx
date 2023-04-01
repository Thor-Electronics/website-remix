import type { LinksFunction, LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import Button, { TextButton } from "~/components/atoms/Button"
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
  // { rel: "stylesheet", href: styles },
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
    <main className="min-h-screen /max-w-6xl mx-auto text-center snap-mandatory snap-y">
      <Hero user={user} />
      <About />
      {/* <Footer /> */}
    </main>
  )
}
