import {
  Cog6ToothIcon,
  BuildingOffice2Icon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  CpuChipIcon,
} from "@heroicons/react/24/solid";
import type { LoaderFunction, LinksFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Link,
  Outlet,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
  useRouteLoaderData,
} from "@remix-run/react";
import { Copyright } from "~/components/atoms/Copyright";
import { LogoIcon } from "~/components/atoms/LogoIcon";
import type { FixedNavItem } from "~/components/organisms/FixedNav";
import { DashboardNav } from "~/components/organisms/DashboardNav";
import { requireSessionToken, requireUser } from "~/models/session.server";
import dashboardStyles from "../../styles/dashboard.css";
import type { User } from "~/types/User";
import type { ErrorBoundaryComponent } from "@remix-run/react/dist/routeModules";
import api from "~/utils/core.server";
import type { Device } from "~/types/Device";
import Maintenance from "~/components/organisms/Maintenance";

export const DASHBOARD_PREFIX = "/app";

type LoaderData = {
  user: User;
  orphanDevices: Device[];
  token: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const token = await requireSessionToken(request);
  const user = await requireUser(request); // todo: optimize it by getting the token once? or getAuth to get both token and user?

  // if the user needs to verify their phone number
  // if (user.phone && (user.phoneVerifiedAt?.getTime() || 0) <= 1) {
  //   console.log(
  //     `User ${user.phone}(${user.name}) need to verify their phone. Redirecting them...`
  //   );
  //   console.log(
  //     `Sending phone verification ${user.name}(${user.phone}) ${user.phone}...`
  //   );
  //   return await api
  //     .sendPhoneVerification(token)
  //     .then(async (res) => {
  //       const { message } = res.data;
  //       console.log(`Sent phone verification code: `, message);
  //       return redirect("/verify-phone");
  //     })
  //     .catch((err) => {
  //       console.error(
  //         "Failed to send verification code: ",
  //         err.response?.data?.message ||
  //           err.response?.data ||
  //           err.response ||
  //           err
  //       );
  //       return json(
  //         { error: err.message || err.response?.data?.message },
  //         err.response?.status
  //       );
  //     });
  //   // POST /send-phone-verification
  //   // const url = new URL(request.url);
  //   // return fetch(`${url.origin}/send-phone-verification`, {
  //   //   method: "POST",
  //   //   headers: { Authorization: `Bearer ${token}` },
  //   // });
  // }

  // console.log(`app.tsx -- ${user.name}(${user.id}) is using the app`)
  const orphanDevices = await api
    .getOrphanDevices(token)
    .then((data) => data)
    .catch((err) => {
      console.error("Error fetching orphan devices: ", err);
      return [];
    });
  return json<LoaderData>({ user, orphanDevices, token });
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: dashboardStyles },
];

export const Dashboard = () => {
  const { user, orphanDevices } = useLoaderData<LoaderData>();

  const navItems = initialUserNavItems;
  if (
    orphanDevices.length !== 0 &&
    navItems.indexOf(orphanDeviceNavItem) === -1
  ) {
    navItems.push(orphanDeviceNavItem);
  }

  return (
    <div
      className="Dashboard bg-slate-200 dark:bg-slate-900
      min-h-screen p-2 relative pb-20 sm:pb-2 sm:pt-28 xl:pt-2
      xl:pl-36"
    >
      <DashboardNav user={user as User} items={navItems} />
      <Maintenance />
      <Outlet />
      <Copyright />
    </div>
  );
};

export const ErrorBoundary: ErrorBoundaryComponent = () => {
  const err = useRouteError();
  // console.warn("app.tsx error in dashboard: ", err);

  let title: string = "Oops!";
  let msg: string = "Something went wrong!";
  const isErrResponse = isRouteErrorResponse(err);
  const isRuntimeError = err instanceof Error;

  if (isErrResponse) {
    console.warn(
      `[ERROR-RESPONSE] app.tsx(${err.status}): ${JSON.stringify(err.data)}`
    );
    title = "Oops!";
    msg = `${err.status} | ${err.statusText} | ${err.data.text}`;
  } else if (isRuntimeError) {
    console.warn(`[ERROR-RUNTIME] app.tsx(${err.message}): `, err.stack);
    title = "Runtime Error!";
    msg = err.message;
  } else {
    console.warn(`[ERROR-UNKNOWN] app.tsx: `, err);
    title = "Unknown Error!";
    msg = "There was an unknown error happened during client-side operations!";
  }

  return (
    <div
      className="h-screen bg-rose-100 dark:bg-stone-900
      shadow-lg text-rose-600 dark:text-rose-400 p-4 flex
      items-center justify-center flex-col"
    >
      <LogoIcon className="w-24" />
      <h1 className="text-lg font-bold mb-4">Error Loading Dashboard!</h1>
      <p className="font-lg font-semibold">{title}</p>
      <p className="error">
        Something happened when we tried to show your dashboard. {msg}
      </p>
      <Link
        to={DASHBOARD_PREFIX}
        className="font-semibold !underline"
        prefetch="render"
      >
        Back to the app
      </Link>
    </div>
  );
};

export const useAppLoaderData = () =>
  useRouteLoaderData("routes/app") as LoaderData;

const iconClassNames = "w-8 h-8";
const orphanDeviceNavItem = {
  icon: <CpuChipIcon className={iconClassNames} />,
  label: "Devices",
  to: `${DASHBOARD_PREFIX}/orphan-devices`,
  props: {
    className: "!bg-orange-100 dark:!bg-slate-700 !text-orange-400",
  },
};
const initialUserNavItems: FixedNavItem[] = [
  {
    icon: <LogoIcon className={iconClassNames} />,
    label: "Dashboard",
    to: `${DASHBOARD_PREFIX}/`,
  },
  {
    icon: <BuildingOffice2Icon className={iconClassNames} />,
    label: "Groups",
    to: `${DASHBOARD_PREFIX}/groups`,
  },
  // {
  //   icon: <IoCarSport className={iconClassNames} />,
  //   label: "Vehicles",
  //   to: `${DASHBOARD_PREFIX}/vehicles`,
  // },
  {
    icon: <Cog6ToothIcon className={iconClassNames} />,
    label: "Settings",
    to: `${DASHBOARD_PREFIX}/settings`,
  },
  {
    icon: <UserCircleIcon className={iconClassNames} />,
    label: "Account",
    to: `${DASHBOARD_PREFIX}/profile`,
  },
  {
    icon: <ArrowRightOnRectangleIcon className={iconClassNames} />,
    label: "Logout",
    to: `/logout`,
    props: {
      className:
        "!bg-rose-100 dark:!bg-slate-700 !text-rose-500 dark:!text-rose-400",
    },
  },
];

export default Dashboard;
