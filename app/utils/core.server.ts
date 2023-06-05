// Core Service APIs

import { fetch } from "@remix-run/node"
import axios from "axios"

export const ax = axios.create({
  baseURL: ENV.CORE_URL,
  // timeout: 9000,
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

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-= AUTH =-=-=-=-=-=-=-=-=-=-=-=-=-=-= */
const auth = `${v1}/auth`
export const checkAuth = (token: string) => ax.get(`${auth}/`, h(token))
export const login = (data: object) => ax.post(`${auth}/`, data)
export const signup = (data: object) => ax.post(`${auth}/signup/`, data)
export const getUserProfile = (token: string) =>
  ax.get(`${auth}/profile`, h(token))
export const updateUserProfile = (token: string) =>
  ax.patch(`${auth}/profile`, h(token)) // TODO: duplicate
export const sendPhoneVerification = (token: string) =>
  ax.post(`${auth}/send-phone-verification`, {}, h(token))
export const sendEmailVerification = (token: string) =>
  ax.post(`${auth}/send-email-verification`, {}, h(token))
export const sendPasswordReset = (data: object) =>
  ax.post(`${auth}/send-password-reset`, data) // TODO: could take token instead of passing data?
export const verifyPhone = (token: string, data: object) =>
  ax.post(`${auth}/verify-phone`, data, h(token))
export const verifyEmail = (token: string, data: object) =>
  ax.post(`${auth}/verify-email`, data, h(token))
export const resetPassword = (data: object) =>
  ax.post(`${auth}/reset-password`, data) // TODO: could take token instead of passing data?
export const updateProfile = (token: string, data: object) =>
  ax.patch(`${auth}/profile`, data, h(token))

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=- GROUPS =-=-=-=-=-=-=-=-=-=-=-=-=-=- */
const groups = `${v1}/groups`
export const getUserGroups = (token: string) =>
  ax.get(`${groups}/`, h(token)).then(extractResponseData)
export const createGroup = (token: string, data: object) =>
  ax.post(`${groups}/`, data, h(token)).then(extractResponseData)
export const getGroupDetails = (id: string, token: string) =>
  ax.get(`${groups}/${id}/`, h(token)).then(extractResponseData)
export const deleteGroup = (id: string, token: string) =>
  ax.delete(`${groups}/${id}`, h(token))

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=- DEVICES =-=-=-=-=-=-=-=-=-=-=-=-=-= */
const devices = `${v1}/devices`
export const createDevice = (token: string, data: object) =>
  ax.post(`${devices}`, data, h(token)).then(extractResponseData)
export const getDeviceDetails = (id: string, token: string) =>
  ax.get(`${devices}/${id}/`, h(token)).then(extractResponseData)
export const deleteDevice = (id: string, token: string) =>
  ax.delete(`${devices}/${id}/`, h(token)).then(extractResponseData)
export const updateDevice = (id: string, token: string, data: object) =>
  ax.patch(`${devices}/${id}/`, data, h(token)).then(extractResponseData)
export const detachDevice = (id: string, token: string) =>
  ax.post(`${devices}/${id}/detach/`, {}, h(token)).then(extractResponseData)
export const getOrphanDevices = (token: string) =>
  ax.get(`${devices}/`, h(token)).then(extractResponseData)

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=- UTILS =-=-=-=-=-=-=-=-=-=-=-=-=-=-= */
export const delay = (time: number) => ax.get(`${v1}/dev/delay?time=${time}`)
export const dly = (t: number) =>
  fetch(`${process.env.CORE_ADDR}/api/v1/dev/delay?time=${t}`)

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=- ADMIN =-=-=-=-=-=-=-=-=-=-=-=-=-=-= */
const admin = `${v1}/admin`
export const adminGetInitialData = (token: string) =>
  ax.get(`${admin}`, h(token)).then(extractResponseData)
export const adminGetUsers = (token: string) =>
  ax.get(`${admin}/users`, h(token)).then(extractResponseData)
export const adminGetFirmwares = (token: string) =>
  ax.get(`${admin}/firmware-updates`, h(token)).then(extractResponseData)
export const adminPostFirmware = (formData: FormData, token: string) =>
  ax
    .post(`${admin}/firmware-updates`, formData, h(token))
    .then(extractResponseData)
export const adminGetDevices = (token: string) =>
  ax.get(`${admin}/devices`, h(token)).then(extractResponseData)
export const adminGetAreas = (token: string) =>
  ax.get(`${admin}/areas`, h(token)).then(extractResponseData)

const api = {
  v1,
  healthCheck,

  checkAuth,
  login,
  signup,
  getUserProfile,
  updateUserProfile,
  sendPhoneVerification,
  sendEmailVerification,
  sendPasswordReset,
  verifyPhone,
  verifyEmail,
  resetPassword,
  updateProfile,

  getUserGroups,
  createGroup,
  getGroupDetails,
  deleteGroup,

  createDevice,
  getDeviceDetails,
  deleteDevice,
  updateDevice,
  detachDevice,
  getOrphanDevices,

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
