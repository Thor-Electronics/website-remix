import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Outlet,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { ErrorBoundaryComponent } from "@remix-run/react/dist/routeModules";
import { DashboardGroupsList } from "~/components/organisms/DashboardGroupsList";
import { requireSessionToken } from "~/models/session.server";
import type { Group } from "~/types/Group";
import api from "~/utils/core.server";

type LoaderData = {
  groups: Group[];
};

export const loader: LoaderFunction = async ({ request }) => {
  console.log("app.groups.tsx -- SessionToken, UserGroups");
  return json<LoaderData>({
    groups: await api.getUserGroups(await requireSessionToken(request)),
  });
};

export const DashboardGroups = () => {
  const { groups } = useLoaderData<LoaderData>();
  return (
    <div className="DashboardGroups">
      <h1 className="title text-center font-bold">Groups</h1>
      <DashboardGroupsList items={groups as Group[]} />
      <Outlet />
    </div>
  );
};

export const ErrorBoundary: ErrorBoundaryComponent = () => {
  const err = useRouteError();
  // console.error("app.groups.tsx error in groups: ", err);

  let title: string = "Oops!";
  let msg: string = "Something went wrong!";
  const isErrResponse = isRouteErrorResponse(err);
  const isRuntimeError = err instanceof Error;

  if (isErrResponse) {
    console.warn(
      `[ERROR-RESPONSE] app.groups.tsx(${err.status}): ${JSON.stringify(
        err.data
      )}`
    );
    title = "Oops!";
    msg = `${err.status} | ${err.statusText} | ${err.data.text}`;
  } else if (isRuntimeError) {
    console.warn(`[ERROR-RUNTIME] app.groups.tsx(${err.message}): `, err.stack);
    title = "Runtime Error!";
    msg = err.message;
  } else {
    console.warn(`[ERROR-UNKNOWN] app.groups.tsx: `, err);
    title = "Unknown Error!";
    msg = "There was an unknown error happened during client-side operations!";
  }

  return (
    <div
      className="DashboardGroups bg-rose-200 dark:bg-rose-800
      shadow-lg text-rose-600 dark:text-rose-400 p-4 rounded-xl"
    >
      <h1 className="text-lg font-bold mb-4">Error Loading Groups!</h1>
      <p className="font-lg font-semibold">{title}</p>
      <p className="error">
        Something happened when we tried to show you the groups. {msg}
      </p>
    </div>
  );
};

export default DashboardGroups;
