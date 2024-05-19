import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { TextButton } from "~/components/atoms/Button";
import { createCookieSession, getUserId } from "~/models/session.server";
import cookieSessionStorage from "~/session/cookie.session.server";
import type { User } from "~/types/User";
import api from "~/utils/core.server";

type LoaderData = {
  redirectTo?: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  // console.log("HERE 0")
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirect") as string | undefined;
  // console.log("HERE 1")
  if (await getUserId(request)) return redirect(redirectTo ?? "/app");
  // console.log("HERE 2")
  if (redirectTo) {
    // console.log("HERE 3")
    const cookieSession = await cookieSessionStorage.getSession(
      request.headers.get("Cookie")
    );
    // console.log("HERE 4")
    cookieSession.flash("redirect", redirectTo);
    // cookieSession.flash("message", "Already logged in")
    // console.log("HERE 5", redirectTo)
    return json<LoaderData>(
      { redirectTo },
      {
        headers: {
          "Set-Cookie": await cookieSessionStorage.commitSession(cookieSession),
        },
      }
    );
  }
  // console.log("HERE 6")
  return json<LoaderData>({});
};

type ActionData = {
  errors: {
    message?: string;
    identifier?: string;
    password?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const identifier = form.get("identifier");
  const password = form.get("password");

  const errors = {
    identifier: typeof identifier !== "string" && "Identifier must be string!",
    password: typeof password !== "string" && "Password must be string!",
  };

  if (Object.values(errors).some(Boolean)) return json({ errors }, 400);

  console.log(`${identifier} is logging in...`);
  const startTime = new Date().getTime();
  // call the core service api
  return api
    .login({ identifier, password })
    .then(async (res) => {
      const { user: u, token, message } = res.data;
      const user: User = u;
      let redirectTo = !user.roles ? "/app" : "/panel";
      const cookieSession = await cookieSessionStorage.getSession(
        request.headers.get("Cookie")
      );
      if (cookieSession.has("redirect")) {
        const r = cookieSession.get("redirect");
        redirectTo = r ?? redirectTo;
      }
      const { redirect } = await createCookieSession(
        user.id,
        token,
        request,
        redirectTo
      );
      console.log(
        `${identifier} ${message}(${
          new Date().getTime() - startTime
        }ms). Redirecting them to ${redirectTo}...`
      );
      // todo: set message on snackbar
      return redirect;
    })
    .catch((err) => {
      const errMsg =
        err.response?.data?.message ||
        err.response?.data ||
        err.response ||
        err.message ||
        err ||
        "Unknown error";
      console.error("ERROR Logging in: ", errMsg);
      return json<ActionData>(
        { errors: { message: errMsg, identifier: errMsg } },
        err.response?.status
      );
    });
};

export const Login = () => {
  const navigation = useNavigation();
  const actionData = useActionData<ActionData>();

  return (
    <Form
      className="LoginCard card max-w-sm flex flex-col gap-4"
      method="POST"
      // reloadDocument
    >
      <h1 className="title font-bold text-2xl text-center">LOGIN</h1>
      <div className="inputs flex flex-col gap-4">
        <label className="label">
          Phone / Email / Username:{" "}
          {actionData?.errors.identifier && (
            <span className="error">{actionData.errors.identifier}</span>
          )}
          <input
            type="text"
            name="identifier"
            placeholder="john.doe@example.com"
            required
          />
        </label>
        <label className="label">
          Password:
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            required
          />
        </label>
      </div>
      <div className="buttons">
        <TextButton
          className="w-full !bg-primary"
          disabled={
            navigation.state === "submitting" || navigation.state === "loading"
          }
        >
          {navigation.state === "submitting"
            ? "Logging In ..."
            : navigation.state === "loading"
            ? "Continuing..."
            : "Login"}
        </TextButton>
      </div>
      <p className="switch text-sm text-center">
        Don't have an account?{" "}
        <Link to="/signup" prefetch="render" className="font-semibold">
          Signup
        </Link>
        .
      </p>
    </Form>
  );
};

export default Login;
