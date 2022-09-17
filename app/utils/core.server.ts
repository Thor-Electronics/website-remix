// Core Service APIs

import axios from "axios"

export const ax = axios.create({
  baseURL: process.env.CORE_URL,
  // timeout: 10000,
  headers: { "X-Request-From": "Website" },
})

export const v1 = "/api/v1"

export const healthCheck = () => ax.get("/health")
export const checkAuth = (token: string) =>
  ax.get(`${v1}/auth`, { headers: { Authorization: `Bearer ${token}` } })
export const login = (data: object) => ax.post(`${v1}/auth`, data)
export const signup = (data: object) => ax.post(`${v1}/auth/signup`, data)

export const delay = (time: number) => ax.get(`${v1}/dev/delay?time=${time}`)
export const dly = (t: number) =>
  fetch(`${process.env.CORE_URL}/api/v1/dev/delay?time=${t}`)

const api = { healthCheck, checkAuth, login, signup, delay, dly }

export default api
