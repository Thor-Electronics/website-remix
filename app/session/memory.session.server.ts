import { createMemorySessionStorage } from "@remix-run/node"

export const SESSION_SECRET = process.env.SESSION_SECRET
if (!SESSION_SECRET) throw new Error("SESSION_SECRET must be set")

export type MemorySessionData = {
  id: string //? DB Session ID
}

export type MemorySessionFlashData = {
  error: string
}

// DEVELOPMENT ONLY! according to remix docs
// To store most recent useful stuff
// export const memorySessionStorage = createMemorySessionStorage<
//   MemorySessionData,
//   MemorySessionFlashData
// >({
//   cookie: {
//     name: "MSZ_session", // makes them stupid
//     secure: process.env.NODE_ENV === "production",
//     secrets: [SESSION_SECRET],
//     sameSite: "lax",
//     path: "/",
//     maxAge: 60 * 60 * 24, // 1 day
//     httpOnly: true,
//   },
// })

// export default memorySessionStorage
