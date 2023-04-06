import type { LoaderFunction } from "@remix-run/node"

export const loader: LoaderFunction = () => {
  return null
}

export const GroupDeviceDetails = () => {
  return <div className="DeviceDetails">DEVICE DETAILS</div>
}

export default GroupDeviceDetails
