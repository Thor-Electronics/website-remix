import { TrashIcon } from "@heroicons/react/24/solid";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  Response,
  type ActionFunction,
  type LoaderFunction,
  json,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { useState } from "react";
import { TextButton } from "~/components/atoms/Button";
import { requireSessionToken } from "~/models/session.server";
import type { Group } from "~/types/Group";
import api from "~/utils/core.server";
import { DASHBOARD_PREFIX } from "./app";

type LoaderData = {
  token: string;
  group: Group;
};

type ActionData = {
  errors?: {
    message?: string;
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const token = await requireSessionToken(request);
  if (!params.groupId)
    throw new Response("Group Not Found", {
      status: 404,
      statusText: "Group Not Found",
    });
  const group = await api.getGroupDetails(params.groupId, token);
  return json<LoaderData>({ group, token });
};

export const action: ActionFunction = async ({ request, params }) => {
  const token = await requireSessionToken(request);
  if (!params.groupId)
    throw new Response("GroupID is required", {
      status: 400,
      statusText: "Bad Request",
    });
  const group = await api.getGroupDetails(params.groupId, token);
  return api
    .deleteGroup(params.groupId, token)
    .then((res) => {
      console.log(`Deleted Group ${group.name}(${group.id})`, res.data);
      return redirect(DASHBOARD_PREFIX + "/groups");
    })
    .catch((err) => {
      const errMsg =
        err.response?.data?.message ??
        err.response?.data ??
        err.response ??
        err;
      console.error("Failed to delete group " + group.name, group.id, errMsg);
      return json<ActionData>({ errors: { message: errMsg } });
    });
};

export default function DeleteGroupModal() {
  const { group } = useLoaderData<LoaderData>();
  useActionData<ActionData>();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    navigate(`${DASHBOARD_PREFIX}/groups/${group.id}`);
    // window.location.href = `${DASHBOARD_PREFIX}/groups/${group.id}`
    // navigation!.location!.pathname! = `${DASHBOARD_PREFIX}/groups/${group.id}`
    // throw redirect(`${DASHBOARD_PREFIX}/groups/${group.id}`)
  };

  return (
    <div>
      {/* <div className="glossy-fullscreen-overlay"> */}
      <Dialog
        open={open}
        onClose={handleClose}
        disablePortal
        keepMounted
        aria-labelledby="delete-group-confirmation-dialog-title"
        aria-describedby="delete-group-confirmation-dialog-description"
      >
        <DialogTitle id="delete-group-confirmation-dialog-title">
          Delete {group.name} group({"Building"})?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-group-confirmation-dialog-description">
            You're about to delete{" "}
            <b className="text-red-600 dark:text-red-400">
              {group.name} - <code>{group.id}</code>
            </b>{" "}
            group/building/etc. Deleting this group, causes all the devices to
            be deleted too! This action can't be undone!
          </DialogContentText>
        </DialogContent>
        <Form method="POST">
          <DialogActions>
            <TextButton onClick={handleClose} type="reset">
              Cancel
            </TextButton>
            <TextButton
              // onClick={handleClose}
              type="submit"
              className="!bg-red-500 dark:!bg-red-400 p-2
                rounded-xl sm:rounded-lg sm:px-3 sm:py-1
                shadow-red-300 dark:shadow-red-700
                sm:shadow-red-200 dark:sm:shadow-red-800"
              disabled={navigation.state !== "idle"}
            >
              <TrashIcon className="w-4" />
              {navigation.state === "idle"
                ? "Yes, Delete!"
                : navigation.state === "submitting"
                ? `Deleting ${group.name}...`
                : "Loading..."}
            </TextButton>
          </DialogActions>
        </Form>
      </Dialog>
    </div>
    // </div>
  );
}
