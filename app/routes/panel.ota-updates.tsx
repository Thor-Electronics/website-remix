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
import { refineFirmware } from "~/types/Firmware";
import readableFileSize from "~/utils/bytes";
import { adminGetFirmware as adminGetFirmwareUpdates } from "~/utils/core.server";
import { timeAgo } from "~/utils/time";

type LoaderData = {
  firmwareUpdates: Firmware[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const fws = await adminGetFirmwareUpdates((await getSessionToken(request))!);
  return json<LoaderData>({ firmwareUpdates: fws });
};

export const AdminOTAUpdates = () => {
  const { firmwareUpdates: fws } = useLoaderData<LoaderData>();

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
          <IconButton
            className="!bg-rose-100 dark:!bg-rose-950
            !text-rose-400 dark:!text-rose-600 border
            border-rose-300 dark:border-rose-700"
          >
            <TrashIcon className="w-4" />
          </IconButton>
        </Link>
        <Link to={`#`}>
          <IconButton
            className="!bg-blue-100 dark:!bg-blue-950
            !text-blue-400 dark:!text-blue-600 border
            border-blue-300 dark:border-blue-700"
          >
            <CloudArrowDownIcon className="w-4" />
          </IconButton>
        </Link>
        <Link to={`#`}>
          <IconButton
            className="!bg-amber-100 dark:!bg-amber-950
            !text-amber-400 dark:!text-amber-600 border
            border-amber-300 dark:border-amber-700"
          >
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
        className="px-1 rounded-md font-mono border bg-slate-200
          dark:bg-slate-700 text-slate-500 border-slate-400
          dark:border-slate-600"
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
  {
    field: "description",
    headerName: "Description",
    width: 400,
    cellClassName: "text-xs",
  },
];

export default AdminOTAUpdates;
