import {
  DocumentTextIcon,
  EllipsisVerticalIcon,
  PaperAirplaneIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import {
  UserIcon,
  BuildingOffice2Icon,
  // XCircleIcon,
  NoSymbolIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import { json, type LoaderFunction } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import axios from "axios";
import type { ReactNode } from "react";
import { useState } from "react";
import { requireSessionToken, requireUser } from "~/models/session.server";
import type { Device } from "~/types/Device";
import { type User } from "~/types/User";
import api from "~/utils/core.server";
import { timeAgo } from "~/utils/time";

type LoaderData = {
  user: User;
  token: string;
  devices: Device[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);
  const token = await requireSessionToken(request);
  const devices = await api.adminGetDevices(token);
  return json<LoaderData>({ user, token, devices });
};

export const ManageDevices = () => {
  const { user, token, devices } = useLoaderData<LoaderData>();
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [editId, setEditId] = useState<string>("");
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const [messageOpen, setMessageOpen] = useState<boolean>(false);
  const [messageId, setMessageId] = useState<string>("");
  const [msgErr, setMsgErr] = useState<string>("");
  const [logsOpen, setLogsOpen] = useState<boolean>(false);
  const [logsId, setLogsId] = useState<string>("");
  const [logsContent, setLogsContent] = useState<string[]>([]);

  const openEditDialog = (dId: string) => {
    setEditOpen(true);
    setEditId(dId);
    // Set edit state so that the dialog knows what to load ...
  };
  const openDeleteDialog = (dId: string) => {
    setDeleteOpen(true);
    setDeleteId(dId);
    // Set delete state so that the dialog knows what to load?
  };
  const openMessageDialog = (dId: string) => {
    setMessageOpen(true);
    setMessageId(dId);
  };
  const openLogsDialog = async (dId: string) => {
    console.log("Opening");
    setLogsOpen(true);
    setLogsId(dId);
    setMessageId(dId); // to send logs signal
    // getDeviceLogs(); // doesn't work!
  };
  const closeEditDialog = () => setEditOpen(false);
  const closeDeleteDialog = () => setDeleteOpen(false);
  const closeMessageDialog = () => setMessageOpen(false);
  const closeLogsDialog = () => setLogsOpen(false);

  const deleteDevice = () => {
    console.log("Device was deleted through API!");
    axios
      .delete(`${ENV.CORE_URL}/api/v1/devices/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Device was deleted");
        alert(`Device(${deleteId}) was deleted successfully`);
        closeDeleteDialog();
        window.location.reload();
      });
  };

  const sendMessageToDevice = (e: any) => {
    e.preventDefault();
    console.log(`Sending Message to Device ${messageId}`);
    axios
      .post(
        `${ENV.CORE_URL}/api/v1/admin/devices/${messageId}/message`,
        { message: JSON.parse(e.currentTarget.message.value) },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        console.log("Message Sent to Device: ", res);
        alert(`Server: ${JSON.stringify(res.data)}`);
        setMsgErr(JSON.stringify(res.data, null, 2));
      })
      .catch((err) => {
        const errMsg =
          err.message ??
          err.response?.data?.message ??
          err.response?.data ??
          err.response ??
          err;
        console.warn("Error sending message to device: ", errMsg);
        setMsgErr(errMsg); // JSON.stringify
        alert(`Error: ${errMsg}`);
      });
  };

  const getDeviceLogs = () => {
    console.log(`Getting device logs for ${logsId}`);
    axios
      .get(`${ENV.CORE_URL}/api/v1/statistics/logs/${logsId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(`Got device(${logsId}) logs from the server`, res.data);
        setLogsContent(res.data);
      })
      .catch((err) => {
        const errMsg =
          err.message ??
          err.response?.data?.message ??
          err.response?.data ??
          err.response ??
          err;
        console.warn(`Error getting device logs: ${errMsg}`);
        alert(`Error getting device logs: ${errMsg}`);
      });
  };

  // todo: find a better way check by their permission
  // const isUserAllowedToMutate = !!user.roles; // todo: remove options from rows if user's not allowed
  const deviceOptions = {
    edit: true, // todo: based on permissions and access
    onEdit: openEditDialog,
    onEditClose: closeEditDialog,
    delete: true, // todo: based on permissions and access
    onDelete: openDeleteDialog,
    onDeleteClose: closeDeleteDialog,
    message: true, // todo: based on permissions and access
    onMessage: openMessageDialog,
    onMessageClose: closeMessageDialog,
    logs: true, // todo: based on permissions and access
    onLogs: openLogsDialog,
    onLogsClose: closeLogsDialog,
  };

  return (
    <div className="ManageDevices admin-page">
      <h2 className="page-title">Device Management</h2>
      <div className="data-container">
        <DataGrid
          rows={devices}
          columns={generateGridColumns(deviceOptions)}
          autoHeight
          // checkboxSelection={isUserAllowedToMutate}
          // isRowSelectable={() => true}
        />
      </div>

      {/* Edit Device Dialog */}
      <Dialog
        open={editOpen}
        onClose={closeEditDialog}
        aria-labelledby="edit-dialog-title"
        aria-describedby="edit-dialog-description"
      >
        <DialogTitle id="edit-dialog-title">
          Edit Device({editId}) as {user.roles![0].name}
        </DialogTitle>
        <DialogContent id="edit-dialog-description">
          You'll be redirected to another page!
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog}>Cancel</Button>
          <Link to={`/devices/${editId}/edit`} prefetch="render">
            <Button autoFocus variant="contained" color="primary">
              Edit
            </Button>
          </Link>
        </DialogActions>
      </Dialog>

      {/* Delete Device Dialog */}
      <Dialog
        open={deleteOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Device({deleteId}) as {user.roles![0].name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Deleting this device will cause it{" "}
            <b>being disconnected form Thor IoT Network</b>, which means it
            needs to re-signup in in order to use the services. Are you sure you
            want to delete this device? (The page will reload after the device
            is deleted successfully)
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button
            onClick={deleteDevice}
            autoFocus
            variant="contained"
            color="error"
          >
            DELETE
          </Button>
        </DialogActions>
      </Dialog>

      {/* Send Message to Device Dialog */}
      <Dialog
        open={messageOpen}
        onClose={closeMessageDialog}
        aria-labelledby="message-dialog-title"
        aria-describedby="message-dialog-description"
      >
        <Form method="POST" onSubmit={sendMessageToDevice}>
          <DialogTitle id="message-dialog-title">
            Send Message to Device({messageId}) as {user.roles![0].name}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="message-dialog-description">
              This is a debug tool which allows us to send custom messages to
              devices for debugging and troubleshooting purposes.
            </DialogContentText>
            <textarea
              className="w-full font-mono text-xs bg-slate-800
                text-emerald-300 rounded-md p-2 mt-4"
              name="message"
              rows={15}
              defaultValue={JSON.stringify(
                {
                  ok: true,
                  signal: "UPDATE_STATE",
                  payload: {
                    ssid: "Thor Access Point",
                  },
                  control: {
                    power: {
                      "0": false,
                      "1": true,
                    },
                  },
                  update: {},
                  id: "000000000000000000000000",
                },
                null,
                2
              )}
            />
            {msgErr && (
              <pre
                className="font-mono whitespace-pre-wrap
                  bg-slate-300 dark:bg-slate-600 text-slate-600
                  dark:text-slate-300 p-2 rounded-md mt-4"
              >
                {msgErr}
              </pre>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeMessageDialog}>Cancel</Button>
            <Button
              // onClick={sendMessageToDevice}
              autoFocus
              variant="contained"
              color="primary"
              type="submit"
            >
              SEND
            </Button>
          </DialogActions>
        </Form>
      </Dialog>

      {/* Get Logs of Device Dialog */}
      <Dialog
        open={logsOpen}
        onClose={closeLogsDialog}
        aria-labelledby="logs-dialog-title"
        aria-describedby="logs-dialog-description"
      >
        <DialogTitle id="logs-dialog-title">
          Getting Logs of the Device({messageId}) as {user.roles![0].name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="logs-dialog-description">
            This is a debug tool which allows us to get the logs of the device
            for debugging and troubleshooting purposes.
          </DialogContentText>
          <div className="logs flex flex-col-reverse gap-2 mt-4">
            {logsContent.map((l, i) => (
              <pre
                key={i}
                className="w-full font-mono text-xs bg-slate-800
                text-blue-300 rounded-md p-2 whitespace-pre-wrap
                relative"
              >
                <span
                  className="absolute bg-blue-500 dark:bg-blue-400
                  rounded-xl w-6 h-6 top-2 right-2 flex text-xs
                  items-center justify-center text-white"
                >
                  {i}
                </span>
                {l}
              </pre>
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeLogsDialog}>Cancel</Button>
          <form method="post" onSubmit={sendMessageToDevice}>
            <input
              type="hidden"
              name="message"
              value={JSON.stringify({
                ok: true,
                signal: "SEND_LOGS",
                id: logsId,
              })}
            />
            <Button type="submit" variant="contained" color="warning">
              Send Signal
            </Button>
          </form>
          <Button
            onClick={getDeviceLogs}
            autoFocus
            variant="contained"
            color="primary"
            type="submit"
          >
            Get Logs
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const generateGridColumns = (options: {
  // todo: create a type for it!
  edit: boolean;
  onEdit: (dId: string) => any;
  onEditClose: () => any;
  delete: boolean;
  onDelete: (dId: string) => any;
  onDeleteClose: () => any;
  message: boolean;
  onMessage: (dId: string) => any;
  onMessageClose: () => any;
  logs: boolean;
  onLogs: (dId: string) => any;
  onLogsClose: () => any;
}): GridColDef[] => [
  {
    field: "action",
    headerName: "",
    width: 60,
    renderCell: ({ row }) => {
      const dId = row.id;
      return (
        <OptionsMenu
          options={[
            {
              title: "Edit",
              icon: <PencilIcon className="h-4 w-4" />,
              onClick: () => {
                console.log("Editing: ", dId);
                options.onEdit(dId);
              },
            },
            {
              title: "Delete",
              icon: <TrashIcon className="h-4 w-4" />,
              // className: "!text-rose-500",
              onClick: () => {
                console.log("Deleting: ", dId);
                options.onDelete(dId);
              },
            },
            {
              title: "Send Message",
              icon: <PaperAirplaneIcon className="h-4 w-4" />,
              // className: "!text-rose-500",
              onClick: () => {
                console.log("Preparing to send message to: ", dId);
                options.onMessage(dId);
              },
            },
            {
              title: "View Logs",
              icon: <DocumentTextIcon className="h-4 w-4" />,
              // className: "!text-rose-500",
              onClick: () => {
                console.log("Preparing to get logs of device: ", dId);
                options.onLogs(dId);
              },
            },
          ]}
        />
      );
    },
  },
  {
    field: "id",
    headerName: "ID",
    width: 215,
    cellClassName: "text-xs font-mono",
  },
  {
    field: "cpuId",
    headerName: "CPU ID",
    width: 100,
    cellClassName: "text-xs font-mono font-semibold",
  },
  {
    field: "chip",
    headerName: "Chip",
    width: 100,
    cellClassName: "text-xs font-mono font-semibold",
  },
  { field: "type", headerName: "Type", width: 150 }, // todo: render icon instead!
  { field: "name", headerName: "Name", width: 200 },
  {
    field: "user",
    headerName: "User",
    width: 125,
    renderCell: ({ row }) => {
      return row.user ? (
        <Tooltip
          title={
            <div className="font-mono">
              <div>ID: {row.user._id}</div>
              <div>Name: {row.user.name}</div>
              <div>
                Phone: {row.user.phone}(
                {Date.parse(row.user.phoneVerifiedAt) > 0 ? "" : "not "}
                verified)
              </div>
              <div>
                Email: {row.user.email}(
                {Date.parse(row.user.emailVerifiedAt) > 0 ? "" : "not "}
                verified)
              </div>
              <div>Username: {row.user.username}</div>
              {row.user.roleIds && <div>role IDs: {row.user.roleIds}</div>}
              {row.user.permissionIds && (
                <div>permission IDs: {row.user.permissionIds}</div>
              )}
              <div>Created At: {timeAgo(new Date(row.user.created_at))}</div>
              <div>Updated At: {timeAgo(new Date(row.user.created_at))}</div>
            </div>
          }
        >
          <div
            className="text-xs flex flex-row items-center
            justify-center gap-1 overflow-ellipsis text-sky-700
            dark:text-sky-300"
          >
            <UserIcon className="w-4 h-4" />
            {row.user.name || row.user.phone || row.user.email || row.user.id}
          </div>
        </Tooltip>
      ) : (
        <div>
          <Tooltip title="No User Found">
            {/* <XCircleIcon className="w-6 h-6 text-slate-300" /> */}
            <NoSymbolIcon
              className="w-6 h-6 text-slate-400
              dark:text-slate-600"
            />
          </Tooltip>
        </div>
      );
    },
  },
  {
    field: "group",
    headerName: "Group",
    width: 125,
    renderCell: ({ row }) => {
      return row.group ? (
        <Tooltip
          title={
            <div className="font-mono">
              <div>ID: {row.group._id}</div>
              <div>Name: {row.group.name}</div>
            </div>
          }
        >
          <div
            className="font-xs flex flex-row items-center
            justify-center gap-1 overflow-ellipsis text-sky-700
            dark:text-sky-300"
          >
            <BuildingOffice2Icon className="w-4 h-4" />
            {row.group.name || row.group.id}
          </div>
        </Tooltip>
      ) : (
        <div>
          <Tooltip title="No Group Found">
            {/* <XCircleIcon className="w-6 h-6 text-slate-300" /> */}
            <NoSymbolIcon
              className="w-6 h-6 text-slate-400
                dark:text-slate-600"
            />
          </Tooltip>
        </div>
      );
    },
  },
  {
    field: "created_at",
    headerName: "Creation Date",
    width: 125,
    valueGetter: (params) => timeAgo(new Date(params.value)),
  },
  {
    field: "updated_at",
    headerName: "Last Update",
    width: 125,
    // headerAlign: "center",
    // align: "center",
    valueGetter: (params) => timeAgo(new Date(params.value)),
  },
];

type DeviceOptionsMenuProps = {
  options: {
    title: string;
    icon?: ReactNode;
    className?: string;
    onClick: Function;
  }[];
};

export const OptionsMenu = ({ options }: DeviceOptionsMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
        {options.map((o) => (
          <MenuItem
            key={o.title}
            onClick={() => {
              o.onClick();
              handleClose();
            }}
            className={o.className}
          >
            {o.icon && <ListItemIcon>{o.icon}</ListItemIcon>}
            <ListItemText>{o.title}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default ManageDevices;
