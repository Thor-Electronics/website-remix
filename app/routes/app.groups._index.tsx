import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { requireSessionToken } from "~/models/session.server";
import type { Group } from "~/types/Group";
import api from "~/utils/core.server";

export const loader: LoaderFunction = async ({ request }) => {
  const groups = await api.getUserGroups(await requireSessionToken(request));
  if (groups.length === 0) return redirect("new");
  // if (groups.length === 1)
  return redirect((groups as Group[])[0].id);
};

export const DashboardGroupsIndex = () => {
  return (
    <div className="DashboardGroupsIndex">
      <p className="italic text-center">
        You can see the list of your groups and manage them by selecting them
      </p>
    </div>
  );
};

export default DashboardGroupsIndex;
