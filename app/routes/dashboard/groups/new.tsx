import type { ActionFunction } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { useActionData, useTransition } from "@remix-run/react"
import Button, { TextButton } from "~/components/atoms/Button"
import { getSessionData } from "~/models/session.server"
import api from "~/utils/core.server"

type ActionData = {
  errors: {
    name?: string
  }
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const name = form.get("name")

  let errors = {
    name: typeof name !== "string" && "Name must be string!",
  }

  if (Object.values(errors).some(Boolean)) return json({ errors }, 400)

  return await api
    .createGroup(await (await getSessionData(request)).token, {
      name,
    })
    .then(data => redirect(`/dashboard/groups/${data.id}/`))
    .catch(err =>
      json<ActionData>(
        { errors: { name: err.response?.data.message } },
        err.response?.status
      )
    )
}

export const NewGroup = () => {
  const actionData = useActionData<ActionData>()
  const transition = useTransition()

  return (
    <div>
      <form className="flex flex-col gap-4" method="post">
        <h1 className="title font-bold text-2xl text-center">New Group</h1>
        <div className="inputs flex flex-col gap-4">
          <label className="label">
            Name:{" "}
            {actionData?.errors.name && (
              <span className="error">{actionData.errors.name}</span>
            )}
            <input
              type="text"
              name="name"
              placeholder="Oliver St. Villa"
              required
            />
          </label>
        </div>
        <div className="buttons">
          <TextButton
            className="w-full !bg-primary"
            disabled={transition.state === "submitting"}
          >
            {transition.state === "submitting"
              ? "Creating ..."
              : "Create New Group"}
          </TextButton>
        </div>
      </form>
    </div>
  )
}

export default NewGroup
