import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import type { ActionFunction } from "react-router";
import invariant from "tiny-invariant";
import { requireSessionToken } from "~/models/session.server";
import type { Device } from "~/types/Device";
import api, { getDeviceDetails } from "~/utils/core.server";
import { DASHBOARD_PREFIX } from "./app";
import { TextButton } from "~/components/atoms/Button";
import { Alert } from "@mui/material";

type LoaderData = {
  device: Device;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const token = await requireSessionToken(request);
  invariant(params.deviceId, "Device ID is required");
  const device = await getDeviceDetails(params.deviceId, token);
  return json<LoaderData>({ device });
};

type ActionData = {
  errors?: {
    message?: string;
  };
};

export const action: ActionFunction = async ({ request, params }) => {
  const token = await requireSessionToken(request);
  invariant(params.deviceId, "Device ID is required");
  const formData = await request.formData();
  const phone = formData.get("phone") as string;
  invariant(phone, "Phone number is required");
  return api
    .transferDevice(params.deviceId, token, { userPhone: phone })
    .then((data) => {
      console.log("Successfully transferred the device: ", data);
      return redirect(`${DASHBOARD_PREFIX}/groups/`);
    })
    .catch((err) => {
      const message =
        err.response?.data?.message || err.response?.data || err.response;
      !err.response?.data?.message &&
        console.error("Error transferring device: ", message, err);
      return json<ActionData>({
        errors: { message: message || "Unknown Error" },
      });
    });
};

export default function TransferDeviceRoute() {
  const { device } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();

  return (
    <div className="TransferDeviceRoute">
      <Form method="POST" className="card flex flex-col gap-4">
        {actionData?.errors && (
          <Alert severity="error">{actionData.errors.message}</Alert>
        )}
        <Alert severity="warning">
          You're about to transfer <b>{device.name}</b> ownership to another
          account. This action <b>CANNOT BE UNDONE</b>!
          <p>
            To transfer {device.name} to another account, you need to enter the
            target user's phone number. The device will go to their orphan
            devices page in their panel and they can assign it to a group later.
          </p>
          <p>
            In order to transfer device ownership, your phone number and the
            target user's phone number must be verified.
          </p>
        </Alert>
        <label>
          User Phone Number:
          <input type="text" name="phone" placeholder="09123456789" required />
        </label>
        {actionData?.errors && (
          <Alert severity="error">{actionData.errors.message}</Alert>
        )}
        <div className="buttons flex flex-row-reverse items-stretch gap-2">
          <TextButton
            type="submit"
            className="!bg-teal-500 dark:!bg-teal-400"
            disabled={navigation.state !== "idle"}
          >
            Transfer Ownership
          </TextButton>
          <Link to={`${DASHBOARD_PREFIX}/groups/${device.groupId ?? ""}`}>
            <TextButton disabled={navigation.state !== "idle"}>
              Cancel
            </TextButton>
          </Link>
        </div>
      </Form>
    </div>
  );
}
