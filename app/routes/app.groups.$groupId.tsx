import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Outlet,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import type { ErrorBoundaryComponent } from "@remix-run/react/dist/routeModules";
import invariant from "tiny-invariant";
import { GroupCard } from "~/components/molecules/GroupCard";
import { requireSessionToken } from "~/models/session.server";
import type { Group } from "~/types/Group";
import api from "~/utils/core.server";

type LoaderData = {
  group: Group;
  socketToken: string;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  console.log("app.groups.$groupId.tsx -- SessionToken, GroupDetails");
  invariant(params.groupId, "Group not found");
  const token = await requireSessionToken(request);
  const group = await api
    .getGroupDetails(params.groupId, token)
    .catch((err) => {
      if (err.response?.status === 404) {
        throw new Response("Group Not Found", { status: 404 });
      }
    });
  // console.log("GROUP: ", group)
  return json<LoaderData>({ group, socketToken: token });
};

export const GroupDetails = () => {
  const { group, socketToken } = useLoaderData<LoaderData>();

  return (
    <div className="GroupDetails lg:max-w-6xl mx-auto">
      <GroupCard
        key={group.id}
        data={group as Group}
        socketToken={socketToken}
      />
      <Outlet />
    </div>
  );
};

export const ErrorBoundary: ErrorBoundaryComponent = () => {
  const err = useRouteError();
  // console.error("ap.groups.$groupId.tsx error in $groupId: ", err);

  let title: string = "Oops!";
  let msg: string = "Something went wrong!";
  const isErrResponse = isRouteErrorResponse(err);
  const isRuntimeError = err instanceof Error;

  if (isErrResponse) {
    console.warn(
      `[ERROR-RESPONSE] app.groups.$groupId.tsx(${
        err.status
      }): ${JSON.stringify(err.data)}`
    );
    title = "Oops!";
    msg = `${err.status} | ${err.statusText} | ${err.data.text}`;
    if (err.status === 404) {
      title = "Group Not Found!";
      msg = `We couldn't find the group you're looking for!`;
    }
  } else if (isRuntimeError) {
    console.warn(
      `[ERROR-RUNTIME] app.groups.$groupId.tsx(${err.message}): `,
      err.stack
    );
    title = "Runtime Error!";
    msg = err.message;
  } else {
    console.warn(`[ERROR-UNKNOWN] app.groups.$groupId.tsx: `, err);
    title = "Unknown Error!";
    msg = "There was an unknown error happened during client-side operations!";
  }

  return (
    <div
      className="GroupDetails bg-rose-100 dark:bg-rose-950
      shadow-lg text-rose-600 dark:text-rose-400 p-4 rounded-xl"
    >
      <h1 className="text-lg font-bold mb-4">Error Loading Group Details!</h1>
      <p className="font-lg font-semibold">{title}</p>
      <p className="error">
        Something happened when we tried to show you the group details. {msg}
      </p>
    </div>
  );
};

export default GroupDetails;
