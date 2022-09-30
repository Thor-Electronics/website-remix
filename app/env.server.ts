import invariant from "tiny-invariant"

export const getEnv = () => {
  const production = process.env.NODE_ENV === "production"
  invariant(process.env.CORE_ADDR, "CORE_ADDR must be defined")
  return {
    CORE_ADDR: process.env.CORE_ADDR,
    CORE_URL: `${production ? "https" : "http"}://${process.env.CORE_ADDR}`,
    CORE_SOCKET: `${production ? "wss" : "ws"}://${process.env.CORE_ADDR}`,
  }
}

type ENV = ReturnType<typeof getEnv>

declare global {
  var ENV: ENV
  interface Window {
    ENV: ENV
  }
}
