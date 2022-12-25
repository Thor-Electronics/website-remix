import { RemixBrowser } from "@remix-run/react"
// import { hydrateRoot } from "react-dom/client"; // REMIX APP SERVER
import { hydrate } from "react-dom"

/* CLOUDFLARE PAGES */
hydrate(<RemixBrowser />, document)

/* REMIX APP SERVER */
// hydrateRoot(document, <RemixBrowser />);
