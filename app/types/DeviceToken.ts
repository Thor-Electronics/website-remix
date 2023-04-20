export type DeviceToken = {
  deviceId: string
  code: string
  created_at?: Date
  updated_at?: Date
}

export const parseDeviceToken = (dt: any): DeviceToken => {
  if (!dt.deviceId || !dt.code) {
    throw new Error("Invalid input to parse device token")
  }
  return {
    deviceId: dt.deviceId,
    code: dt.code,
    created_at: new Date(dt.created_at),
    updated_at: new Date(dt.updated_at),
  }
}
