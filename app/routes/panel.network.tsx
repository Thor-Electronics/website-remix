import { CpuChipIcon, UserIcon } from "@heroicons/react/24/solid";
import { Tooltip } from "@mui/material";
import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireSessionToken } from "~/models/session.server";
import { parseHubContainer, parseClient } from "~/types/Hub";
import type { Client, HubContainer } from "~/types/Hub";
import { adminGetNetwork } from "~/utils/core.server";

type LoaderData = {
  hubs: HubContainer[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const { hubs } = await adminGetNetwork(await requireSessionToken(request));
  return json<LoaderData>({
    hubs: hubs.map((h: any) => parseHubContainer(h)),
  });
};

export const AdminNetwork = () => {
  const { hubs } = useLoaderData<LoaderData>();
  return (
    <div>
      {hubs.map(h => (
        <div className="HubContainer card font-mono text-xs" key={h.name}>
          <h4 className="text-lg font-semibold">{h.name}</h4>
          <div className="flex gap-2 flex-wrap">
            {h.deviceHubs.map(dh => (
              <Tooltip
                title={<div>Group ID: {dh.groupId}</div>}
                key={dh.groupId}
              >
                <div className="DeviceHub card !p-3 !bg-slate-700 flex flex-col gap-1">
                  {dh.name}
                  <div className="clients flex gap-1">
                    {dh.userClients.map(uc => (
                      <ClientComponent
                        data={parseClient(uc)}
                        key={uc.groupId}
                      />
                    ))}
                    {dh.deviceClients.map(dc => (
                      <ClientComponent
                        data={parseClient(dc)}
                        key={dc.groupId}
                      />
                    ))}
                  </div>
                </div>
              </Tooltip>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminNetwork;

type ClientProps = {
  data: Client;
  className?: string;
};
export function ClientComponent({ data: c, ...props }: ClientProps) {
  const ClientIcon = c.type === "device" ? CpuChipIcon : UserIcon;

  return (
    <Tooltip
      title={
        <div className="">
          <div className="text-slate-500 dark:text-slate-400">
            ID: {(c.device ?? c.user)!.id}
          </div>
          <div className="text-blue-500 dark:text-blue-400">IP: {c.ip}</div>
        </div>
      }
    >
      <div
        className="card !p-1 !rounded flex items-center justify-center gap-1"
        {...props}
      >
        <span className="text-green-400 dark:text-green-300">
          <ClientIcon className="w-4 h-4" />
        </span>
        <span className="text-slate-500 dark:text-slate-400">
          {(c.device ?? c.user)!.name}
        </span>
        <span className="text-rose-400 dark:text-rose-300">
          {(c.latency / 1000).toLocaleString()}µs
        </span>
      </div>
    </Tooltip>
  );
}
