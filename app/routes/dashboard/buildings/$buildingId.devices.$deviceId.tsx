import { LoaderFunction } from "@remix-run/node"

export const loader: LoaderFunction = () => {
  return null
}

export const BuildingDeviceDetails = () => {
  return <div className="DeviceDetails">DEVICE DETAILS</div>
}

export default BuildingDeviceDetails
