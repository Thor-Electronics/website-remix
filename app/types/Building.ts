import { Device } from "./Device"

export interface Building {
  id: string
  name: string
  address: string
  userId: string
  devices?: Device[]
  plugins: object[] // Plugin[]
}
