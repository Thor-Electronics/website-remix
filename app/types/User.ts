import type { Device } from "./Device"
import type { Group } from "./Group"

export type User = {
  id: string
  name: string
  email: string
  phone?: string
  username?: string
  emailVerifiedAt?: Date
  phoneVerifiedAt?: Date
  created_at?: Date
  updated_at?: Date
  permissions?: Permission[]
  roleIds?: string[]
  roles?: Role[]
  deviceCount?: number
  groupCount?: number
  groups?: Group[]
  devices?: Device[]
}

export type Permission = {
  context: PERMISSION_CONTEXT
  access: ACCESS
}

export type Role = {
  id: string
  name: string
  permissions: Permission[]
  created_at?: Date
  updated_at?: Date
}

export enum ACCESS {
  NONE,
  VIEW = 1 << 0,
  CREATE = 1 << 1,
  MODIFY = 1 << 2,
  DELETE = 1 << 3,
}

export enum PERMISSION_CONTEXT {
  TOKENS = "TOKENS",
  DEVICES = "DEVICES",
  GROUPS = "GROUPS",
  USERS = "USERS",
  PAYMENTS = "PAYMENTS",
  NETWORK = "NETWORK",
  FIRMWARE_UPDATE = "FIRMWARE_UPDATE",
  ACCESS = "ACCESS",
  AREAS = "AREAS",
}

export const parsePermission = (p: any): Permission => ({
  context: p.context ?? PERMISSION_CONTEXT.AREAS,
  access: p.access ?? ACCESS.NONE,
})

export const parseRole = (r: any): Role => ({
  ...(r as Role),
  id: r.id || r._id,
  permissions: r.permissions.map((p: any) => parsePermission(p)),
  created_at: r.created_at ? new Date(r.created_at) : undefined,
  updated_at: r.updated_at ? new Date(r.updated_at) : undefined,
})

export const parseUser = (u: any): User => ({
  ...(u as User),
  id: u.id || u._id,
  emailVerifiedAt: u.emailVerifiedAt ? new Date(u.emailVerifiedAt) : undefined,
  phoneVerifiedAt: u.phoneVerifiedAt ? new Date(u.phoneVerifiedAt) : undefined,
  created_at: u.created_at ? new Date(u.created_at) : undefined,
  updated_at: u.updated_at ? new Date(u.updated_at) : undefined,
  permissions: u.permissions?.map((p: any) => parsePermission(p)),
  roles: u.roles?.map((r: any) => parseRole(r)),
})
