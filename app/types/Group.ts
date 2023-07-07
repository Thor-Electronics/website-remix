import { parseDevice, type Device } from "./Device"

export interface Group {
  id: string
  name: string
  type: string // Group Types
  userId: string
  devices?: Device[]
  plugins?: object[] // Plugin[]
  created_at?: Date
  updated_at?: Date
}

export enum GroupType {
  Building = "BUILDING",
  Factory = "FACTORY",
  Vehicle = "VEHICLE",
  Farm = "FARM",
}

export const parseGroup = (g: any): Group => ({
  ...(g as Group),
  devices: g.devices ? g.devices.map((d: any) => parseDevice(d)) : [],
  created_at: g.created_at ? new Date(g.created_at) : undefined,
  updated_at: g.updated_at ? new Date(g.updated_at) : undefined,
  // todo: parsePlugins
})
