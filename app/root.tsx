import {
  ErrorBoundaryComponent,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
  Response,
} from "@remix-run/node"
import { json } from "@remix-run/node"
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react"
// import NavigatingScreen from "./components/NavigatingScreen"
import styles from "~/styles/root.css"
import { LogoIcon } from "./components/atoms/LogoIcon"
import { getEnv } from "./env.server"

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Thor Electronics",
  viewport: "width=device-width,initial-scale=1",
  "theme-color": "#3b82f6",
})

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }]

function Document({
  children,
  title = `Thor Electronics`,
}: {
  children: React.ReactNode
  title?: string
}) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <title>{title}</title>
        <Links />
      </head>
      <body className="bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
        {/* <NavigatingScreen /> */}
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

type LoaderData = {
  ENV: ReturnType<typeof getEnv>
}

export const loader: LoaderFunction = () => {
  throw Error("ERROR, BITCH!")
  // json<LoaderData>({
  //   ENV: getEnv(),
  // })
}

export default function App() {
  const { ENV } = useLoaderData<LoaderData>()
  return (
    <Document>
      <Outlet />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.ENV = ${JSON.stringify(ENV)}`,
        }}
      />
    </Document>
    // <html lang="en">
    //   <head>
    //     <Meta />
    //     <Links />
    //   </head>
    //   <body className="bg-slate-200 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
    //     {/* <NavigatingScreen /> */}
    //     <Outlet />
    //     <ScrollRestoration />
    //     <Scripts />
    //     <LiveReload />
    //   </body>
    // </html>
  )
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  console.error("ERROR: ", error)
  return (
    <Document title="Error!">
      <div className="error-container h-screen bg-rose-200 text-rose-600 flex flex-col gap-6 items-center justify-center text-center">
        <LogoIcon className="w-32" />
        <h1 className="status flex items-center justify-center gap-2 text-3xl font-bold">
          <span className="code">App Error</span>
        </h1>
        <div className="error text-xl font-bold">{error.message}</div>
        {/* <pre>{error.message}</pre> */}
        <Link to="/" className="font-semibold !underline" prefetch="render">
          Back to home
        </Link>
      </div>
    </Document>
  )
}
