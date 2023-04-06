// Core Service APIs

import { fetch } from "@remix-run/node"
import axios from "axios"

export const ax = axios.create({
  baseURL: ENV.CORE_URL,
  // timeout: 10000,
  headers: { "X-Request-From": "Website" },
  // transformRequest: axios.defaults.transformRequest,
  // transformResponse: axios.defaults.transformResponse,
})

// axios.defaults.baseURL = ENV.CORE_URL
// const ax = axios

export const h = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
})
export const extractResponseData = (res: any) => res.data

export const v1 = "/api/v1"

export const healthCheck = () => ax.get("/health/")
export const checkAuth = (token: string) => ax.get(`${v1}/auth/`, h(token))
export const login = (data: object) => ax.post(`${v1}/auth/`, data)
export const signup = (data: object) => ax.post(`${v1}/auth/signup/`, data)

export const getUserGroups = (token: string) =>
  ax.get(`${v1}/groups/`, h(token)).then(extractResponseData)
export const createGroup = (token: string, data: object) =>
  ax.post(`${v1}/groups/`, data, h(token)).then(extractResponseData)
export const getGroupDetails = (id: string, token: string) =>
  ax.get(`${v1}/groups/${id}/`, h(token)).then(extractResponseData)
export const getDeviceDetails = (id: string, token: string) =>
  ax.get(`${v1}/devices/${id}/`, h(token)).then(extractResponseData)
export const deleteDevice = (id: string, token: string) =>
  ax.delete(`${v1}/devices/${id}/`, h(token)).then(extractResponseData)

export const delay = (time: number) => ax.get(`${v1}/dev/delay?time=${time}`)
export const dly = (t: number) =>
  fetch(`${process.env.CORE_ADDR}/api/v1/dev/delay?time=${t}`)

export const adminGetInitialData = (token: string) =>
  ax.get(`${v1}/admin`, h(token)).then(extractResponseData)
export const adminGetUsers = (token: string) =>
  ax.get(`${v1}/admin/users`, h(token)).then(extractResponseData)
export const adminGetFirmwares = (token: string) =>
  ax.get(`${v1}/admin/firmware-updates`, h(token)).then(extractResponseData)
export const adminPostFirmware = (formData: FormData, token: string) =>
  ax
    .post(`${v1}/admin/firmware-updates`, formData, h(token))
    .then(extractResponseData)
export const adminGetDevices = (token: string) =>
  ax.get(`${v1}/admin/devices`, h(token)).then(extractResponseData)
export const adminGetAreas = (token: string) =>
  ax.get(`${v1}/admin/areas`, h(token)).then(extractResponseData)
// fetch(`${ENV.CORE_URL + v1}/admin/firmware-updates`, {
//   ...h(token),
//   method: "POST",
//   body: formData,
// }).then(res => res.json())
// .then(extractResponseData)

const api = {
  v1,
  healthCheck,
  checkAuth,
  login,
  signup,
  getUserGroups,
  createGroup,
  getGroupDetails,
  getDeviceDetails,
  deleteDevice,
  delay,
  dly,
  adminGetInitialData,
  adminGetUsers,
  adminGetFirmwares,
  adminPostFirmware,
  adminGetDevices,
  adminGetAreas,
}

export default api
