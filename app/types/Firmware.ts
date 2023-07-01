import type { DeviceChip } from "./DeviceChip"
import type { DeviceType } from "./DeviceType"

export type Firmware = {
  id: string
  version: Version
  file: FirmwareFile
  target: FirmwareTarget
  created_at: string
  updated_at: string
}

export type RefinedFirmware = {
  id: string
  chip: DeviceChip
  deviceType: DeviceType
  version: Version | { str: string }
  fileName: string
  fileSize: number
  manufacturerId?: string
  groupId?: string
  deviceId?: string
  created_at: string
  updated_at: string
}

export type Version = {
  major: number
  minor: number
  patch: number
  dist: DistChannel
}

export enum DistChannel {
  STABLE = "",
  ALPHA = "alpha",
  BETA = "beta",
  DEV = "dev",
}

export type FirmwareFile = {
  name: string
  size: number
}

export type FirmwareTarget = {
  chip: DeviceChip
  deviceType: DeviceType
  manufacturerId?: string
  groupId?: string
  deviceId?: string
}

export const refineFirmware = (fw: Firmware): RefinedFirmware => ({
  id: fw.id,
  version: {
    ...fw.version,
    str: `${fw.version.major}.${fw.version.minor}.${fw.version.patch}${
      fw.version.dist ? "-" + fw.version.dist : ""
    }`,
  },
  fileName: fw.file?.name,
  fileSize: fw.file?.size,
  chip: fw.target.chip,
  deviceType: fw.target.deviceType,
  manufacturerId: fw.target.manufacturerId,
  groupId: fw.target.groupId,
  deviceId: fw.target.deviceId,
  created_at: fw.created_at,
  updated_at: fw.updated_at,
})
