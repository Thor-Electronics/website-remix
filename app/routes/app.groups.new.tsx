import type { ActionFunction } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { useActionData, useNavigation } from "@remix-run/react"
import Button, { TextButton } from "~/components/atoms/Button"
import { getSessionData } from "~/models/session.server"
import { GroupType } from "~/types/Group"
import api from "~/utils/core.server"

type ActionData = {
  errors: {
    name?: string
    typ?: string
  }
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const name = form.get("name")
  const typ = form.get("type")

  console.log("RESULT", typ, Object.values(GroupType).includes(typ))

  let errors = {
    name: typeof name !== "string" && "Name must be string!",
    typ:
      (typeof typ !== "string" && "Type must be string!") ||
      (!Object.values(GroupType).includes(typ) && "Invalid group type!"),
  }

  if (Object.values(errors).some(Boolean)) return json({ errors }, 400)

  return await api
    .createGroup(await (await getSessionData(request)).token, {
      name,
      type: typ,
    })
    .then(data => redirect(`/app/groups/${data.id}/`))
    .catch(err =>
      json<ActionData>(
        { errors: { name: err.response?.data.message } },
        err.response?.status
      )
    )
}

export const NewGroup = () => {
  const actionData = useActionData<ActionData>()
  const navigation = useNavigation()

  return (
    <div>
      <form className="flex flex-col gap-4" method="post">
        <h1 className="title font-bold text-2xl text-center">
          Create New Group
        </h1>
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
          <label className="label">
            Type:{" "}
            {actionData?.errors.typ && (
              <span className="error">{actionData.errors.typ}</span>
            )}
            <select name="type" required className="mt-2 bg-white">
              {Object.entries(GroupType).map(([k, v]) => (
                <option key={k} value={v}>
                  {k}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="buttons">
          <TextButton
            className="w-full !bg-primary"
            disabled={navigation.state === "submitting"}
          >
            {navigation.state === "submitting"
              ? "Creating ..."
              : "Create New Group"}
          </TextButton>
        </div>
      </form>
    </div>
  )
}

export default NewGroup
