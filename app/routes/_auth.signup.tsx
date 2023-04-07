import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { fetch, json, redirect } from "@remix-run/node"
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react"
// import { getClientIPAddress } from "remix-utils"
import Button, { TextButton } from "~/components/atoms/Button"
import {
  createSession,
  getSessionData,
  getUserId,
} from "~/models/session.server"
import api, { signup } from "~/utils/core.server"

type ActionData = {
  errors: {
    email?: string
    name?: string
    password?: string
  }
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const email = form.get("email")
  const name = form.get("name")
  const password = form.get("password")

  let errors = {
    email: typeof email !== "string" && "Email must be string!",
    name: typeof name !== "string" && "Name must be string!",
    password: typeof password !== "string" && "Password must be string!",
  }

  if (Object.values(errors).some(Boolean)) return json({ errors }, 400)

  // call the core service api
  return await api
    .signup({ email, name, password })
    .then(async res => {
      const { user, token, message } = res.data
      const { session, redirect } = await createSession(
        user.id,
        token,
        // getClientIPAddress(request) ?? "",
        "",
        "/app"
      )
      return redirect
    })
    .catch(err => {
      console.error("ERROR signing up: ", err.response?.data, err.response, err)
      return json<ActionData>(
        { errors: { email: err.response?.data?.message } },
        err.response?.status
      )
    })
}

export const loader: LoaderFunction = async ({ request }) => {
  if (await getUserId(request)) return redirect("/app")
  return null
}

export const Signup = () => {
  // const loaderData = useLoaderData()
  const transition = useTransition()
  const actionData = useActionData<ActionData>()

  return (
    <Form className="SignupCard card flex flex-col gap-4" method="post">
      <h1 className="title font-bold text-2xl text-center">SIGNUP</h1>
      <div className="inputs flex flex-col gap-4">
        <label className="label">
          Email:{" "}
          {actionData?.errors.email && (
            <span className="error">{actionData.errors.email}</span>
          )}
          <input
            required
            type="text"
            name="email"
            placeholder="john.doe@example.com"
          />
        </label>
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
          disabled={transition.state === "submitting"}
        >
          {transition.state === "submitting" ? "Signing Up ..." : "Signup"}
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
  )
}

export default Signup
