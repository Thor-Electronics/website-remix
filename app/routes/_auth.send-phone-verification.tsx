import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { requireSessionToken, requireUser } from "~/models/session.server";
import api from "~/utils/core.server";
import { DASHBOARD_PREFIX } from "./app";

type ActionData = {
  error: string;
};

export const action: ActionFunction = async ({ request }) => {
  const user = await requireUser(request);
  console.log(`Sending phone verification ${user.name} ${user.phone}`);
  return await api
    .sendPhoneVerification(await requireSessionToken(request))
    .then(async (res) => {
      const { message } = res.data;
      console.log("Sent phone verification code: ", message);
      return redirect("/verify-phone");
    })
    .catch((err) => {
      console.error(
        "Failed to send verification code: ",
        err.response?.data,
        err.response,
        err
      );
      return json<ActionData>(
        { error: err.response?.data?.message },
        err.response?.status
      );
    });
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireUser(request);
  return redirect(DASHBOARD_PREFIX + "/profile");
};
