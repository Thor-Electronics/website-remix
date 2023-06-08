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
import type { User } from "~/types/User"

// ROUTING: https://remix.run/docs/en/1.15.0/file-conventions/route-files-v2#folders-for-organization

export const links: LinksFunction = () => [
  // { rel: "stylesheet", href: styles },
  {
    rel: "stylesheet",
    href: darkStyles,
    media: "(prefers-color-scheme: dark)",
  },
]

type LoaderData = {
  user?: User
  session: Awaited<ReturnType<typeof getSessionData>>
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getOptionalUser(request)
  const session = await getSessionData(request)
  // console.log(
  //   `_index.tsx -- ${user?.name ?? "Guest"}(${user?.id ?? "-"}) is visiting ${
  //     request.url
  //   }`
  // )
  return json<LoaderData>({ user, session })
}

export default function Index() {
  const { session, user } = useLoaderData<LoaderData>()

  return (
    <main className="h-full /max-w-6xl mx-auto text-center snap-mandatory snap-y">
      <Hero user={(user as User) ?? undefined} />
      <About />
      {/* <Footer /> */}
    </main>
  )
}
