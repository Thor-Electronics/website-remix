import invariant from "tiny-invariant"

export const getEnv = () => {
  invariant(process.env.CORE_URL, "CORE_URL must be defined")
  return {
    CORE_URL: process.env.CORE_URL,
  }
}

type ENV = ReturnType<typeof getEnv>

declare global {
  var ENV: ENV
  interface Window {
    ENV: ENV
  }
}
