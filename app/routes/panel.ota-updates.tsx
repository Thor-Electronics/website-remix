import { FolderPlusIcon } from "@heroicons/react/24/solid";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import { json, type LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { VersionBadge } from "~/components/atoms/Badge";
import Button from "~/components/atoms/Button";
import { getSessionToken } from "~/models/session.server";
import type { Firmware } from "~/types/Firmware";
import { DistChannel, RefineFirmware } from "~/types/Firmware";
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
  const refinedFws = fws.map((f) => RefineFirmware(f));
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
            checkboxSelection
            isRowSelectable={() => true}
          />
        )}
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
  {
    field: "chip",
    headerName: "Chip",
    width: 100,
    // cellClassName: ""
  },
  {
    field: "deviceType",
    headerName: "D Type",
    width: 100,
    // cellClassName: ""
  },
  {
    field: "version",
    headerName: "Version",
    width: 75,
    // cellClassName: ""
    renderCell: (params) => {
      const { dist, str } = params.value;
      let cls: string = "";
      console.log("RENDERING", dist, dist === DistChannel.BETA);
      // switch (dist) {
      //   case DistChannel.BETA:
      //     console.log("IT's beta");
      //     cls += " !bg-beta-500";
      //     break;

      //   case DistChannel.STABLE:
      //     console.log("IT's STABLE");
      //     cls += " !bg-green-500";
      //     break;
      //   // default:
      //   // cls = "";
      // }
      return <VersionBadge className={dist}>{str}</VersionBadge>;
    },
  },
  // {
  //   field: "fileName",
  //   headerName: "File",
  //   width: 400,
  //   valueGetter: (params) =>
  //     `${params.value["size"]} bytes - ${params.value["name"]}`,
  // },
  {
    field: "updated_at",
    headerName: "Release Date",
    width: 150,
    valueGetter: (params) => timeAgo(new Date(params.value)),
  },
];

export default AdminOTAUpdates;
