import { LinksFunction } from "@remix-run/node"
import { Link } from "@remix-run/react"
import Button from "~/components/atoms/Button"
import styles from "~/styles/index.css"
import darkStyles from "~/styles/dark.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  {
    rel: "stylesheet",
    href: darkStyles,
    media: "(prefers-color-scheme: dark)",
  },
]

export default function Index() {
  return (
    <main className="h-screen flex flex-col justify-center items-center gap-4">
      <h1 className="font-bold text-4xl">Welcome to IoT Cloud Service</h1>
      <div className="buttons flex gap-2">
        <Link to="/signup">
          <Button className="bg-primary">Signup</Button>
        </Link>
        <Link to="login">
          <Button className="bg-white !text-slate-700 dark:bg-slate-800 dark:text-white">
            Login
          </Button>
        </Link>
      </div>
    </main>
  )
}
