import type { LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { getSessionToken } from "~/models/session.server"
import type { Group } from "~/types/Group"
import { getUserGroups } from "~/utils/core.server"

type LoaderData = {
  vehicles: Group[]
}

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    vehicles: (
      (await getUserGroups(await getSessionToken(request))) as Group[]
    ).map(g => g), // TODO: filter groups by their types. Only vehicles
  })
}
