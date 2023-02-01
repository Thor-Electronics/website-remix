import { createCookieSessionStorage, redirect } from "@remix-run/node"
import api from "~/utils/core.server"
import { db } from "~/utils/db.server"

const SESSION_SECRET = process.env.SESSION_SECRET
if (!SESSION_SECRET) throw new Error("SESSION_SECRET must be set")

const storage = createCookieSessionStorage({
  cookie: {
    name: "RIW_session",
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    secrets: [SESSION_SECRET],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
})

export async function createSession(
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
  const session = await storage.getSession()
  session.set("id", authSession.ID)
  session.set("token", authSession.token)
  session.set("userId", authSession.userID) // is it necessary?
  return {
    session: authSession,
    redirect: redirect(redirectTo, {
      headers: {
        "Set-Cookie": await storage.commitSession(session),
      },
    }),
  }
}

export const getUserSession = async (request: Request) =>
  storage.getSession(request.headers.get("Cookie"))

export async function getUserId(request: Request) {
  const session = await getUserSession(request)
  const userId = session.get("userId")
  return !userId || typeof userId !== "string" ? null : userId
}

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
export const getOptionalUser = async (request: Request) =>
  await api
    .checkAuth((await getSessionData(request)).token)
    .then(res => res.data.user)
    .catch(err => null)

export const requireUser = async (request: Request) => {
  const user = await getOptionalUser(request)
  if (!user) throw await logout(request)
  return user
}

export const requireUserId = async (
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) => {
  const userId = getUserId(request)
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]])
    throw redirect(`/login?${searchParams}`)
  }
  return userId
}

export const logout = async (request: Request) => {
  const session = await getUserSession(request)
  try {
    await db.session.delete({ where: { ID: session.get("id") } })
  } catch {
    console.warn("Session doesn't exist")
  }
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  })
}
