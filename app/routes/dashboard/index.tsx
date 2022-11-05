import { json, LoaderFunction } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import Button from "~/components/atoms/Button"
import { getSessionData } from "~/models/session.server"
import { Building } from "~/types/Building"
import { getUserBuildings } from "~/utils/core.server"

// type LoaderData = {
//   navItems: object[]
//   // buildings: object
// }

// export const loader: LoaderFunction = async ({ request }) => {
//   return json<LoaderData>({
//     buildings: await getUserBuildings((await getSessionData(request)).token),
//   })
// }

export const DashboardIndex = () => {
  // const { buildings } = useLoaderData<LoaderData>()
  return (
    <div className="DashboardIndex text-center">Welcome to the dashboard!</div>
  )
}

export default DashboardIndex
