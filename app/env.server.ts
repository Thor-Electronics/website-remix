import invariant from "tiny-invariant";
import { config } from "dotenv";

config();

export const getEnv = () => {
  const production = process.env.NODE_ENV === "production";
  const secureCore = process.env.SECURE_CORE === "false" ? false : true;
  invariant(process.env.CORE_ADDR, "CORE_ADDR must be defined");
  console.log(
    `[ENV] Using ${secureCore ? "" : "un"}secure core ${process.env.CORE_ADDR}`
  );
  return {
    CORE_ADDR: process.env.CORE_ADDR,
    CORE_URL: `${secureCore ? "https" : "http"}://${process.env.CORE_ADDR}`,
    CORE_SOCKET: `${production ? "wss" : "ws"}://${process.env.CORE_ADDR}`,
    NODE_ENV: process.env.NODE_ENV,
    PRODUCTION: production,
  };
};

type ENV = ReturnType<typeof getEnv>;

declare global {
  const ENV: ENV;
  interface Window {
    ENV: ENV;
  }
}
