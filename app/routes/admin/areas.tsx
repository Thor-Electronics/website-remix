import {
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid"
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material"
import type { GridColDef } from "@mui/x-data-grid"
import { DataGrid } from "@mui/x-data-grid"
import type { LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import type { ReactNode } from "react"
import { useState } from "react"
import { getSessionToken, requireUser } from "~/models/session.server"
import type { Area } from "~/types/Area"
import type { User } from "~/types/User"
import api from "~/utils/core.server"
import { timeAgo } from "~/utils/time"

type LoaderData = {
  user: User
  token: string
  areas: Area[]
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request)
  const token = await getSessionToken(request)
  const areas = await api.adminGetAreas(token)
  return json<LoaderData>({ user, token, areas })
}

export const ManageAreas = () => {
  const { user, token, areas } = useLoaderData<LoaderData>()
  const [editOpen, setEditOpen] = useState<boolean>(false)
  const [editId, setEditId] = useState<string>("")
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<string>("")

  const openEditDialog = (dId: string) => {
    setEditOpen(true)
    setEditId(dId)
  }
  const openDeleteDialog = (dId: string) => {
    setDeleteOpen(true)
    setDeleteId(dId)
  }
  // Use remix like stuff with multiple actions in a different page to edit?

  const areaOptions = {
    edit: true, // based on user roles/permissions
    onEdit: openEditDialog,
    onEditClose: closeEditDialog,
    delete: true,
    onDelete: openDeleteDialog,
    onDeleteClose: closeDeleteDialog,
  }

  return (
    <div className="ManageAreas admin-page">
      <h2 className="title">Area Management</h2>
      <div className="data-container">
        <DataGrid
          rows={areas}
          columns={generateGridColumns(areaOptions)}
          autoHeight
        />
      </div>
    </div>
  )
}
const generateGridColumns = (options: {
  // todo: create a type for it!
  edit: boolean
  onEdit: (dId: string) => any
  onEditClose: () => any
  delete: boolean
  onDelete: (dId: string) => any
  onDeleteClose: () => any
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
              icon: <PencilIcon className="h-4 w-4" />,
              onClick: () => {
                console.log("Editing: ", dId)
                options.onEdit(dId)
              },
            },
            {
              title: "Delete",
              icon: <TrashIcon className="h-4 w-4" />,
              // className: "!text-rose-500",
              onClick: () => {
                console.log("Deleting: ", dId)
                options.onDelete(dId)
              },
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
    headerName: "Creation Date",
    width: 125,
    valueGetter: params => timeAgo(new Date(params.value)),
  },
  {
    field: "updated_at",
    headerName: "Last Update",
    width: 125,
    // headerAlign: "center",
    // align: "center",
    valueGetter: params => timeAgo(new Date(params.value)),
  },
]

type DeviceOptionsMenuProps = {
  options: {
    title: string
    icon?: ReactNode
    className?: string
    onClick: Function
  }[]
}

export const OptionsMenu = ({ options }: DeviceOptionsMenuProps) => {
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
            className={o.className}
          >
            {o.icon && <ListItemIcon>{o.icon}</ListItemIcon>}
            <ListItemText>{o.title}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

export default ManageAreas
