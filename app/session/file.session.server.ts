import { createFileSessionStorage } from "@remix-run/node"
import type { User } from "~/types/User"

export const SESSION_SECRET = process.env.SESSION_SECRET
if (!SESSION_SECRET) throw new Error("SESSION_SECRET must be set")

export type FileSessionData = {
  history: HistoryItem[] //? User history
  uuid: string //? random uuid to distinguish sessions
  createdAt: Date
  updatedAt: Date
  id?: string //? DB Session ID
  token?: string //? Auth Token provided by Core
  user?: User //? A snapshot of the user in Core
}

export type FileSessionFlashData = {
  error: string
  message: string
  redirect: string
}

// To store large stuff
export const fileSessionStorage = createFileSessionStorage<
  FileSessionData,
  FileSessionFlashData
>({
  dir: "./sessions",
  cookie: {
    name: "FSY_session", // makes them stupid
    secure: process.env.NODE_ENV === "production",
    secrets: [SESSION_SECRET],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 31 * 6, // 6 months
    httpOnly: true,
  },
})

export default fileSessionStorage

export type HistoryItem = {
  url: string
  date: Date
}
