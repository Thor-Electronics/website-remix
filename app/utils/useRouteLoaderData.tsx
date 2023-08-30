import { useMatches } from "@remix-run/react"
import { useMemo } from "react"
import invariant from "tiny-invariant"

// inspired by:
// https://www.wking.dev/library/remix-route-helpers-a-better-way-to-use-parent-data
// https://jankraus.net/2022/04/16/access-remix-route-data-in-other-routes/
// But it seems that remix has a utility exactly like this :)

export default function useRouteLoaderData<T>(routeId: string): T {
  const matches = useMatches()
  const match = useMemo(
    () => matches.find(match => match.id === routeId),
    [matches, routeId]
  )
  invariant(match, `Unable to find route loader data for ${routeId}`)
  return match.data as T
}
