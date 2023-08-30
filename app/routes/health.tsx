import type { LoaderArgs } from "@remix-run/node";

// import { db } from "~/utils/db.server";

export async function loader({ request }: LoaderArgs) {
  const host =
    request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");

  try {
    const url = new URL("/", `http://${host}`);
    await Promise.all([
      // db.session.count(),
      fetch(url.toString(), { method: "HEAD" }).then((r) => {
        if (!r.ok) return Promise.reject(r);
      }),
      fetch(
        `${process.env.NODE_ENV === "production" ? "https" : "http"}://${
          process.env.CORE_ADDR
        }/health`
      ).then((r) => {
        if (!r.ok) return Promise.reject(r);
      }),
    ]);
    return new Response("I'm Alive!");
  } catch (error: unknown) {
    console.log("healthcheck ❌", { error });
    return new Response("ERROR", { status: 500 });
  }
}
