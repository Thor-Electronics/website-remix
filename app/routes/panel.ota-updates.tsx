import {
  CloudArrowDownIcon,
  FolderPlusIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import { json, type LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { VersionBadge } from "~/components/atoms/Badge";
import Button, { IconButton } from "~/components/atoms/Button";
import { getSessionToken } from "~/models/session.server";
import type { Firmware } from "~/types/Firmware";
import { DistChannel, refineFirmware } from "~/types/Firmware";
import readableFileSize from "~/utils/bytes";
import { adminGetFirmwares as adminGetFirmwareUpdates } from "~/utils/core.server";
import { timeAgo } from "~/utils/time";

type LoaderData = {
  // firmwareUpdates: {
  //   fileName: string;
  //   fileSize: string;
  //   modifiedAt: Date;
  // }[];
  firmwareUpdates: Firmware[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const fws = await adminGetFirmwareUpdates((await getSessionToken(request))!);
  return json<LoaderData>({ firmwareUpdates: fws });
};

export const AdminOTAUpdates = () => {
  const { firmwareUpdates: fws } = useLoaderData<LoaderData>(); // <typeof loader>

  // console.log("FIRMWARE: ", fws);
  const refinedFws = fws.map((f) => refineFirmware(f));
  console.log("REFINED FIRMWARE: ", refinedFws);

  return (
    <div className="AdminFirmwareUpdates admin-page">
      <h2 className="page-title">Firmware Updates(OTA)</h2>
      <Link to="new" prefetch="render">
        <Button className="!bg-primary py-1 px-3 shadow-blue-300 mb-4 mx-auto flex items-center gap-2.5">
          <FolderPlusIcon className="w-5 h-5" />
          Upload New Firmware
        </Button>
      </Link>
      <div className="data-container">
        {refinedFws.length > 0 && (
          <DataGrid
            rows={refinedFws}
            columns={gridColumns}
            autoHeight
            // checkboxSelection
            isRowSelectable={() => true}
          />
        )}
      </div>
    </div>
  );
};

const gridColumns: GridColDef[] = [
  {
    field: "actions",
    headerName: "Actions",
    renderCell: (params) => (
      <div className="actions flex gap-1">
        <Link to={`#`}>
          <IconButton className="!bg-rose-100 !text-rose-400 border border-rose-300">
            <TrashIcon className="w-4" />
          </IconButton>
        </Link>
        <Link to={`#`}>
          <IconButton className="!bg-blue-100 !text-blue-400 border border-blue-300">
            <CloudArrowDownIcon className="w-4" />
          </IconButton>
        </Link>
        <Link to={`#`}>
          <IconButton className="!bg-amber-100 !text-amber-400 border border-amber-300">
            <PencilIcon className="w-4" />
          </IconButton>
        </Link>
      </div>
    ),
  },
  {
    field: "id",
    headerName: "ID",
    width: 210,
    cellClassName: "text-xs font-mono",
  },
  {
    field: "chip",
    headerName: "Chip",
    width: 100,
  },
  {
    field: "deviceType",
    headerName: "D Type",
    width: 100,
  },
  {
    field: "version",
    headerName: "Version",
    align: "center",
    width: 125,
    renderCell: (params) => {
      const { dist, str } = params.value;
      return (
        <VersionBadge className={dist} title={dist || "stable"}>
          {str}
        </VersionBadge>
      );
    },
  },
  {
    field: "fileSize",
    headerName: "Size",
    align: "center",
    width: 125,
    renderCell: (params) => (
      <span
        className="px-1 rounded-md font-mono border bg-slate-200 text-slate-500 border-slate-400"
        title={"SI: " + readableFileSize(params.value, true)}
      >
        {readableFileSize(params.value)}
      </span>
    ),
  },
  {
    field: "created_at",
    headerName: "Release Date",
    width: 150,
    valueGetter: (params) => timeAgo(new Date(params.value)),
  },
  {
    field: "updated_at",
    headerName: "Modification Date",
    width: 200,
    valueGetter: (params) => timeAgo(new Date(params.value)),
  },
];

export default AdminOTAUpdates;
