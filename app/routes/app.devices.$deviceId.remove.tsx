import { json, redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";
import { TextButton } from "~/components/atoms/Button";
import { requireSessionToken } from "~/models/session.server";
import type { Device } from "~/types/Device";
import api from "~/utils/core.server";
import { DASHBOARD_PREFIX } from "./app";

type LoaderData = {
  device: Device;
  intent: Intent;
};

type Intent = "detach" | "delete";

export const loader: LoaderFunction = async ({ request, params }) => {
  const token = await requireSessionToken(request);
  if (!params.deviceId) throw new Response("Device Not Found", { status: 404 });
  const url = new URL(request.url);
  let intent: Intent = (url.searchParams.get("intent") ?? "detach") as Intent;
  if (intent !== "detach" && intent !== "delete") {
    intent = "detach";
  }
  return api
    .getDeviceDetails(params.deviceId, token)
    .then((data) => {
      return json<LoaderData>({ device: data as Device, intent });
    })
    .catch((err) => {
      throw new Response(
        err.message ??
          err.response?.data?.message ??
          err.response?.data ??
          err.response ??
          err,
        {
          status: err.response?.status ?? 404,
          statusText: err.response?.statusText ?? "Failed to get device info!",
        }
      );
    });
};

export const action: ActionFunction = async ({ request, params }) => {
  const token = await requireSessionToken(request);
  if (!params.deviceId) throw new Response("Device Not Found", { status: 404 });
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "delete")
    return api
      .deleteDevice(params.deviceId, token)
      .then(() => {
        return redirect(`${DASHBOARD_PREFIX}/groups/${params.groupId ?? ""}`);
      })
      .catch((err) => {
        throw new Response(
          "Error deleting the device: " + err.message ??
            err.response?.data?.message ??
            err.response?.data ??
            err.response ??
            err,
          {
            status: err.response?.status ?? 500,
            statusText:
              err.response?.statusText ?? "Internal Error Deleting The Device!",
          }
        );
      });
  return api
    .detachDevice(params.deviceId, token)
    .then(() => {
      return redirect(`${DASHBOARD_PREFIX}/groups/${params.groupId ?? ""}`);
    })
    .catch((err) => {
      throw new Response(
        "Error detaching device from the group: " + err.message ??
          err.response?.data?.message ??
          err.response?.data ??
          err.response ??
          err,
        {
          status: err.response?.status ?? 500,
          statusText:
            err.response?.statusText ?? "Internal Error Detaching The Device!",
        }
      );
    });
};

export default function DeleteDevicePage() {
  const { device, intent } = useLoaderData<LoaderData>();
  const navigation = useNavigation();

  return (
    <div className="DeleteDeviceCard">
      <div className="card">
        <b>
          Are you sure you want to {intent} {device.name}{" "}
          <code
            className={
              intent === "delete"
                ? "text-rose-600 dark:text-rose-400"
                : "text-orange-600 dark:text-orange-400"
            }
          >
            {device.cpuId || "NO_CPU_ID"} - {device.id}
          </code>
        </b>
        <div className="buttons">
          <Form method="POST">
            <input
              type="text"
              name="intent"
              value={intent}
              className="hidden"
              readOnly
            />
            <TextButton
              type="submit"
              className={
                intent === "delete"
                  ? "!bg-rose-500 dark:!bg-rose-400"
                  : "!bg-orange-500 dark:!bg-orange-400"
              }
              disabled={
                navigation.state === "submitting" ||
                navigation.state === "loading"
              }
            >
              {navigation.state === "submitting"
                ? `${intent === "delete" ? "Deleting" : "Detaching"} ${
                    device.name
                  }...`
                : navigation.state === "loading"
                ? "Redirecting..."
                : "Yes, I know what I'm doing!"}
            </TextButton>
          </Form>
          <Link
            to={`${DASHBOARD_PREFIX}/groups/${device.groupId}`}
            prefetch="render"
          >
            <TextButton>Cancel</TextButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
