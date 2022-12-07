import {
  json,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react"
import NavigatingScreen from "./components/NavigatingScreen"
import styles from "~/styles/root.css"
import { getEnv } from "./env.server"

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Caspian",
  viewport: "width=device-width,initial-scale=1",
  "theme-color": "#3b82f6",
})

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }]

function Document({
  children,
  title = `IoT Network`,
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

export const loader: LoaderFunction = () =>
  json<LoaderData>({
    ENV: getEnv(),
  })

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

// export function ErrorBoundary({ error }: { error: Error }) {
//   return (
//     <Document title="Uh-oh!">
//       <div className="error-container">
//         <h1>App Error</h1>
//         <pre>{error.message}</pre>
//       </div>
//     </Document>
//   )
// }
