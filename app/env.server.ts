import invariant from "tiny-invariant"

// declare var NODE_ENV: string
declare var CORE_ADDR: string

export const getEnv = () => {
  const production = process.env.NODE_ENV === "production"
  invariant(CORE_ADDR, "CORE_ADDR must be defined")
  return {
    CORE_ADDR: CORE_ADDR,
    CORE_URL: `${production ? "https" : "http"}://${CORE_ADDR}`,
    CORE_SOCKET: `${production ? "wss" : "ws"}://${CORE_ADDR}`,
  }
}

type ENV = ReturnType<typeof getEnv>

declare global {
  var ENV: ENV
  interface Window {
    ENV: ENV
  }
}

/**
 * Get the value from an environment variable and throw a
 * MissingEnvironmentError exception if it is not found, optinally you can pass
 * a fallback value to avoid throwing if the environment variable is not defined
 * @param {string} env The environment variable name.
 * @param {string} [fallback] The fallback value in case it's not defined.
 * @throws {MissingEnvironmentError} If the environment variable is not found.
 * @returns {string} The value of the environment variable.
 */
export function env(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback
  if (!value) throw new Error("MISSING ENV VARIABLE: " + name)
  return value
}
