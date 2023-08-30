export type Message = {
  ok?: boolean
  update?: object
  command?: object
  signal?: Signal
  message?: string
  payload?: {
    onlineDevices?: string[] // initial client data
    token?: string // authentication signal message
    devices?: { [key: string]: number } // pings?
    users?: { [key: string]: number } // pings?
  }
  id: string
}

// Contains a command or signal
export type CommandMessage = Pick<Message, "command" | "signal" | "payload">

export enum Signal {
  DEVICE_CONNECTED = "DEVICE_CONNECTED",
  DEVICE_DISCONNECTED = "DEVICE_DISCONNECTED",
  USER_CONNECTED = "USER_CONNECTED",
  USER_DISCONNECTED = "USER_DISCONNECTED",
  STATE_UPDATED = "STATE_UPDATED",
  INITIAL_DATA = "INITIAL_DATA",
  RELOAD = "RELOAD",
  AUTHENTICATE = "AUTHENTICATE",
  REFRESH_LATENCIES = "REFRESH_LATENCIES",
  LOGOUT = "LOGOUT",
}
