import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { TextButton } from "~/components/atoms/Button";
import { requireSessionToken, requireUser } from "~/models/session.server";
import type { Device } from "~/types/Device";
import { DeviceChip } from "~/types/DeviceChip";
import type { ServerDeviceTypes } from "~/types/DeviceType";
import type { Group } from "~/types/Group";
import type { User } from "~/types/User";
import api from "~/utils/core.server";
import { DASHBOARD_PREFIX } from "./app";
import { Alert } from "@mui/material";

type LoaderData = {
  token: string;
  user: User;
  device: Device;
  groups: Group[];
  deviceTypes: ServerDeviceTypes;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.deviceId, "Device ID is required!");
  const user = await requireUser(request);
  const token = await requireSessionToken(request);
  const device = await api.getDeviceDetails(params.deviceId, token);
  const groups = await api.getUserGroups(token);
  const deviceTypes = await api.getDeviceTypes(token);
  return json<LoaderData>({ token, user, device, groups, deviceTypes });
};

type ActionData = {
  errors?: {
    message?: string;
    cpuId?: string;
    name?: string;
    groupId?: string;
    type?: string;
    chip?: string;
    state?: string;
    manufacturerId?: string;
  };
};

export const action: ActionFunction = async ({ request, params }) => {
  const fd = await request.formData();
  invariant(params.deviceId, "Device ID is required!");
  return api
    .updateDevice(
      params.deviceId,
      await requireSessionToken(request),
      Object.fromEntries(fd)
    )
    .then((coreResponse) => {
      console.log(`Updated device ${coreResponse.id}`);
      return redirect(DASHBOARD_PREFIX + "/");
    })
    .catch((err) => {
      const errMsg =
        err.message ||
        err.response?.data?.message ||
        err.response?.data ||
        err.response ||
        err ||
        "unknown error!";
      console.error(err);
      return json<ActionData>({ errors: { message: errMsg } });
    });
  // console.log("CORE RESPONSE: ", coreResponse);
  // return json<ActionData>({ errors: { message: "Coming Soon!" } });
};

export default function EditDeviceRoute() {
  const { device, groups, deviceTypes } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  console.log("Device Data: ", device);
  return (
    <div className="EditDeviceRoute">
      <h1 className="title text-xl font-semibold text-center my-4">
        Edit Device({device.name})
      </h1>
      <Form
        method="POST"
        className="card max-w-md mx-auto flex flex-col items-stretch gap-4"
      >
        {actionData?.errors?.message && (
          <Alert severity="error">{actionData.errors.message}</Alert>
        )}
        <label>
          CPU ID:
          <input
            type="text"
            name="cpuId"
            className="font-mono"
            defaultValue={device.cpuId}
          />
        </label>
        <label>
          Name:
          <input type="text" name="name" defaultValue={device.name} required />
        </label>
        <label>
          Group:
          <select name="groupId" defaultValue={device.groupId}>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Type:
          <select name="type" defaultValue={device.type}>
            {Object.entries(deviceTypes).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label>
          Chip:
          <select name="chip" defaultValue={device.chip}>
            {Object.values(DeviceChip).map((chip) => (
              <option key={chip} value={chip}>
                {chip}
              </option>
            ))}
          </select>
        </label>
        <label>
          Manufacturer ID:
          <input
            type="text"
            name="manufacturerId"
            defaultValue={device.manufacturerId}
          />
        </label>
        {actionData?.errors?.message && (
          <Alert severity="error">{actionData.errors.message}</Alert>
        )}
        <div className="buttons flex gap-2 flex-row-reverse">
          <TextButton className="!bg-primary" type="submit">
            Save
          </TextButton>
          <Link to={DASHBOARD_PREFIX + "/groups"}>
            <TextButton>Cancel</TextButton>
          </Link>
        </div>
      </Form>
    </div>
  );
}

// type UpdateDeviceRequest struct {
// 	CPUID          *string                `json:"cpuId" form:"cpuId" xml:"cpuId"`                            // Each device has a unique CPU_ID which is assigned to it by the factory
// 	Name           *string                `json:"name" form:"name" xml:"name"`                               // The user-defined custom name
// 	GroupID        *primitive.ObjectID    `json:"groupId" form:"groupId" xml:"groupId"`                      // Parent Group ID
// 	Type           *DeviceType            `json:"type" form:"type" xml:"type"`                               // Device Type
// 	Chip           *DeviceChip            `json:"chip" form:"chip" xml:"chip"`                               // Device Chip
// 	State          map[string]interface{} `json:"state" form:"state" xml:"state"`                            // Device State
// 	ManufacturerID *primitive.ObjectID    `json:"manufacturerId" form:"manufacturerId" xml:"manufacturerId"` // Manufacturer ID
// }
