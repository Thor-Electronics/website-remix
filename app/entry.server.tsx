import { PassThrough } from "stream";
import type { EntryContext } from "@remix-run/node";
import { Response } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { renderToPipeableStream } from "react-dom/server";
import { getEnv } from "./env.server";
import * as Sentry from "@sentry/remix";
// import { db } from "~/utils/db.server";

const ABORT_DELAY = 5000;
global.ENV = getEnv();

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: "https://37a5adf4b6d14259bcd4155027edd51a:120d9ea3f6cb44f4b5f8490855ab2d9b@o4505130372890624.ingest.sentry.io/4505130381410304",
    // integrations: [new Sentry.Integrations.Prisma({ client: db })],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  });
}

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  return new Promise((resolve, reject) => {
    let didError = false;

    const { pipe, abort } = renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        onShellReady: () => {
          const body = new PassThrough();

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError: (err) => {
          reject(err);
        },
        onError: (error) => {
          didError = true;

          console.error(error);
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
