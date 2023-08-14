import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import { TextButton } from "~/components/atoms/Button";
import { requireSessionToken, requireUser } from "~/models/session.server";
import api from "~/utils/core.server";
import { DASHBOARD_PREFIX } from "./app";
import type { User } from "~/types/User";

type LoaderData = {
  user: User;
};

type ActionData = {
  error: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);
  return json<LoaderData>({ user: user });
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const code = form.get("code");

  invariant(code, "Code is required!");

  return await api
    .verifyPhone(await requireSessionToken(request), { code })
    .then(async (res) => {
      const { message } = res.data;
      console.log("Success fully verified user's phone!: ", message);
      return redirect(DASHBOARD_PREFIX + "/profile");
    })
    .catch((err) => {
      console.error(
        "Failed to verify phone number: ",
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

export const VerifyPhone = () => {
  const { user } = useLoaderData<LoaderData>();
  const navigation = useNavigation();
  const actionData = useActionData<ActionData>();

  return (
    <Form className="LoginCard card flex flex-col gap-4" method="POST">
      <h1 className="title font-bold text-2xl text-center">
        Verify Phone Number
      </h1>
      <p>A verification code has been sent to {user.phone}</p>
      <div className="inputs flex flex-col gap-4">
        <label className="label">
          Code:{" "}
          {actionData?.error && (
            <span className="error">{actionData.error}</span>
          )}
          <input name="code" placeholder="* * * *" required />
        </label>
      </div>
      <div className="buttons">
        <TextButton
          className="w-full !bg-primary"
          disabled={navigation.state === "submitting"}
        >
          {navigation.state === "submitting"
            ? `Verifying ${user.phone} ...`
            : "Verify"}
        </TextButton>
      </div>
    </Form>
  );
};

export default VerifyPhone;
