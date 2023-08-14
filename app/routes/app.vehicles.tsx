import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import type { V2_ErrorBoundaryComponent } from "@remix-run/react/dist/routeModules";
import { DashboardGroupsList } from "~/components/organisms/DashboardGroupsList";
import { getSessionToken } from "~/models/session.server";
import { DeviceType } from "~/types/DeviceType";
import type { Group } from "~/types/Group";
import { getUserGroups } from "~/utils/core.server";

type LoaderData = {
  vehicles: Group[];
};

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    vehicles: [sampleVehicleGroup],
  });
  // return json<LoaderData>({
  //   vehicles: (
  //     (await getUserGroups(await getSessionToken(request))) as Group[]
  //   ).map(g => g), // TODO: filter groups by their types. Only vehicles
  // })
};

export const DashboardVehicles = () => {
  const { vehicles } = useLoaderData<LoaderData>();

  return (
    <div className="DashboardVehicles">
      <h1 className="title text-center font-bold">Smart Transportation</h1>
      <DashboardGroupsList items={vehicles as Group[]} />
      <Outlet />
    </div>
  );
};

export const ErrorBoundary: V2_ErrorBoundaryComponent = () => {
  const error = useRouteError();
  console.error("Error in vehicles: ", error);

  return (
    <div
      className="DashboardVehicles bg-rose-200 dark:bg-stone-900
      text-rose-600 dark:text-rose-400"
    >
      <h1>Something went wrong while showing the vehicles</h1>
    </div>
  );
};

export const sampleVehicle = {
  id: "fake_id",
  cpuId: "ECU_18328193140",
  name: "911 Turbo",
  groupId: "0",
  type: DeviceType.VEHICLE,
  state: {
    speed: 60, // KMpH
    rpm: 2000, // RPM
    fuel: 53, // %
    temperature: 73, // Celsius
    // lat:
    // long:
  },
  isOnline: true,
  latency: 16,
};

export const sampleVehicleGroup = {
  id: "0",
  name: "911 Turbo",
  userId: "",
  devices: [sampleVehicle],
};
