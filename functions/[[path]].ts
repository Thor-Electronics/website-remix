// https://github.com/remix-run/remix/issues/1285#issuecomment-1015049691
// /functions/[[path]].ts
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages"

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as build from "../public/build"

const handleRequest = createPagesFunctionHandler({
  build,
  getLoadContext: context => context,
})

export const onRequest: PagesFunction = context => handleRequest(context)
