import { LoaderFunction } from "@remix-run/cloudflare"

export const loader: LoaderFunction = () => {
  return null
}

export const BuildingDeviceDetails = () => {
  return <div className="DeviceDetails">DEVICE DETAILS</div>
}

export default BuildingDeviceDetails
