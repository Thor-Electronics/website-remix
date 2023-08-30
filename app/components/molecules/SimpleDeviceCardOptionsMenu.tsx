import MenuItem from "@mui/material/MenuItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemIcon from "@mui/material/ListItemIcon"
// import BiSolidPencil from "react-icons/bi"
import {
  FolderMinusIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid"
import type { MenuProps } from "@mui/material"
import { Menu } from "@mui/material"
import { Link } from "@remix-run/react"
import { DASHBOARD_PREFIX } from "~/routes/app"
import type { ReactNode } from "react"

type Props = MenuProps & {
  deviceId: string
}

type Option = {
  link: string
  className: string
  icon: ReactNode
  text: string
  description: string
}

export default function IconMenu({ deviceId, ...props }: Props) {
  const base = `${DASHBOARD_PREFIX}/devices/${deviceId}`
  const options: Option[] = [
    {
      link: base + "/edit",
      className: "text-gray-500",
      icon: <PencilIcon className="w-4" />,
      text: "Edit",
      description: "Update device info",
    },
    {
      link: base + "/remove?intent=detach",
      className: "text-gray-500",
      icon: <FolderMinusIcon className="w-4" />,
      text: "Detach",
      description: "Detach device from this group",
    },
    {
      link: base + "/transfer",
      className: "text-gray-500",
      icon: <UserPlusIcon className="w-4" />,
      text: "Transfer",
      description: "Transfer device ownership to another account",
    },
    {
      link: base + "/remove?intent=delete",
      className: "text-rose-400",
      icon: <TrashIcon className="w-4 text-rose-400" />,
      text: "Delete",
      description: "Permanently delete the device",
    },
  ]
  return (
    <Menu {...props}>
      {options.map(o => (
        <Link
          key={o.text}
          to={o.link}
          className={o.className}
          title={o.description}
        >
          <MenuItem>
            <ListItemIcon>{o.icon} </ListItemIcon>
            <ListItemText>{o.text}</ListItemText>
          </MenuItem>
        </Link>
      ))}
    </Menu>
  )
}
