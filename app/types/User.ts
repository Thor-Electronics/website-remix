export type User = {
  id: string
  name: string
  email: string
  phone?: string
  username?: string
  created_at?: Date
  updated_at?: Date
  permissions?: Permission[]
  roleIds?: string[]
  roles?: Role[]
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
  BUILDINGS = "BUILDINGS",
  USERS = "USERS",
  PAYMENTS = "PAYMENTS",
  NETWORK = "NETWORK",
  FIRMWARE_UPDATE = "FIRMWARE_UPDATE",
  ACCESS = "ACCESS",
  AREAS = "AREAS",
}
