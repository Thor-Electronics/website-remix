import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { GroupCard } from "~/components/molecules/GroupCard";
import { requireSessionToken, requireUser } from "~/models/session.server";
import type { Group } from "~/types/Group";
import { getGroupDetails, getUserGroups } from "~/utils/core.server";
import { DASHBOARD_PREFIX, useAppLoaderData } from "./app";
import { Alert } from "@mui/material";
import { TextButton } from "~/components/atoms/Button";

type LoaderData = {
  groups: Group[];
  socketToken: string;
  // userSettings
  group: Group;
};

export const loader: LoaderFunction = async ({ request }) => {
  // console.log("app._index.tsx -- SessionToken, UserGroups, GroupDetails")
  const token = await requireSessionToken(request);
  const user = await requireUser(request);
  const groups = await getUserGroups(token);
  if ((user.phoneVerifiedAt?.getTime() || 0) <= 1) {
    console.log(`Redirecting user ${user.id}(${user.phone}) to /verify-phone`);
    return redirect("/verify-phone");
  }
  if (groups?.length === 0) {
    console.log("User has no groups, redirecting to create page");
    return redirect(DASHBOARD_PREFIX + "/groups/new");
  }
  const group = await getGroupDetails((groups[0] as Group)?.id, token);
  return json<LoaderData>({
    groups,
    socketToken: token,
    group,
    // User Settings
    // group: await getGroupDetails(
    //   (
    //     await getUserGroups(await getSessionToken(request))
    //   )[0]?.id,
    //   await getSessionToken(request)
    // ),
  });
};

export const DashboardIndexRoute = () => {
  const { group, socketToken /*, group: b*/ } = useLoaderData<LoaderData>();
  // todo: Default group from user settings
  const { orphanDevices, token, user } = useAppLoaderData();

  return (
    <div className="DashboardIndex text-center">
      <h1 className="text-2xl font-bold mb-3 text-slate-400 dark:text-slate-600">
        Smart Home
      </h1>
      {orphanDevices.length !== 0 && (
        <Alert
          severity="warning"
          // variant="outlined"
          className="mb-4"
          action={
            <Link to="orphan-devices">
              <TextButton className="!bg-orange-500 dark:!bg-orange-400">
                Configure
              </TextButton>
            </Link>
          }
        >
          {/* <AlertTitle>Orphan Devices</AlertTitle> */}
          There{" "}
          {orphanDevices.length > 1
            ? `are ${orphanDevices.length} devices`
            : `is 1 device`}{" "}
          that {orphanDevices.length > 1 ? "are" : "is"} not connected to any
          building or group. Click here to assign{" "}
          {orphanDevices.length > 1 ? "them" : "it"} to a group to make{" "}
          {orphanDevices.length > 1 ? "them" : "it"} functional.
        </Alert>
      )}
      {group ? (
        <div className="sm:max-w-5xl sm:mx-auto">
          <GroupCard
            data={group as Group}
            socketToken={socketToken}
            className="dashboard-friendly"
          />
        </div>
      ) : (
        <p>You don't have any group yet! Create a new one in the groups page</p>
      )}
    </div>
  );
};

export default DashboardIndexRoute;
