import { parseDevice, type Device } from "./Device"
import { parseGroup, type Group } from "./Group"
import { parseUser, type User } from "./User"

export type HubContainer = {
  name: string
  deviceHubs: DeviceHub[]
}

export type DeviceHub = {
  name: string
  groupId: string
  group: Group
  deviceClients: Client[]
  userClients: Client[]
}

export type Client = {
  groupId: string
  ip: string
  latency: number
  connectedAt: Date
  type: string
  device?: Device
  user?: User
}

export const parseClient = (c: any): Client => {
  return {
    ...(c as Client),
    connectedAt: new Date(c.connectedAt),
    device: c.device ? parseDevice(c.device) : undefined,
    user: c.user ? parseUser(c.user) : undefined,
  }
}

export const parseDeviceHub = (dh: any): DeviceHub => ({
  ...(dh as DeviceHub),
  group: parseGroup(dh.group),
  deviceClients: dh.deviceClients?.map((c: any) => parseClient(c)),
  userClients: dh.userClients?.map((c: any) => parseClient(c)),
})

export const parseHubContainer = (hc: any): HubContainer => ({
  ...(hc as HubContainer),
  deviceHubs: hc.deviceHubs
    ? hc.deviceHubs.map((dh: any) => parseDeviceHub(dh))
    : [],
})
