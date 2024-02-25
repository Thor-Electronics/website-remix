import { CpuChipIcon, UserIcon } from "@heroicons/react/24/solid";
import { Tooltip } from "@mui/material";
import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import OnlinePulse from "~/components/atoms/Pulse";
import { requireSessionToken } from "~/models/session.server";
import { EventLog, parseEventLog } from "~/types/EventLog";
import { parseHubContainer, parseClient } from "~/types/Hub";
import type { Client, HubContainer } from "~/types/Hub";
import { Message, Signal } from "~/types/Message";
import { adminGetNetwork } from "~/utils/core.server";

type LoaderData = {
  hubs: HubContainer[];
  socketToken: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const token = await requireSessionToken(request);
  const { hubs } = await adminGetNetwork(token);
  return json<LoaderData>({
    hubs: hubs.map((h: any) => parseHubContainer(h)),
    socketToken: token,
  });
};

export const AdminNetwork = () => {
  const { hubs, socketToken } = useLoaderData<LoaderData>();
  const [logs, setLogs] = useState<EventLog<Message>[]>([]);
  const { sendJsonMessage, sendMessage, readyState } = useWebSocket(
    `${process.env.NODE_ENV === "production" ? "wss" : "ws"}://${
      ENV.CORE_ADDR
    }/api/v1/admin/network/logs`,
    {
      onOpen: e => {
        console.log(`Supervision WS Connected: `, e);
        const authSignal: Message = {
          signal: Signal.AUTHENTICATE,
          payload: {
            token: socketToken,
          },
          id: "",
        };
        sendMessage(JSON.stringify(authSignal));
        console.log(`Sent the authentication signal with payload`);
      },
      onClose: e => console.warn("Supervision WS Closed: ", e),
      onError: e => console.warn("Supervision WS Error: ", e),
      onMessage: e => {
        const msg = JSON.parse(e.data) as Message;
        if (msg.message) {
          console.log(`🔽 MESSAGE: `, msg.message);
        }
        if (msg.signal) {
          console.log(`📡 SIGNAL: `, msg.signal);

          /* Initial Data */
          if (msg.signal === Signal.INITIAL_DATA) {
            setLogs(() =>
              msg.payload && Array.isArray(msg.payload)
                ? msg.payload.map((log: EventLog<Message>) =>
                    parseEventLog(log)
                  )
                : []
            );
          }

          /* Refresh Latencies */
          if (msg.signal === Signal.REFRESH_LATENCIES) {
            if (!msg.payload) return;
            if (msg.payload.devices) {
              // setGroup(prev => ({
              //   ...prev,
              //   devices: prev.devices?.map(d =>
              //     d.id in msg.payload?.devices!
              //       ? { ...d, latency: msg.payload?.devices![d.id] }
              //       : d
              //   ),
              // }));
            }
          }
        }
      },
      share: true,
      shouldReconnect: e => true,
    }
  );

  const connectionStatus = WS_STATUS_BADGES[readyState];
  const connected = readyState === ReadyState.OPEN;

  return (
    <div className="hubs">
      {hubs.map(h => (
        <div
          className="HubContainer card font-mono text-xs flex flex-col gap-2"
          key={h.name}
        >
          <h4 className="text-lg font-semibold flex items-center gap-2">
            {h.name}
            <span
              className={`status text-xs px-2 py-0.5 rounded-full
            text-white shadow-md ${connectionStatus.className}`}
            >
              {connectionStatus.text}
            </span>
            {connected && <OnlinePulse />}
          </h4>
          <div
            className="logs flex flex-col gap-1 font-mono text-xs
              bg-slate-700 dark:bg-slate-900 text-slate-500
              dark:text-slate-700 p-3 rounded-lg"
          >
            {logs.map(l => (
              <div key={l.time?.toUTCString()}>{l.text}</div>
            ))}
            Some text
          </div>
          <div className="flex gap-2 flex-wrap">
            {h.deviceHubs.map(dh => (
              <Tooltip
                title={<div>Group ID: {dh.groupId}</div>}
                key={dh.groupId}
              >
                <div className="DeviceHub card !p-3 !bg-slate-300 dark:!bg-slate-700 flex flex-col gap-1">
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

export const WS_STATUS_BADGES = {
  [ReadyState.CONNECTING]: {
    text: "Connecting",
    className: "bg-orange-500 shadow-orange-300 dark:shadow-orange-700",
  },
  [ReadyState.OPEN]: {
    text: "Connected",
    className: "bg-green-500 shadow-green-300 dark:shadow-green-700",
  },
  [ReadyState.CLOSING]: {
    text: "Disconnecting",
    className: "bg-rose-500 shadow-rose-300 dark:shadow-rose-700",
  },
  [ReadyState.CLOSED]: {
    text: "Disconnected",
    className: "bg-slate-800 shadow-slate-300 dark:shadow-slate-700",
  },
  [ReadyState.UNINSTANTIATED]: {
    text: "Uninstantiated",
    className: "bg-red-500",
  },
};
