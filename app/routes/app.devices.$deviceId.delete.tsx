import type { ActionFunction } from "@remix-run/node"
import { json, Response, type LoaderFunction, redirect } from "@remix-run/node"
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react"
import { TextButton } from "~/components/atoms/Button"
import { getSessionToken } from "~/models/session.server"
import type { Device } from "~/types/Device"
import api from "~/utils/core.server"
import { DASHBOARD_PREFIX } from "./app"

type LoaderData = {
  device: Device
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const token = await getSessionToken(request)
  if (!params.deviceId) throw new Response("Device Not Found", { status: 404 })
  return api
    .getDeviceDetails(params.deviceId, token)
    .then(data => {
      return json<LoaderData>({ device: data as Device })
    })
    .catch(err => {
      throw new Response(
        err.response?.data?.message ??
          err.response?.data ??
          err.response ??
          err,
        {
          status: err.response?.status ?? 404,
          statusText: err.response?.statusText ?? "Failed to get device info!",
        }
      )
    })
}

export const action: ActionFunction = async ({ request, params }) => {
  const token = await getSessionToken(request)
  if (!params.deviceId) throw new Response("Device Not Found", { status: 404 })
  return api
    .deleteDevice(params.deviceId, token)
    .then(() => {
      return redirect(`${DASHBOARD_PREFIX}/groups/${params.groupId ?? ""}`)
    })
    .catch(err => {
      throw new Response(
        "Error deleting the device: " + err.response?.data?.message ??
          err.response?.data ??
          err.response ??
          err,
        {
          status: err.response?.status ?? 500,
          statusText:
            err.response?.statusText ?? "Internal Error Deleting The Device!",
        }
      )
    })
}

export default function DeleteDevicePage() {
  const { device } = useLoaderData<LoaderData>()
  const navigation = useNavigation()

  return (
    <div className="DeleteDeviceCard">
      <div className="card">
        <b>
          Are you sure you want to delete {device.name}{" "}
          <code className="text-rose-600">
            {device.cpuId || "NO_CPU_ID"} - {device.id}
          </code>
        </b>
        <div className="buttons">
          <Form method="POST">
            <TextButton
              type="submit"
              className="!bg-rose-500"
              disabled={
                navigation.state === "submitting" ||
                navigation.state === "loading"
              }
            >
              {navigation.state === "submitting"
                ? `Deleting ${device.name}...`
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
  )
}
