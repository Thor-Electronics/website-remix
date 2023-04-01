import { BuildingOfficeIcon, HomeModernIcon } from "@heroicons/react/24/solid"
import { Link } from "@remix-run/react"
import type { Building } from "~/types/Building"
import { TextButton } from "../atoms/Button"

type Props = {
  items: Building[]
}

export const DashboardBuildingsList = ({ items: buildings }: Props) => (
  <div
    className="DashboardBuildingsList flex flex-row gap-2 pt-2 pb-3
      w-full overflow-x-auto flex-nowrap"
  >
    {buildings?.map(b => (
      <Link
        to={b.id}
        key={b.id}
        className="card flex-grow flex items-center justify-center
          gap-2 text-center whitespace-nowrap text-slate-700 font-semibold"
        prefetch="render"
      >
        <HomeModernIcon className="h-6 w-6" />
        {b.name}
      </Link>
    ))}
    <Link to="./new" prefetch="intent">
      <TextButton
        className="building bg-primary h-full rounded-lg
        shadow-lg whitespace-nowrap !bg-blue-500"
      >
        <BuildingOfficeIcon className="h-5 w-5" />
        Create New Building
      </TextButton>
    </Link>
  </div>
)
