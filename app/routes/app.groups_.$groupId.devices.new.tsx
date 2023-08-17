import { json, redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import { requireSessionToken, requireUser } from "~/models/session.server";
import { DeviceType } from "~/types/DeviceType";
import type { Group } from "~/types/Group";
import type { User } from "~/types/User";
import api, { getDeviceTypes, getGroupDetails } from "~/utils/core.server";
import { DASHBOARD_PREFIX } from "./app";
import Button from "~/components/atoms/Button";

type LoaderData = {
  user: User;
  group: Group;
  deviceTypes: {
    [key in DeviceType]: string; // [k: DeviceType]: string
  };
};

type ActionData = {
  errors?: {
    message?: string;
    name?: string;
    type?: string;
    manufacturerId?: string;
    cpuId?: string;
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  const token = await requireSessionToken(request);
  invariant(params.groupId, "Invalid Group ID");
  const group = await getGroupDetails(params.groupId, token);
  const deviceTypes = await getDeviceTypes(token);
  return json<LoaderData>({ user, group, deviceTypes });
};

export const action: ActionFunction = async ({ request, params }) => {
  const token = await requireSessionToken(request);
  invariant(params.groupId, "Invalid Group ID");
  const group = (await getGroupDetails(params.groupId, token)) as Group;

  const form = await request.formData();
  const name = form.get("name");
  const type = form.get("type");
  const manufacturerId = form.get("manufacturerId");
  const cpuId = form.get("cpuId");

  let errors = {
    name: typeof name !== "string" && "Name must be string!",
    type: typeof type !== "string" && "Type must be string!",
    manufacturerId:
      typeof manufacturerId !== "string" && "Manufacturer ID must be string!",
    cpuId: typeof cpuId !== "string" && "CPU ID must be string!",
  };

  if (Object.values(errors).some(Boolean)) return json({ errors }, 400);

  return await api
    .createDevice(token, {
      name,
      type,
      manufacturerId,
      cpuId,
      groupId: group.id,
      // userId: user.id,
    })
    .then(async (data) => {
      console.log(
        `New Device ${name} was added to group ${group.name} successfully!`
      );
      console.log(data);
      return redirect(`${DASHBOARD_PREFIX}/groups/${group.id}`);
    })
    .catch((err) => {
      const errMsg =
        err.response?.data?.message ??
        err.response?.data ??
        err.response ??
        err;
      console.error("ERROR Creating new device for group: ", errMsg);
      return json<ActionData>({ errors: { message: errMsg } });
    });
};

export default function NewDevicePage() {
  const { group: g, deviceTypes } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();

  return (
    <div className="NewDevicePage">
      <h1 className="page-title text-center my-4 text-xl font-bold">
        Adding New Device to{" "}
        <Link to={`${DASHBOARD_PREFIX}/groups/${g.id}`}>{g.name}</Link>
      </h1>
      <Form
        method="POST"
        className="flex flex-col gap-4 max-w-sm mx-auto card sm:p-4"
      >
        {actionData?.errors?.message && (
          <div className="error">{actionData?.errors?.message}</div>
        )}
        <label>
          Name: <i className="text-red-500 dark:text-red-400 font-bold">*</i>
          {actionData?.errors?.name && (
            <span className="error">{actionData.errors.name}</span>
          )}
          <input name="name" required />
        </label>
        <label>
          Type: <i className="text-red-500 dark:text-red-400 font-bold">*</i>
          {actionData?.errors?.type && (
            <span className="error">{actionData.errors.type}</span>
          )}
          <select name="type" required defaultValue={DeviceType.Key4}>
            {Object.entries(deviceTypes).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label>
          {/* Default Manufacturer ID filled automatically and disabled editing? */}
          Manufacturer ID:{" "}
          <i className="italic text-sm opacity-50">(Optional)</i>
          {actionData?.errors?.manufacturerId && (
            <span className="error">{actionData.errors.manufacturerId}</span>
          )}
          <input name="manufacturerId" />
        </label>
        <label>
          CPU ID: <i className="italic text-sm opacity-50">(Optional)</i>
          {actionData?.errors?.cpuId && (
            <span className="error">{actionData.errors.cpuId}</span>
          )}
          <input name="cpuId" />
        </label>
        <div className="btns">
          <Button
            className="!bg-primary w-full"
            type="submit"
            disabled={navigation.state === "submitting"}
          >
            {navigation.state === "submitting"
              ? "Creating New Device ..."
              : "Add New Device"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
