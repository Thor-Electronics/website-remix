// import { PassThrough } from "stream"
// import type { EntryContext } from "@remix-run/node"
// import { Response } from "@remix-run/node"
import type { EntryContext } from "@remix-run/cloudflare"
import { RemixServer } from "@remix-run/react"
import { renderToString } from "react-dom/server"
// import { renderToPipeableStream } from "react-dom/server"
import { getEnv } from "./env.server"

const ABORT_DELAY = 5000
global.ENV = getEnv()

// https://www.jacobparis.com/guides/cloudflare-remix#workers-environment-variables
// global process = {
//   env: global
// }

/* =-=-=-=-=-=-=-= CLOUDFLARE PAGES =-=-=-=-=-=-=-= */
export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  )

  responseHeaders.set("Content-Type", "text/html")

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  })
}

/* =-=-=-=-=-=-=-= REMIX APP SERVER =-=-=-=-=-=-=-= */
// export default function handleRequest(
//   request: Request,
//   responseStatusCode: number,
//   responseHeaders: Headers,
//   remixContext: EntryContext
// ) {
//   return new Promise((resolve, reject) => {
//     let didError = false

//     const { pipe, abort } = renderToPipeableStream(
//       <RemixServer context={remixContext} url={request.url} />,
//       {
//         onShellReady: () => {
//           const body = new PassThrough()

//           responseHeaders.set("Content-Type", "text/html")

//           resolve(
//             new Response(body, {
//               headers: responseHeaders,
//               status: didError ? 500 : responseStatusCode,
//             })
//           )

//           pipe(body)
//         },
//         onShellError: err => {
//           reject(err)
//         },
//         onError: error => {
//           didError = true

//           console.error(error)
//         },
//       }
//     )

//     setTimeout(abort, ABORT_DELAY)
//   })
// }
