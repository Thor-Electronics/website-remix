import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
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
import styles from "../styles/root.css";
import { LogoIcon } from "./components/atoms/LogoIcon";
import { getEnv } from "./env.server";
import type { ErrorBoundaryComponent } from "@remix-run/react/dist/routeModules";
import { useEffect, useState } from "react";
import Document from "./Document";
import Maintenance from "./components/organisms/Maintenance";
// import { useSWEffect } from "@remix-pwa/sw";

// TODO: https://www.wking.dev/library/remix-route-helpers-a-better-way-to-use-parent-data
// use matches
// TODO: https://jankraus.net/2022/04/16/access-remix-route-data-in-other-routes/
// use route data
// TODO: Good utils: https://www.npmjs.com/package/remix-utils

// TODO: MetaFunction after upgrade to v2
export const meta: MetaFunction = () => [
  { title: "Thor Electronics" },
  // { charSet: "utf-8" },
  // { name: "viewport", content: "width=device-width,initial-scale=1" },
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
  // const url = new URL(request.url);
  // console.log("root.tsx: ", url.pathname);

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

export type Theme = "dark" | "light" | "";

export default function App() {
  const { ENV } = useLoaderData<LoaderData>();
  const [theme, setTheme] = useState<Theme>("");
  // useSWEffect();
  useEffect(() => {
    if (window) {
      const savedTheme = window.localStorage.getItem("theme");
      if (savedTheme !== null) {
        console.log("Saved theme is: ", savedTheme);
        setTheme(savedTheme as Theme);
      } else {
        const browserPrefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        if (browserPrefersDark) {
          console.log("Browser prefers dark");
          setTheme("dark");
        }
      }
    }
  }, []);

  return (
    <Document className={theme}>
      <Maintenance />
      <Outlet />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.ENV = ${JSON.stringify(ENV)}`,
        }}
      />
    </Document>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = () => {
  const err = useRouteError();
  // console.error("root.tsx ERROR: ", error);

  let title: string = "Oops!";
  let heading: string = "Something Went Wrong!";
  let msg: string = "";
  const isErrResponse = isRouteErrorResponse(err);
  const isRuntimeError = err instanceof Error;
  // console.warn(`[ERROR-${isErrResponse ? 'RESPONSE' : isRuntimeError ? 'RUNTIME' : 'UNKNOWN'}] root.tsx(${isErrResponse ? err.status : err.message}): ${isErrResponse ? JSON.stringify(err.data) : undefined}`, (!isErrResponse && isRuntimeError) ? err.stack : err);
  if (isErrResponse) {
    console.warn(
      `[ERROR-RESPONSE] root.tsx(${err.status}): ${JSON.stringify(err.data)}`
    );
    title = "Oops!";
    heading = "Something Failed!";
    msg = `${err.status} | ${err.statusText}`;
  } else if (isRuntimeError) {
    console.warn(`[ERROR-RUNTIME] root.tsx(${err.message}): `, err.stack);
    title = "Runtime Error!";
    heading = "Something Went Wrong!";
    msg = err.message;
  } else {
    console.warn(`[ERROR-UNKNOWN] root.tsx: `, err);
    title = "Unknown Error!";
    heading = "Some Unknown Error Happened!";
    msg = "There was an unknown error happened during client-side operations!";
  }
  return (
    <Document title={title}>
      <div
        className="error-container h-screen error bg-rose-100
          dark:bg-stone-900 text-rose-600 dark:text-rose-400
          flex flex-col gap-6 items-center justify-center text-center"
      >
        <LogoIcon className="w-32" />
        <h2 className="text-2xl font-bold">{heading}</h2>
        <p className="font-lg font-semibold">{msg}</p>
        {isErrResponse && (
          <p className="text-sm">
            There was an error loading this page!{" "}
            {err.data?.message || err.data}
          </p>
        )}
        {isRuntimeError && <pre className="text-sm">{err.stack}</pre>}
      </div>
      <Link to="/" className="font-semibold !underline" prefetch="render">
        Back to home
      </Link>
    </Document>
  );

  // let errMsg = "Unknown Error";
  // // TODO: detect error type check
  // if (err && err.message && err.message !== undefined) {
  //   errMsg = err.message;
  // }
  // return (
  //   <Document title="Unknown Error!">
  //     <div
  //       className="error-container h-screen bg-rose-200 dark:bg-slate-900
  //       text-rose-600 dark:text-rose-400 flex flex-col gap-6
  //       items-center justify-center text-center"
  //     >
  //       <LogoIcon className="w-32" />
  //       <h1 className="status flex items-center justify-center gap-2 text-3xl font-bold">
  //         App Error
  //       </h1>
  //       <div className="error text-xl font-bold">{errMsg}</div>
  //       {/* <pre>{error.message}</pre> */}
  //       <Link to="/" className="font-semibold !underline" prefetch="render">
  //         Back to home
  //       </Link>
  //     </div>
  //   </Document>
  // );
};
