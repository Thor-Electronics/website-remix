import {
  CpuChipIcon,
  CurrencyDollarIcon,
  HomeModernIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid"
import { json, type LoaderFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import DashboardCard from "~/components/molecules/DashboardCard"
import { requireUser, type User } from "~/models/session.server"

type LoaderData = {
  user: User
  totalUsers: number
  totalBuildings: number
  totalDevices: number
  totalRevenue: number
  latestOTAUpdates: {
    date: Date
    size: number // bytes
    title: string
    description: string
  }[] // 3 of them
  // revenue: {
  //   week: number
  //   month: number
  //   season: number
  //   year: number
  //   total: number
  // }
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request)
  return json<LoaderData>({
    user,
    totalUsers: 45157,
    totalBuildings: 97461,
    totalDevices: 324819,
    totalRevenue: 9900000000,
    latestOTAUpdates: [
      {
        date: new Date(),
        size: 86.1 * 1024,
        title: "Norouz",
        description: "Start 1402 with new Thor Electronics AI",
      },
      {
        date: new Date(),
        size: 86.1 * 1024,
        title: "Norouz",
        description: "Start 1402 with new Thor Electronics AI",
      },
    ],
  })
}

export const SuperAdminIndex = () => {
  const {
    user,
    totalUsers,
    totalBuildings,
    totalDevices,
    totalRevenue,
    latestOTAUpdates,
  } = useLoaderData<LoaderData>() // <typeof loader>

  const cards = [
    {
      color: "indigo",
      icon: <UserGroupIcon />,
      title: "Users",
      text: totalUsers.toLocaleString(),
    },
    {
      color: "sky",
      icon: <HomeModernIcon />,
      title: "Buildings",
      text: totalBuildings.toLocaleString(),
    },
    {
      color: "pink",
      icon: <CpuChipIcon />,
      title: "Devices",
      text: totalDevices.toLocaleString(),
    },
    {
      color: "teal",
      icon: <CurrencyDollarIcon />,
      title: "Revenue",
      text: "$" + totalRevenue.toLocaleString(),
    },
  ]
  return (
    <div className="SuperAdminIndex">
      <h2 className="title font-black font-serif text-3xl text-center mb-4">
        Super Admin
      </h2>
      <div className="cards flex flex-wrap gap-2">
        {cards.map(c => (
          <DashboardCard
            key={c.title}
            className={`bg-gradient-to-br from-${c.color}-500 to-${c.color}-700 text-white`}
            icon={c.icon}
            heroTitle={c.title}
          >
            <span className="text-xl">{c.text}</span>
            {/* <p className="text-sm">Total Revenue</p> */}
          </DashboardCard>
        ))}
      </div>
    </div>
  )
}

export default SuperAdminIndex
