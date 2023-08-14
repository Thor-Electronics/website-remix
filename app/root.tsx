import type {
  LinksFunction,
  LoaderFunction,
  V2_MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  Outlet,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
// import NavigatingScreen from "./components/NavigatingScreen"
import styles from "~/styles/root.css";
import { LogoIcon } from "./components/atoms/LogoIcon";
import { getEnv } from "./env.server";
import type { V2_ErrorBoundaryComponent } from "@remix-run/react/dist/routeModules";
import { useEffect, useState } from "react";
import Document from "./Document";
// import { useSWEffect } from "@remix-pwa/sw";

// TODO: https://www.wking.dev/library/remix-route-helpers-a-better-way-to-use-parent-data
// use matches
// TODO: https://jankraus.net/2022/04/16/access-remix-route-data-in-other-routes/
// use route data
// TODO: Good utils: https://www.npmjs.com/package/remix-utils

// TODO: MetaFunction after upgrade to v2
export const meta: V2_MetaFunction = () => [
  { title: "Thor Electronics" },
  { charSet: "utf-8" },
  { name: "viewport", content: "width=device-width,initial-scale=1" },
  { name: "theme-color", content: "#3b82f6" },
];

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  // { rel: "manifest", href: "resources/manifest/webmanifest" },
];

type LoaderData = {
  ENV: ReturnType<typeof getEnv>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  console.log("root.tsx: ", url.pathname);

  // const cookieSession = await cookieSessionStorage.getSession(
  //   request.headers.get("Cookie")
  // )
  // todo: has a problem with pre-fetches I think
  // if (cookieSession.has("redirect")) {
  //   const redirectTo = cookieSession.get("redirect")!
  //   console.log(`Redirecting user '${url.pathname}' >>> '${redirectTo}'`)
  //   return redirect(redirectTo, {
  //     headers: {
  //       "Set-Cookie": await cookieSessionStorage.commitSession(cookieSession),
  //     },
  //   })
  // }

  // console.log("ROOT HERE 1")
  // // File Session of the Visitor
  // const fileSession = await fileSessionStorage.getSession(
  //   request.headers.get("Cookie")
  // )
  // console.log("ROOT HERE 2")
  // const now = new Date()
  // if (!fileSession.has("uuid")) {
  //   console.log(
  //     `FileSession doesn't exist. Creating new file session for visitor ${request.headers}`,
  //     request.headers
  //   ) // todo: get the IP
  //   fileSession.set("uuid", crypto.randomUUID())
  //   fileSession.set("history", [])
  //   console.log("ROOT HERE 3")
  //   // fileSession.set("createdAt", now) // Redundant, we can check the first record's date
  // }
  // // fileSession.set("updatedAt", now) // Redundant, we can check the last record's date
  // const history = fileSession.get("history")
  // history?.push({ url: url.pathname, date: now })
  // console.log("File Session: ", fileSession.data)
  // console.log("ROOT HERE 4")

  return json<LoaderData>(
    {
      ENV: getEnv(),
    }
    // {
    //   headers: {
    //     "Set-Cookie": await fileSessionStorage.commitSession(fileSession),
    //   },
    // }
  );
};

export default function App() {
  const { ENV } = useLoaderData<LoaderData>();
  const [theme, setTheme] = useState<"dark" | "">("");
  // useSWEffect();
  useEffect(() => {
    if (window) {
      let userTheme: "dark" | "" = "";
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (prefersDark) {
        console.log("Browser prefers dark");
        userTheme = "dark";
      }

      const savedTheme = window.localStorage.getItem("theme");
      if (savedTheme === "dark") {
        // savedTheme
        console.log("Saved theme is: ", savedTheme);
        userTheme = savedTheme;
      }
      console.log("Setting theme: ", userTheme);
      setTheme(userTheme);
    }
  }, []);

  return (
    <Document className={theme}>
      <Outlet />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.ENV = ${JSON.stringify(ENV)}`,
        }}
      />
    </Document>
  );
}

export const ErrorBoundary: V2_ErrorBoundaryComponent = () => {
  const error = useRouteError();
  console.error("root.tsx ERROR: ", error);

  if (isRouteErrorResponse(error)) {
    // console.log("Is Route Error Response: ", error)
    return (
      <Document title="Oops!">
        <div
          className="error-container h-screen error bg-rose-100
          dark:bg-slate-900 text-rose-600 dark:text-rose-400
          flex flex-col gap-6 items-center justify-center text-center"
        >
          <LogoIcon className="w-32" />
          <h2 className="text-2xl font-bold">Something Went Wrong!</h2>
          <p className="font-lg font-semibold">
            {error.status} | {error.statusText}
          </p>
          <p className="text-sm">
            There was an error loading this page!{" "}
            {error.data?.message ?? error.data}
          </p>
        </div>
      </Document>
    );
  }

  let errMsg = "Unknown Error";
  // TODO: detect error type check
  // if (error && error.message && error.message !== undefined) {
  //   errMsg = error.message
  // }
  return (
    <Document title="Error!">
      <div
        className="error-container h-screen bg-rose-200 dark:bg-slate-900
        text-rose-600 dark:text-rose-400 flex flex-col gap-6
        items-center justify-center text-center"
      >
        <LogoIcon className="w-32" />
        <h1 className="status flex items-center justify-center gap-2 text-3xl font-bold">
          App Error
        </h1>
        <div className="error text-xl font-bold">{errMsg}</div>
        {/* <pre>{error.message}</pre> */}
        <Link to="/" className="font-semibold !underline" prefetch="render">
          Back to home
        </Link>
      </div>
    </Document>
  );
};
