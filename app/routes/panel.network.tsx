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
  console.log("HUBS: ", hubs);
  return json<LoaderData>({
    hubs: hubs.map((h: any) => parseHubContainer(h)),
  });
};

export const AdminInvoices = () => {
  const { hubs } = useLoaderData<LoaderData>();
  return (
    <div>
      {hubs.map((h) => (
        <div className="HubContainer card font-mono" key={h.name}>
          <h4 className="text-lg font-semibold">{h.name}</h4>
          <div className="flex gap-2 flex-wrap">
            {h.deviceHubs.map((dh) => (
              <div
                className="DeviceHub card border border-red-400
                  dark:border-red-600 flex flex-col gap-1"
                key={dh.groupId}
              >
                {dh.name}
                {dh.groupId}
                <div className="clients flex gap-1">
                  {dh.userClients.map((uc) => (
                    <ClientComponent data={parseClient(uc)} key={uc.groupId} />
                  ))}
                  {dh.deviceClients.map((dc) => (
                    <ClientComponent data={parseClient(dc)} key={dc.groupId} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminInvoices;

type ClientProps = {
  data: Client;
  className?: string;
};
export function ClientComponent({ data: c, ...props }: ClientProps) {
  return (
    <div className="card border border-blue-500 flex gap-1" {...props}>
      <span className="text-green-500 dark:text-green-400">{c.type}</span>
      <span className="text-slate-500 dark:text-slate-400">
        {(c.device ?? c.user)!.name}
      </span>
      <span className="text-slate-500 dark:text-slate-400">
        {(c.device ?? c.user)!.id}
      </span>
      <span className="text-blue-500 dark:text-blue-400">{c.ip}</span>
      <span className="text-red-500 dark:text-red-400">
        {c.latency.toLocaleString()}ns
      </span>
      {/* µ */}
    </div>
  );
}
