import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { json, type LoaderFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import {
  getSessionToken,
  requireUser,
  type User,
} from "~/models/session.server"
import api from "~/utils/core.server"
import { timeAgo } from "~/utils/time"

type LoaderData = {
  users: User[]
}

export const loader: LoaderFunction = async ({ request }) => {
  const users = await api.adminGetUsers(await getSessionToken(request))
  return json<LoaderData>({ users })
}

export const AdminUsers = () => {
  const { users } = useLoaderData<LoaderData>() // <typeof loader>

  // console.log("USERS: ", users)

  return (
    <div className="AdminUsers">
      <h2 className="title font-black font-serif text-3xl text-center mb-4">
        User Management
      </h2>
      <div className="data-container bg-white rounded-lg p-2 shadow-lg text-center">
        <DataGrid
          rows={users}
          columns={gridColumns}
          autoHeight
          checkboxSelection
          isRowSelectable={() => true}
        />
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
  { field: "name", headerName: "Name", width: 200 },
  { field: "email", headerName: "Email", width: 300 },
  { field: "phone", headerName: "Phone", width: 150 },
  { field: "username", headerName: "Username", width: 150 },
  { field: "buildings", headerName: "Buildings", width: 100 },
  { field: "devices", headerName: "Devices", width: 100 },
  {
    field: "created_at",
    headerName: "Join Date",
    width: 125,
    valueGetter: params => timeAgo(new Date(params.value)),
  },
  {
    field: "updated_at",
    headerName: "Last Acc Update",
    width: 125,
    // headerAlign: "center",
    // align: "center",
    valueGetter: params => timeAgo(new Date(params.value)),
  },
]

export default AdminUsers
