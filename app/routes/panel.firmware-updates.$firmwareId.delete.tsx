import { json, redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
// import { TextButton } from "~/components/atoms/Button";
import { requireSessionToken } from "~/models/session.server";
import api from "~/utils/core.server";
import type { Firmware } from "~/types/Firmware";
import { PANEL_PREFIX } from "./panel";
import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { TextButton } from "~/components/atoms/Button";
import { TrashIcon } from "@heroicons/react/24/solid";

type LoaderData = {
  firmware: Firmware;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const token = await requireSessionToken(request);
  if (!params.firmwareId)
    throw new Response("Firmware Update Not Found", { status: 404 });
  return api
    .adminGetFirmwareUpdateDetail(params.firmwareId, token)
    .then(data => json<LoaderData>({ firmware: data as Firmware }))
    .catch(err => {
      throw new Response(
        err.response?.data?.message ??
          err.response?.data ??
          err.response ??
          err,
        {
          status: err.response?.status ?? 404,
          statusText:
            err.response?.statusText ?? "Failed to get firmware update info!",
        }
      );
    });
};

export const action: ActionFunction = async ({ request, params }) => {
  const token = await requireSessionToken(request);
  if (!params.firmwareId)
    throw new Response("Firmware Update Not Found", { status: 404 });
  return api
    .adminDeleteFirmwareUpdate(params.firmwareId, token)
    .then(() => {
      return redirect(`${PANEL_PREFIX}/firmware-updates`);
    })
    .catch(err => {
      throw new Response(
        "Error deleting the firmware update: " + err.response?.data?.message ??
          err.response?.data ??
          err.response ??
          err,
        {
          status: err.response?.status ?? 500,
          statusText:
            err.response?.statusText ??
            "Internal Error Deleting The Firmware Update!",
        }
      );
    });
};

export default function DeleteFirmwareUpdateModal() {
  const { firmware } = useLoaderData<LoaderData>();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(true);

  const handleClose = () => {
    setOpen(false);
    navigate(`${PANEL_PREFIX}/firmware-updates`);
  };

  return (
    <div className="DeleteFirmwareUpdateModal">
      <Dialog
        open={open}
        onClose={handleClose}
        disablePortal
        keepMounted
        aria-labelledby="delete-firmware-update-confirmation-dialog-title"
        aria-describedby="delete-firmware-update-confirmation-dialog-description"
      >
        <DialogTitle id="delete-firmware-update-confirmation-dialog-title">
          Delete Firmware Update {firmware.file?.name}?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-firmware-update-confirmation-dialog-description">
            You're about to delete{" "}
            <b className="text-red-600 dark:text-red-400">
              {firmware.file?.name}
            </b>
            <code className="text-rose-600 dark:text-rose-400">
              {firmware.id} -{" "}
              {`${firmware.version?.major}.${firmware.version?.minor}.${firmware.version?.patch}-${firmware.version?.dist}`}
            </code>
            firmware update. This is a permanent action and can't be undone!
          </DialogContentText>
        </DialogContent>
        <Form method="POST">
          <DialogActions>
            <TextButton onClick={handleClose} type="reset">
              Cancel
            </TextButton>
            <TextButton
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
                ? `Deleting ${firmware.file?.name}...`
                : "Loading..."}
            </TextButton>
          </DialogActions>
        </Form>
      </Dialog>
    </div>
  );
}
