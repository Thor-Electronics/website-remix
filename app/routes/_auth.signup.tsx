import { Alert } from "@mui/material";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
// import { getClientIPAddress } from "remix-utils"
import { TextButton } from "~/components/atoms/Button";
import Maintenance from "~/components/organisms/Maintenance";
import { createCookieSession, getUserId } from "~/models/session.server";
import api from "~/utils/core.server";

type ActionData = {
  errors: {
    message?: string;
    phone?: string;
    email?: string;
    username?: string;
    name?: string;
    password?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const phone = form.get("phone");
  // const email = form.get("email");
  // const username = form.get("username");
  const name = form.get("name");
  const password = form.get("password");

  const errors = {
    phone: typeof phone !== "string" && "Phone must be string!",
    // email: typeof email !== "string" && "Email must be string!",
    // username: typeof username !== "string" && "Username must be string!",
    name: typeof name !== "string" && "Name must be string!",
    password: typeof password !== "string" && "Password must be string!",
  };

  if (Object.values(errors).some(Boolean)) return json({ errors }, 400);

  // call the core service api
  return api
    .signup({ phone, name, password })
    .then(async (res) => {
      const { user, token, message } = res.data;
      const { cookieSession, redirect } = await createCookieSession(
        user.id,
        token,
        // getClientIPAddress(request) ?? "",
        request,
        "/app"
      );
      console.log(message, cookieSession.data.userId); // todo: set in cookie and show a snack bar message
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
      console.error("ERROR signing up: ", errMsg);
      return json<ActionData>(
        { errors: { message: errMsg } },
        err.response?.status
      );
    });
};

export const loader: LoaderFunction = async ({ request }) => {
  if (await getUserId(request)) return redirect("/app");
  return null;
};

export const Signup = () => {
  // const loaderData = useLoaderData()
  const navigation = useNavigation();
  const actionData = useActionData<ActionData>();

  return (
    <Form
      className="SignupCard card  max-w-sm flex flex-col gap-4"
      method="POST"
      // reloadDocument
    >
      {/* <Maintenance /> */}
      <h1 className="title font-bold text-2xl text-center">SIGNUP</h1>
      {actionData?.errors?.message && (
        <Alert severity="error">{actionData.errors.message}</Alert>
      )}
      <div className="inputs flex flex-col gap-4">
        <label className="label">
          Phone Number:{" "}
          {actionData?.errors.phone && (
            <span className="error">{actionData.errors.phone}</span>
          )}
          <input
            required
            type="text"
            name="phone"
            placeholder="09123456789"
            minLength={10}
            maxLength={17}
          />
        </label>
        {/* <label className="label">
          Email:{" "}
          {actionData?.errors.email && (
            <span className="error">{actionData.errors.email}</span>
          )}
          <input
            required
            type="email"
            name="email"
            placeholder="john.doe@example.com"
          />
        </label> */}
        <label className="label">
          Name:{" "}
          {actionData?.errors.name && (
            <span className="error">{actionData.errors.name}</span>
          )}
          <input required type="text" name="name" placeholder="John Doe" />
        </label>
        <label className="label">
          Password:{" "}
          {actionData?.errors.password && (
            <span className="error">{actionData.errors.password}</span>
          )}
          <input
            required
            type="password"
            name="password"
            placeholder="Enter your password"
          />
        </label>
        {/* <label className="label">
          Re-Password:
          <input
            type="password"
            name="re_password"
            placeholder="Re-enter your password"
          />
        </label> */}
      </div>
      <div className="buttons">
        <TextButton
          className="w-full !bg-primary"
          disabled={navigation.state === "submitting"}
        >
          {navigation.state === "submitting" ? "Signing Up ..." : "Signup"}
        </TextButton>
      </div>
      <p className="switch text-sm text-center">
        Already have an account?{" "}
        <Link to="/login" prefetch="render" className="font-semibold">
          Login
        </Link>
        .
      </p>
    </Form>
  );
};

export default Signup;
