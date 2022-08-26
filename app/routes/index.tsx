import { LinksFunction, LoaderFunction } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import styles from "~/styles/index.css"

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }]

export default function Index() {
  return (
    <div>
      {/* <h1>Welcome to Remix</h1> */}
      <Link to="/foo">Foo</Link>
      <p>------</p>
      <Link to="/bar">Bar</Link>
    </div>
  )
}
