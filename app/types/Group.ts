import type { Device } from "./Device"

export interface Group {
  id: string
  name: string
  address: string
  userId: string
  devices?: Device[]
  plugins: object[] // Plugin[]
}
