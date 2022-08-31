import type { LinksFunction, MetaFunction } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"
import NavigatingScreen from "./components/NavigatingScreen"
import styles from "~/styles/root.css"

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Caspian",
  viewport: "width=device-width,initial-scale=1",
})

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }]

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-slate-200 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
        {/* <NavigatingScreen /> */}
        {/* FIXME: by adding this component here, the page keeps refereshing! */}
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
