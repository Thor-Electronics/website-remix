import { EllipsisVerticalIcon } from "@heroicons/react/24/solid"
import { Button, IconButton, Menu, MenuItem } from "@mui/material"
import type { GridColDef } from "@mui/x-data-grid"
import { DataGrid } from "@mui/x-data-grid"
import { json, type LoaderFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import type { ReactNode } from "react"
import { useState } from "react"
import { getSessionToken, requireUser } from "~/models/session.server"
import type { Device } from "~/types/Device"
import { type User } from "~/types/User"
import api from "~/utils/core.server"
import { timeAgo } from "~/utils/time"

type LoaderData = {
  user: User
  devices: Device[]
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request)
  const devices = await api.adminGetDevices(await getSessionToken(request))
  return json<LoaderData>({ user, devices })
}

export const ManageDevices = () => {
  const { user, devices } = useLoaderData<LoaderData>()
  const isUserAllowedToMutate = !!user.roles
  const actionOptions = {
    add: false,
    edit: true,
    delete: true,
  }

  return (
    <div className="ManageDevices admin-page">
      <h2 className="page-title">Device Management</h2>
      <div className="data-container">
        <DataGrid
          rows={devices}
          columns={generateGridColumns(actionOptions)}
          autoHeight
          // checkboxSelection={isUserAllowedToMutate}
          // isRowSelectable={() => true}
        />
      </div>
    </div>
  )
}

const generateGridColumns = (options: {
  // todo: create a type for it!
  add: boolean
  edit: boolean
  delete: boolean
}): GridColDef[] => [
  {
    field: "action",
    headerName: "",
    width: 60,
    renderCell: ({ row }) => {
      const dId = row.id
      return (
        <OptionsMenu
          options={[
            {
              title: "Edit",
              onClick: () => console.log("Editing: ", dId),
            },
            {
              title: "Delete",
              onClick: () => console.log("Deleting: ", dId),
            },
          ]}
        />
      )
    },
  },
  {
    field: "id",
    headerName: "ID",
    width: 200,
    cellClassName: "text-xs font-mono",
  },
  {
    field: "cpuId",
    headerName: "CPU ID",
    width: 100,
    cellClassName: "text-xs font-mono font-semibold",
  },
  { field: "type", headerName: "Type", width: 150 }, // todo: render icon instead!
  { field: "name", headerName: "Name", width: 200 },
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

type OptionsMenuProps = {
  options: {
    title: string
    icon?: ReactNode
    onClick: Function
  }[]
}

export const OptionsMenu = ({ options }: OptionsMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <IconButton
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <EllipsisVerticalIcon className="h-6 w-6" />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {options.map(o => (
          <MenuItem
            key={o.title}
            onClick={() => {
              o.onClick()
              handleClose()
            }}
          >
            {o.title}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

export default ManageDevices
