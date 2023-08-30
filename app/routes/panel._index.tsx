import {
  CpuChipIcon,
  CurrencyDollarIcon,
  HomeModernIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import DashboardCard from "~/components/molecules/DashboardCard";
import { requireSessionToken } from "~/models/session.server";
import { type User } from "~/types/User";
import api from "~/utils/core.server";

type LoaderData = {
  user: User;
  users: { count: number; online: number; grouped: number };
  groups: { count: number; online: number };
  devices: { count: number; online: number; verified: number };
  totalRevenue: number;
  latestOTAUpdates: {
    date: Date;
    size: number; // bytes
    title: string;
    description: string;
  }[]; // 3 of them
  // revenue: {
  //   week: number
  //   month: number
  //   season: number
  //   year: number
  //   total: number
  // }
};

export const loader: LoaderFunction = async ({ request }) => {
  const { user: u, dashboard: d } = await api.adminGetInitialData(
    await requireSessionToken(request)
  );
  return json<LoaderData>({
    user: u,
    users: {
      count: d.users.count,
      online: d.users.online,
      grouped: d.users.grouped,
    },
    groups: { count: d.groups.count, online: d.groups.online },
    devices: {
      count: d.devices.count,
      online: d.devices.online,
      verified: d.devices.verified,
    },
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
  });
};

export const AdminIndex = () => {
  const { user, users, groups, devices, totalRevenue, latestOTAUpdates } =
    useLoaderData<LoaderData>(); // <typeof loader>

  const cards = [
    {
      color: "indigo",
      icon: <UserGroupIcon />,
      title: "Users",
      text: `${users.count.toLocaleString()}(${users.online.toLocaleString()})`,
    },
    {
      color: "sky",
      icon: <HomeModernIcon />,
      title: "Groups",
      text: `${groups.count.toLocaleString()}(${groups.online.toLocaleString()})`,
    },
    {
      color: "pink",
      icon: <CpuChipIcon />,
      title: "Devices",
      text: `${devices.count.toLocaleString()}(${devices.online.toLocaleString()})`,
    },
    {
      color: "teal",
      icon: <CurrencyDollarIcon />,
      title: "Revenue",
      text: "$" + totalRevenue.toLocaleString(),
    },
  ];
  return (
    <div className="AdminIndex">
      <h2 className="title font-black font-serif text-3xl text-center mb-4">
        {false ? "Super Admin" : "Admin"}
      </h2>
      <div className="cards flex flex-wrap gap-2">
        <div className="fake-div-to-generate-colors hidden from-indigo-400 to-indigo-600 from-sky-400 to-sky-600 from-pink-400 to-pink-600 from-teal-400 to-teal-600"></div>
        {cards.map((c) => (
          <DashboardCard
            key={c.title}
            className={`bg-gradient-to-br from-${c.color}-400 to-${c.color}-600 text-white`}
            icon={c.icon}
            heroTitle={c.title}
          >
            <span className="text-xl">{c.text}</span>
            {/* <p className="text-sm">Total Revenue</p> */}
          </DashboardCard>
        ))}
      </div>
      <p className="text-center my-4">
        Welcome {user.name}({user.roles?.at(0)?.name})
      </p>
      <div className="fw-updates flex flex-col gap-2">
        {latestOTAUpdates.map((obj) => (
          <div key={obj.title} className="text-xs font-mono card">
            {obj.title} - {obj.size} - {obj.date} - {obj.description}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminIndex;
