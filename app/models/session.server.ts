// import type { Request } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import type { User } from "~/types/User"
import api from "~/utils/core.server"
import { db } from "~/utils/db.server"
import cookieSessionStorage from "~/session/cookie.session.server"
// import memorySessionStorage from "~/session/memory.session.server"
// import fileSessionStorage from "~/session/file.session.server"

export const SESSION_SECRET = process.env.SESSION_SECRET
if (!SESSION_SECRET) throw new Error("SESSION_SECRET must be set")

// Creates a new session record in DB
export async function createDBSession(
  userId: string,
  token: string,
  ip: string,
  redirectTo: string
) {
  const authSession = await db.session.create({
    data: {
      userID: userId,
      token,
      IP: ip ?? "",
    },
  })
  const cookieSession = await cookieSessionStorage.getSession()
  cookieSession.set("id", authSession.ID)
  cookieSession.set("token", authSession.token)
  cookieSession.set("userId", authSession.userID) // todo: necessary?
  return {
    cookieSession: authSession,
    redirect: redirect(redirectTo, {
      headers: {
        "Set-Cookie": await cookieSessionStorage.commitSession(cookieSession),
      },
    }),
  }
}

export const createCookieSession = async (
  userId: string,
  token: string,
  request: Request,
  redirectTo: string
) => {
  const cookieSession = await cookieSessionStorage.getSession()
  cookieSession.set("token", token)
  cookieSession.set("userId", userId)
  return {
    redirect: redirect(redirectTo, {
      headers: {
        "Set-Cookie": await cookieSessionStorage.commitSession(cookieSession),
      },
    }),
  }
}

// Extracts user's cookie session from request
export const getUserSession = async (request: Request) =>
  cookieSessionStorage.getSession(request.headers.get("Cookie"))

// Extracts user's ID stored in the cookie session from request
export async function getUserId(request: Request) {
  const session = await getUserSession(request)
  const userId = session.get("userId")
  return !userId || typeof userId !== "string" ? null : userId
}

// Extracts user's cookie session data from request
export async function getSessionData(request: Request) {
  const session = await getUserSession(request)
  return {
    id: session.get("id"),
    token: session.get("token"),
    userId: session.get("userId"),
  }
}

export const getSessionToken = async (request: Request) =>
  (await getSessionData(request)).token

/** Get user info from core service based on token saved in session(cookie) */
export const getOptionalUser = async (request: Request) => {
  const cookieSessionData = await getSessionData(request)
  const token = cookieSessionData.token
  if (!token) return undefined
  return await api
    .checkAuth(token)
    .then(res => res.data.user as User)
    .catch(err => undefined)
}

export const requireUser = async (request: Request) => {
  const user = await getOptionalUser(request)
  if (!user) {
    const url = new URL(request.url)
    console.log("User is undefined. redirecting to: ", url.pathname)
    throw await logout(request, url.pathname)
  }
  return user
}

export const requireUserId = async (
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) => {
  const userId = getUserId(request)
  if (!userId) {
    // const searchParams = new URLSearchParams([["redirectTo", redirectTo]])
    // throw redirect(`/login?${searchParams}`)
    const url = new URL(request.url)
    console.log("User ID is undefined. redirecting to: ", url.pathname)
    throw await logout(request, url.pathname)
  }
  return userId
}

// TODO: set redirectTo cookie or something when redirecting to login
export const logout = async (request: Request, redirectTo: string = "/app") => {
  const cookieAuthSession = await getUserSession(request)
  console.log(`Logging out to ${redirectTo}...`)
  // try {
  //   await db.session.delete({ where: { ID: cookieAuthSession.get("id") } })
  // } catch {
  //   console.warn("Session doesn't exist to delete. Continuing...")
  // }
  return redirect(`/login?redirect=${redirectTo}`, {
    headers: {
      "Set-Cookie": await cookieSessionStorage.destroySession(
        cookieAuthSession
      ),
    },
  })
}

// todo: internal cache system for auth! Amazing!
