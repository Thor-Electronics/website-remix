import { ActionFunction, LoaderFunction, redirect } from "@remix-run/cloudflare"
import { logout } from "~/models/session.server"

export const action: ActionFunction = async ({ request }) => logout(request)

export const loader: LoaderFunction = async () => {
  return redirect("/")
}
