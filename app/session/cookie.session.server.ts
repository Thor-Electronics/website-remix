import { createCookieSessionStorage } from "@remix-run/node"

export const SESSION_SECRET = process.env.SESSION_SECRET
if (!SESSION_SECRET) throw new Error("SESSION_SECRET must be set")

// cookie session data
export type CookieSessionData = {
  id: string //? DB Session ID
  token: string //? Auth Token provided by Core
  userId: string //? Core User ID
}

// When the session is flashed
export type CookieSessionFlashData = {
  error: string //? Error messages
  message: string //? Info messages
  redirect: string //? Redirect to
}

// To store tiny stuff?
export const cookieSessionStorage = createCookieSessionStorage<
  CookieSessionData,
  CookieSessionFlashData
>({
  cookie: {
    name: "RIW_session", // makes them stupid. They don't know it's thor's cookie!
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    secrets: [SESSION_SECRET],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 31, // 31 days
    httpOnly: true,
  },
})

export default cookieSessionStorage
