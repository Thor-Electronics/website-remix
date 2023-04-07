import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { Form, Link, useActionData, useTransition } from "@remix-run/react"
import Button, { TextButton } from "~/components/atoms/Button"
import { createSession, getUserId } from "~/models/session.server"
import type { User } from "~/types/User"
import api from "~/utils/core.server"

type ActionData = {
  errors: {
    email?: string
    password?: string
  }
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const email = form.get("email")
  const password = form.get("password")

  let errors = {
    email: typeof email !== "string" && "Email must be string!",
    password: typeof password !== "string" && "Password must be string!",
  }

  if (Object.values(errors).some(Boolean)) return json({ errors }, 400)

  // call the core service api
  return await api
    .login({ email, password })
    .then(async res => {
      const { user: u, token, message } = res.data
      const user: User = u
      const { session, redirect } = await createSession(
        user.id,
        token,
        // getClientIPAddress(request) ?? "",
        "",
        !user.roles ? "/app" : "/admin"
      )
      return redirect
    })
    .catch(err => {
      console.error("ERROR Logging in: ", err.response?.data, err.response, err)
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

export const Login = () => {
  const transition = useTransition()
  const actionData = useActionData<ActionData>()

  return (
    <Form className="LoginCard card flex flex-col gap-4" method="post">
      <h1 className="title font-bold text-2xl text-center">LOGIN</h1>
      <div className="inputs flex flex-col gap-4">
        <label className="label">
          Email:{" "}
          {actionData?.errors.email && (
            <span className="error">{actionData.errors.email}</span>
          )}
          <input
            type="text"
            name="email"
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
          disabled={transition.state === "submitting"}
        >
          {transition.state === "submitting" ? "Logging In ..." : "Login"}
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
  )
}

export default Login
