import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import invariant from "tiny-invariant";
import { requireSessionToken, requireUser } from "~/models/session.server";
import type { Device } from "~/types/Device";
import type { User } from "~/types/User";
import api from "~/utils/core.server";

type LoaderData = {
  user: User;
  device: Device;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.deviceId, "Device not found");
  const user: User = await requireUser(request);
  const device: Device = await api.getDeviceDetails(
    params.deviceId,
    await requireSessionToken(request)
  );
  return json<LoaderData>({ user, device });
};

export const action: ActionFunction = async ({ request }) => {
  //
};

export const EditDevice = () => {
  const { device } = useLoaderData<LoaderData>();
  const [d, setD] = useState<Device>(device as Device);

  return (
    <div className="EditDevice">
      <form className="edit-device-form">
        <h1 className="title">Editing {d.name}</h1>
        <label>
          Name:
          <input type="text" defaultValue={device.name} value={d.name} />
        </label>
        <select name="deviceType" defaultValue={d.type}>
          {/* {(Object.keys(DeviceTypes) as Array<keyof typeof DeviceTypes>).map((key) => { })} */}
        </select>
        TODO: coming soon
      </form>
    </div>
  );
};

export default EditDevice;
