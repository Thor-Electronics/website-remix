export type Message = {
  ok?: boolean
  update?: object
  command?: object
  signal?: string
  message?: string
  payload?: object
  id: string
}

export enum Signals {
  DEVICE_CONNECTED = "DEVICE_CONNECTED",
  DEVICE_DISCONNECTED = "DEVICE_DISCONNECTED",
  USER_CONNECTED = "USER_CONNECTED",
  USER_DISCONNECTED = "USER_DISCONNECTED",
  DEVICE_STATE_UPDATED = "DEVICE_STATE_UPDATED",
}
