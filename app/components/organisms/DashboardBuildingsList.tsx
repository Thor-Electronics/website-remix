import { Link } from "@remix-run/react"
import { Building } from "~/types/Building"
import { TextButton } from "../atoms/Button"
import { BuildingCard } from "../molecules/BuildingCard"

type Props = {
  items: Building[]
}

export const DashboardBuildingsList = ({ items: buildings }: Props) => (
  <div className="DashboardBuildingsList flex flex-row gap-2 p-2 //flex-col items-stretch justify-center w-full overflow-x-auto flex-nowrap">
    {buildings?.map(b => (
      <Link to={b.id} key={b.id}>
        <BuildingCard data={b} size={1} />
      </Link>
    ))}
    <Link to="./new">
      <TextButton className="building bg-primary h-full rounded-lg shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M4 16.5v-13h-.25a.75.75 0 010-1.5h12.5a.75.75 0 010 1.5H16v13h.25a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75v-2.5a.75.75 0 00-.75-.75h-2.5a.75.75 0 00-.75.75v2.5a.75.75 0 01-.75.75h-3.5a.75.75 0 010-1.5H4zm3-11a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1zM7.5 9a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-1zM11 5.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1zm.5 3.5a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-1z"
            clipRule="evenodd"
          />
        </svg>
        Create New Building
      </TextButton>
    </Link>
  </div>
)
