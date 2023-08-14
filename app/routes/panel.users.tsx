import { BuildingOffice2Icon, NoSymbolIcon } from "@heroicons/react/24/outline";
import { CpuChipIcon } from "@heroicons/react/20/solid";
import { Tooltip } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireSessionToken } from "~/models/session.server";
import type { Device } from "~/types/Device";
import type { Group } from "~/types/Group";
import { type User } from "~/types/User";
import api from "~/utils/core.server";
import { timeAgo } from "~/utils/time";

type LoaderData = {
  users: User[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const users = await api.adminGetUsers(await requireSessionToken(request));
  return json<LoaderData>({ users });
};

export const AdminUsers = () => {
  const { users } = useLoaderData<LoaderData>(); // <typeof loader>

  console.log("USERS: ", users);

  return (
    <div className="AdminUsers admin-page">
      <h2 className="page-title">User Management</h2>
      <div className="data-container">
        <DataGrid
          rows={users}
          columns={gridColumns}
          autoHeight
          checkboxSelection
          isRowSelectable={() => true}
        />
      </div>
    </div>
  );
};

const gridColumns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    width: 200,
    cellClassName: "text-xs font-mono",
  },
  { field: "name", headerName: "Name", width: 200 },
  { field: "email", headerName: "Email", width: 300 },
  { field: "phone", headerName: "Phone", width: 150 },
  { field: "username", headerName: "Username", width: 150 },
  {
    field: "groups",
    headerName: "Groups",
    width: 75,
    renderCell: ({ row }) => {
      return row.groups ? (
        <Tooltip
          title={
            <div className="font-mono">
              {row.groups.map((g: Group) => (
                <div key={g.id} title={g.id}>
                  {g.name}
                </div>
              ))}
            </div>
          }
        >
          <div className="flex items-center justify-center gap-1 overflow-ellipsis text-sky-700">
            <BuildingOffice2Icon className="w-4 h-4" />
            {row.groupCount || row.groups?.length}
          </div>
        </Tooltip>
      ) : (
        <div>
          <Tooltip title="No Groups Found">
            {/* <XCircleIcon className="w-6 h-6 text-slate-300" /> */}
            <NoSymbolIcon className="w-6 h-6 text-slate-400" />
          </Tooltip>
        </div>
      );
    },
  },
  {
    field: "devices",
    headerName: "Devices",
    width: 75,
    renderCell: ({ row }) => {
      return row.devices ? (
        <Tooltip
          title={
            <div className="font-mono">
              {row.devices.map((d: Device) => (
                <div key={d.id} title={d.id}>
                  {d.name}({d.type}){/* -{d.chip} */}
                </div>
              ))}
            </div>
          }
        >
          <div className="text-xs flex items-center justify-center gap-1 overflow-ellipsis text-sky-700">
            <CpuChipIcon className="w-5 h-5" />
            {row.deviceCount || row.devices?.length}
          </div>
        </Tooltip>
      ) : (
        <div>
          <Tooltip title="No Devices Found">
            {/* <XCircleIcon className="w-6 h-6 text-slate-300" /> */}
            <NoSymbolIcon className="w-6 h-6 text-slate-400" />
          </Tooltip>
        </div>
      );
    },
  },
  {
    field: "created_at",
    headerName: "Join Date",
    width: 125,
    valueGetter: (params) => timeAgo(new Date(params.value)),
  },
  {
    field: "updated_at",
    headerName: "Last Acc Update",
    width: 125,
    // headerAlign: "center",
    // align: "center",
    valueGetter: (params) => timeAgo(new Date(params.value)),
  },
];

export default AdminUsers;
