import type { User } from "~/types/User"

type LoaderData = {
  user: User
  token: string
  users: User[]
}

export const CreateNewRole = () => {
  return <div className="create-new-role">CREATE NEW ROLE</div>
}

export default CreateNewRole
