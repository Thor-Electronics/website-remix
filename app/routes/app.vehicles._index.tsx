import { redirect, type LoaderFunction } from "@remix-run/node"

export const loader: LoaderFunction = async ({ request }) => {
  return redirect("0")
}

export default function DashboardVehiclesIndex() {
  return "You can see the list of your vehicles and manage them by selecting them"
}
