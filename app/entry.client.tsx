import { loadServiceWorker } from "@remix-pwa/sw";
import { RemixBrowser, useLocation, useMatches } from "@remix-run/react";
import { hydrateRoot } from "react-dom/client";
import * as Sentry from "@sentry/remix";
import { useEffect } from "react";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: "https://37a5adf4b6d14259bcd4155027edd51a:120d9ea3f6cb44f4b5f8490855ab2d9b@o4505130372890624.ingest.sentry.io/4505130381410304",
    integrations: [
      new Sentry.BrowserTracing({
        routingInstrumentation: Sentry.remixRouterInstrumentation(
          useEffect,
          useLocation,
          useMatches
        ),
      }),
      new Sentry.Replay(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
}

hydrateRoot(document, <RemixBrowser />);

loadServiceWorker({ serviceWorkerUrl: "/entry.workbox.js" });
