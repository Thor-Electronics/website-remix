import { FolderPlusIcon, PlusCircleIcon } from "@heroicons/react/24/solid"
import type { GridColDef } from "@mui/x-data-grid"
import { DataGrid } from "@mui/x-data-grid"
import { json, type LoaderFunction } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import Button from "~/components/atoms/Button"
import { getSessionToken, requireUser } from "~/models/session.server"
import { type User } from "~/types/User"
import { adminGetFirmwares } from "~/utils/core.server"
import { timeAgo } from "~/utils/time"

type LoaderData = {
  firmwares: {
    fileName: string
    fileSize: string
    modifiedAt: Date
  }[]
}

export const loader: LoaderFunction = async ({ request }) => {
  const firmwares = await adminGetFirmwares(await getSessionToken(request))
  return json<LoaderData>({ firmwares })
}

export const AdminOTAUpdates = () => {
  const { firmwares } = useLoaderData<LoaderData>() // <typeof loader>

  console.log("FIRMWARES: ", firmwares)

  const refinedFirmwares = firmwares.map((f, i) => ({ id: i, ...f }))

  return (
    <div className="AdminFirmwares admin-page">
      <h2 className="page-title">Firmware Updates(OTA)</h2>
      <Link to="new" prefetch="render">
        <Button className="!bg-primary py-1 px-3 shadow-blue-300 mb-4 mx-auto flex items-center gap-2.5">
          <FolderPlusIcon className="w-5 h-5" />
          Upload New Firmware
        </Button>
      </Link>
      <div className="data-container">
        {refinedFirmwares.length > 0 && (
          <DataGrid
            rows={refinedFirmwares}
            columns={gridColumns}
            autoHeight
            checkboxSelection
            isRowSelectable={() => true}
          />
        )}
      </div>
    </div>
  )
}

const gridColumns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    width: 200,
    cellClassName: "text-xs font-mono",
  },
  {
    field: "file",
    headerName: "File",
    width: 400,
    valueGetter: params =>
      `${params.value["size"]} bytes - ${params.value["name"]}`,
  },
  {
    field: "updated_at",
    headerName: "Modification Date",
    width: 150,
    valueGetter: params => timeAgo(new Date(params.value)),
  },
]

export default AdminOTAUpdates
